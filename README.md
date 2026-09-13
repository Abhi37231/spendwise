# SpendWise - Student Expense Tracker 💸

"Take control of your money, one expense at a time."

SpendWise is a beautiful, modern full-stack web application designed to help you track your expenses, set budgets, and gain financial insights through interactive charts.

---

## 🚀 Quick Start Guide

Follow these step-by-step instructions to get the project running on your local machine.

### Step 1: Prerequisites
Before you begin, ensure you have the following installed on your computer:
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** (using XAMPP, WAMP, or standalone MySQL Server) - [Download XAMPP here](https://www.apachefriends.org/index.html)
3. **Git** - [Download here](https://git-scm.com/)

### Step 2: Database Setup
1. Open your **XAMPP Control Panel** (or your preferred MySQL manager) and start the **MySQL** service.
2. Open your MySQL client (like phpMyAdmin at `http://localhost/phpmyadmin` or MySQL Workbench).
3. Create a new empty database named `spendwise`:
   ```sql
   CREATE DATABASE spendwise;
   ```

### Step 3: Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Git Bash) and run:
```bash
git clone https://github.com/Abhi37231/spendwise.git
cd spendwise
```

### Step 4: Backend Setup
Open a new terminal window inside the `spendwise` folder and run:
```bash
cd backend
npm install
```

Next, create the environment variables file:
1. Inside the `backend` folder, duplicate the `.env.example` file and rename the copy to `.env`.
2. Open `.env` and ensure the database credentials match your local MySQL setup (XAMPP default username is usually `root` with a blank password):
   ```env
   # Example for XAMPP (no password):
   DATABASE_URL="mysql://root:@localhost:3306/spendwise"
   
   # Or if you have a password:
   # DATABASE_URL="mysql://root:yourpassword@localhost:3306/spendwise"
   ```

Now, initialize the database tables using Prisma:
```bash
npx prisma db push
```

Finally, start the backend server:
```bash
npm run dev
```
*(The backend should now be running on `http://localhost:5000`)*

### Step 5: Frontend Setup
Open a **second** terminal window inside the root `spendwise` folder and run:
```bash
cd frontend
npm install
```

Start the frontend server:
```bash
npm run dev
```
*(The frontend should now be running on `http://localhost:5173`)*

---

## 🎉 You're Done!
Open your browser and navigate to **`http://localhost:5173`**.

**Testing the App:**
1. Click **Get Started** to create a new account.
2. Go to the **Budget** tab and set a monthly budget (e.g., 5000).
3. Go to the **Add Expense** tab and log a few test transactions.
4. Visit your **Dashboard** and **Analytics** to see the interactive charts come to life with your data!

---

## 🛠 Tech Stack
- **Frontend**: React.js (Vite), TypeScript, Tailwind CSS v4, Recharts
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) & bcrypt password hashing
