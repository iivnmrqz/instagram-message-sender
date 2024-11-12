const LOGIN_QUERY = `
{
    username
    password
    button
}
`;

const SELECT_RECIPIENT_QUERY = `
{
    send_message_button
}
`;



const SEND_MESSAGE_QUERY = `
{
    message_input {
        waitForSelector(selector: "div[aria-label='Message']")
        type(text: $message)
    }
    send_button {
        click
    }
}
`;

const PAGE_NOT_AVAILABLE_QUERY = `
{
    page_not_available_text
}
`;

const selectors = {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    button: 'button[type="submit"]',
    sendMessageDiv: 'div[role="button"]:has-text("Send message")'
};

module.exports = {
    LOGIN_QUERY,
    selectors,
    SELECT_RECIPIENT_QUERY,
    SEND_MESSAGE_QUERY,
    PAGE_NOT_AVAILABLE_QUERY
}; 