# AI-Driven Full-Stack Expense Tracker

A modern MERN stack application to track your expenses, enriched with an AI service that automatically categorizes descriptions, detects unusual spending, maps out budget predictions, and gives tailored financial insights!

## Features
- **Secure Authentication**: JWT-based authentication, bcrypt hashed passwords.
- **Dynamic Dashboard**: View your total spending, category-wise pie charts, and monthly trend line graphs.
- **Expense Management**: Add, modify, delete, and list expenses with advanced fields (category, payment method, notes).
- **AI Automation**:
  - Auto-categorize descriptions (e.g. "Uber" -> Transportation).
  - Detect unusually high spending based on your history.
  - Generate personalized financial insights.
  - Predict future spending trends.
- **Modern UI**: Fully responsive frontend built with React.js and Tailwind CSS (charting handled via Chart.js & react-chartjs-2).

## Tech Stack
- Frontend: React.js (Vite), Tailwind CSS, Axios, Chart.js, React-Router-DOM
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- AI Service: OpenAI API (Mocked gracefully if no API key is provided!)

## Setup & Running the Application

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 2. Environment Variables
In the `backend` folder, copy `.env.example` to a new file named `.env`:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
JWT_SECRET=supersecret123
JWT_EXPIRE=30d
OPENAI_API_KEY=your_openai_api_key_here (optional)
```

*(Note: The AI features will seamlessly fallback to mocked offline logic if you don't provide an `OPENAI_API_KEY`!)*

### 3. Installation

Install all backend and frontend dependencies directly from the root project folder:

```bash
npm run install-all
```
*(Alternatively: manually run `npm install` inside both `backend` and `frontend` folders, and `npm install concurrently` at the root).*

### 4. Start the Application

To run both the backend server and frontend development server simultaneously:

```bash
npm start
```

- Frontend App will run on `http://localhost:5173`
- Backend API will run on `http://localhost:5000`

### 5. Access the Platform
Navigate to `http://localhost:5173` in your browser. Register a new user, log in, and start tracking your expenses!
