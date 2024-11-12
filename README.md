# Instagram Message Sender

A full-stack application that enables sending Instagram messages through a web interface with both standard and API modes.

## 🌟 Features

- Web interface for Instagram message sending
- API mode for programmatic access
- Automated Instagram login and message sending
- Real-time form validation with Zod
- Error handling and user feedback
- Responsive UI with shadcn/ui components

## 🏗 Project Structure

instagram-message-sender/
├── frontend/ # React + TypeScript frontend
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── lib/ # Utilities and schemas
│ │ └── types/ # TypeScript definitions
└── backend/ # Node.js + Express backend
├── routes/ # API endpoints
└── queries/ # Instagram automation queries

## 🚀 Backend Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Chrome browser (for Playwright)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
API_KEY=your_agentql_api_key
```

4. Start Chrome with remote debugging (keep this terminal open):
```bash
# On macOS
npm run chrome:mac
```

5. Start the development server:
```bash
npm run dev
```

## 🎨 Frontend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

## 🔌 API Usage

### Message Schema
```typescript
{
  username: string    // Instagram username
  password: string    // Instagram password
  recipient: string   // Recipient's username
  message: string     // Message to send
}
```

### API Endpoints

#### Send Message
`POST /api/instagram/send-message`

Request body:
```json
{
  "username": "your_instagram_username",
  "password": "your_instagram_password",
  "recipient": "recipient_username",
  "message": "your message"
}
```

Success Response:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "details": "Additional error information"
}
```

## 🔒 Security Notes

- Credentials are never stored
- Environment variables for sensitive data
- CORS protection enabled
- Input validation on both ends
- Error messages sanitized
- Automated browser session management

## ⚠️ Important Notes

1. Chrome must be running with remote debugging enabled
2. Valid Instagram credentials required
3. Cannot send messages to yourself
4. Rate limiting may apply
5. Some Instagram features may require additional handling

## 📝 Development

### Git Ignore Patterns
```gitignore:backend/.gitignore
startLine: 1
endLine: 66
```

### ESLint Configuration
```markdown:frontend/README.md
startLine: 10
endLine: 50
```

