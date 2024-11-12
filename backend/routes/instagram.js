const express = require('express');
const router = express.Router();
const { wrap, configure } = require('agentql');
const { LOGIN_QUERY, PAGE_NOT_AVAILABLE_QUERY, SELECT_RECIPIENT_QUERY, SEND_MESSAGE_QUERY } = require('../queries/instagram');
const { chromium } = require('playwright');

async function isLoggedIn(page) {
    try {
        // Check for login-specific elements
        const loginButton = await page.$('button[type="submit"]');
        const loginInput = await page.$('input[name="username"]');
        
        // If these elements exist, we're on the login page (not logged in)
        if (loginButton && loginInput) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

// Instagram login and send message route
router.post('/instagram/send-message', async (req, res) => {
    try {
        const { username, password, recipient, message } = req.body;

        if(recipient === username) {
            return res.status(400).json({
                success: false,
                message: 'You cannot send a message to yourself'
            });
        }
        
        configure({
            apiKey: process.env.API_KEY,
            timeout: "30000"  // Changed to string format
        });
        
        let browser;
        try {
            // Launch new browser instance
            browser = await chromium.launch({
                headless: false,
                args: ['--start-maximized']
            });
            const context = await browser.newContext();
            const page = await wrap(await context.newPage());
            
            // Navigate to Instagram login page
            await page.goto('https://www.instagram.com/accounts/login');
            await page.waitForTimeout(5000);

            // Check if already logged in
            const loggedIn = await isLoggedIn(page);
            if (!loggedIn) {
                const response = await page.queryElements(LOGIN_QUERY);
                await response.username.fill(username);
                await response.password.fill(password);
                await response.button.click();
                await page.waitForTimeout(5000);
                
                // Verify login success
                const postLoginUrl = await page.url();
                if (postLoginUrl.includes('login')) {
                    browser.close();
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Login failed - check credentials'
                    });
                }
            }

            // Continue with sending message (already logged in or just logged in)
            await page.goto(`https://www.instagram.com/${recipient}`);
            await page.waitForTimeout(2000);

            // Check if page exists
            const pageNotAvailableQuery = await page.queryElements(PAGE_NOT_AVAILABLE_QUERY);
            if (pageNotAvailableQuery.page_not_available_text) {
                await browser.close();
                return res.status(404).json({ 
                    success: false, 
                    message: 'Recipient account not found' 
                });
            }

            // If page exists, continue with the message button
            const recipientQuery = await page.queryElements(SELECT_RECIPIENT_QUERY);
            try {
                await recipientQuery.send_message_button.click();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(3000);

                await page.waitForSelector("div[aria-label='Message']", { state: 'visible', timeout: 10000 });
                await page.type("div[aria-label='Message']", message);
                await page.keyboard.press('Enter');
                await page.waitForTimeout(2000);

                // Wait for message to be sent and any potential errors
                await page.waitForTimeout(3000);
                
                // Close browser before sending response
                await browser.close();
                
                // Send response only after all processes are complete
                return res.json({
                    success: true,
                    message: 'Message sent successfully'
                });

            } catch (error) {
                await browser.close();
                return res.status(403).json({ 
                    success: false, 
                    message: 'Failed to send message',
                    details: error.message
                });
            }

        } catch (error) {
            if (error.message.includes('ECONNREFUSED')) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Chrome not running with remote debugging. Run: npm run chrome:mac',
                    details: 'Start Chrome with remote debugging first'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Instagram operation error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Something went wrong' 
        });
    }
});

module.exports = router;