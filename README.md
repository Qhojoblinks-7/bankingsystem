---

# Banking System Project

## Overview

The **Banking System Project** is a full-stack web application built with **React** for the frontend, **Supabase** for the backend, and **Node.js/Express** for API management. This system supports key banking operations such as account management, transaction processing, and loan applications, providing customers and administrators a streamlined and efficient experience.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Installation Guide](#installation-guide)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Project Structure

### **Folder Structure Overview**

```
banking-system/
│
├── backend/                   # Backend folder for Node.js or Express
│   ├── node_modules/           # Installed node modules
│   ├── controllers/            # Business logic for handling requests
│   │   ├── authController.js   # Handles authentication logic
│   │   ├── transactionController.js # Handles transaction logic
│   │   └── loanController.js   # Handles loan logic
│   ├── models/                 # Database models (if needed)
│   │   └── transactionModel.js # Transaction model (for custom logic)
│   ├── routes/                 # Express routes
│   │   └── apiRoutes.js        # API routes for transactions, accounts, etc.
│   ├── config/                 # Configuration files (Supabase client setup)
│   │   └── supabaseClient.js   # Supabase configuration and initialization
│   ├── server.js               # Main Express server entry point
│   ├── .env                    # Environment variables (e.g., Supabase URL and key)
│   ├── package.json            # Backend project dependencies
│   └── package-lock.json       # Lock file for consistent dependency versions
│
├── frontend/                   # Frontend folder for React
│   ├── public/                 # Public folder for static assets
│   │   └── index.html          # HTML file that serves the React app
│   ├── src/                    # Source code for React app
│   │   ├── assets/             # Folder for images, icons, etc.
│   │   ├── components/         # Reusable React components
│   │   │   ├── Header.js       # Header component
│   │   │   ├── Footer.js       # Footer component
│   │   │   └── Transaction.js  # Transaction component
│   │   ├── pages/              # Pages (views) for the app
│   │   │   ├── Home.js         # Home page
│   │   │   ├── Dashboard.js    # Dashboard page for logged-in users
│   │   │   └── Account.js      # Account page for viewing account details
│   │   ├── services/           # Folder for services like API calls
│   │   │   └── supabaseService.js # Service to interact with Supabase
│   │   ├── App.js              # Main React component
│   │   ├── index.js            # React entry point (render app)
│   │   └── .env                # Frontend environment variables (e.g., Supabase key)
│   ├── package.json            # Frontend project dependencies
│   └── package-lock.json       # Lock file for consistent dependency versions
│
└── README.md                   # Project documentation file
```

---

## Technologies Used

- **Frontend:**
  - **React.js**: A JavaScript library for building user interfaces.
  - **React Router**: For navigation and handling routing between pages (Dashboard, Account, Transactions).
  - **Axios**: For making HTTP requests to communicate with the backend and Supabase.
  - **Supabase**: For backend-as-a-service (BaaS) providing database, authentication, and file storage.

- **Backend:**
  - **Node.js**: JavaScript runtime environment for building the backend.
  - **Express.js**: Web framework for building RESTful APIs.
  - **Supabase**: Backend service for handling user authentication, real-time database, and file storage.
  - **dotenv**: For managing environment variables securely.

- **Database:**
  - **PostgreSQL** (via Supabase): A relational database system used to store user data, transactions, and loan applications.

---

## Features

1. **Account Management**:
   - User registration and login (via Supabase authentication).
   - View account balance and transaction history.

2. **Transaction Management**:
   - Deposit funds into the user account.
   - Withdraw funds from the user account.
   - Transfer funds to other accounts.

3. **Loan Application**:
   - Users can apply for loans.
   - Admin can approve or reject loan applications.

4. **Admin Dashboard**:
   - Admin view to manage users, approve loan applications, and monitor transactions.

5. **Security**:
   - Role-based authentication (users vs admins).
   - Secure API endpoints with token-based authentication.

---

## Installation Guide

### **Backend Setup**

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/banking-system.git
    cd banking-system/backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `backend` folder and add the following:

      ```env
      SUPABASE_URL=<your_supabase_url>
      SUPABASE_KEY=<your_supabase_key>
      PORT=5000
      ```

    - Replace `<your_supabase_url>` and `<your_supabase_key>` with your actual Supabase credentials.

4. Start the backend server:

    ```bash
    npm start
    ```

    This will start the Express server on **localhost:5000**.

---

### **Frontend Setup**

1. Navigate to the `frontend` folder:

    ```bash
    cd ../frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the `frontend` folder and add the following:

      ```env
      REACT_APP_SUPABASE_URL=<your_supabase_url>
      REACT_APP_SUPABASE_KEY=<your_supabase_key>
      ```

4. Start the React app:

    ```bash
    npm start
    ```

    This will start the React app on **localhost:3000**.

---

## API Documentation

### **Authentication Endpoints**

- **POST** `/api/signup`: Register a new user.
  - **Body**: `{ "email": "user@example.com", "password": "password123" }`
  - **Returns**: `{ "status": "success", "message": "User created successfully" }`

- **POST** `/api/login`: Login an existing user.
  - **Body**: `{ "email": "user@example.com", "password": "password123" }`
  - **Returns**: `{ "status": "success", "message": "Login successful", "token": "<auth_token>" }`

### **Transaction Endpoints**

- **POST** `/api/deposit`: Deposit funds into the user account.
  - **Body**: `{ "amount": 100 }`
  - **Returns**: `{ "status": "success", "message": "Deposit successful", "balance": 100 }`

- **POST** `/api/withdraw`: Withdraw funds from the user account.
  - **Body**: `{ "amount": 50 }`
  - **Returns**: `{ "status": "success", "message": "Withdrawal successful", "balance": 50 }`

- **POST** `/api/transfer`: Transfer funds between accounts.
  - **Body**: `{ "recipient_account": "123456", "amount": 30 }`
  - **Returns**: `{ "status": "success", "message": "Transfer successful", "balance": 20 }`

### **Loan Endpoints**

- **POST** `/api/loan`: Apply for a loan.
  - **Body**: `{ "amount": 1000, "term": 12 }`
  - **Returns**: `{ "status": "success", "message": "Loan application submitted" }`

---

## Environment Variables

In both the backend and frontend, set the following environment variables:

- **SUPABASE_URL**: The URL of your Supabase project (e.g., `https://xyzcompany.supabase.co`).
- **SUPABASE_KEY**: The public API key for your Supabase project.
- **PORT**: (Backend only) Port number for the backend server (default `5000`).

For the frontend, use the `REACT_APP_` prefix, e.g., `REACT_APP_SUPABASE_URL`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---