# SpendWise - Student Expense Tracker

"Take control of your money, one expense at a time."

SpendWise is a modern, production-quality SaaS dashboard application designed to help students track their expenses, set budgets, and gain financial insights. 

Built with the MERN stack (MySQL, Express, React, Node) replacing MongoDB with MySQL via Prisma.

## Features

- **Dashboard**: High-level overview of total spent, budget remaining, daily average, and visual charts.
- **Transactions**: Track all expenses, search, filter by category, and delete entries.
- **Budgeting**: Set monthly budgets and individual category budgets with color-coded progress bars.
- **Analytics**: Deep dive into spending trends, monthly comparisons, and financial insights.
- **Dark Mode**: Native, beautiful dark mode support.
- **Authentication**: JWT-based secure authentication.
- **Responsive**: Works perfectly on Desktop, Tablet, and Mobile.

## Tech Stack

### Frontend
- React.js (Vite)
- TypeScript
- Tailwind CSS
- shadcn/ui inspired components
- Lucide React icons
- Recharts for data visualization
- React Router DOM
- React Hook Form + Zod validation

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL Database
- JWT Auth & bcrypt

---

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MySQL Server (running locally on port 3306)

### 1. Database Setup
Ensure you have MySQL installed and running. Create the database:
```sql
CREATE DATABASE spendwise;
```

### 2. Backend Setup
Navigate to the `backend` directory and set up the environment:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/spendwise"
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

Push the database schema (this generates the tables):
```bash
npx prisma db push
```

Start the backend server in development mode:
```bash
npm run dev
# The server will run on http://localhost:5000
```

*Note: Update the package.json scripts with `"dev": "nodemon src/server.ts"` if not present.*

### 3. Frontend Setup
Navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# The app will open on http://localhost:5173
```

---

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile (Protected)

### Expenses
- `GET /api/expenses` - Get all expenses (Protected)
- `GET /api/expenses/:id` - Get specific expense (Protected)
- `POST /api/expenses` - Create expense (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)

### Budgets
- `GET /api/budget` - Get monthly budget (Protected)
- `POST /api/budget` - Create/Update monthly budget (Protected)
- `GET /api/budget/categories` - Get category budgets (Protected)
- `POST /api/budget/categories` - Update category budget (Protected)

### Analytics
- `GET /api/analytics/summary` - Get summary data (Protected)
- `GET /api/analytics/categories` - Get category breakdown (Protected)
- `GET /api/analytics/monthly` - Get monthly trend data (Protected)

---

## Screenshots & Demo Data

When you first launch the app, create a new account via the Register page.
To see the full potential of the dashboard:
1. Go to "Budget" and set a monthly budget (e.g., 5000).
2. Go to "Add Expense" and add 5-10 expenses across different categories (Food, Travel, Education) and different dates.
3. Visit the Dashboard and Analytics pages to view the generated charts and insights.

---

## Design Choices
- **UI/UX**: Custom components built with Tailwind CSS, inspired by `shadcn/ui`, to maintain full control over the styling and avoid boilerplate.
- **State**: React Context API for global states like Auth and Theme, avoiding the overhead of Redux.
- **Validation**: Zod + React Hook Form provides a type-safe, seamless client-side validation experience.

© 2026 SpendWise. All rights reserved.
