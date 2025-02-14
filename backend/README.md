Below is a reorganized and comprehensive README (in Markdown) that documents your Supabase-backed Banking API & Database. This README covers setup, configuration, API endpoints, authentication, testing, deployment, and more. Save this content as `README.md` in your project root.

---

```markdown
# Express Supabase Banking API

This project provides a simple backend for a banking application built using Node.js, Express, Supabase, PostgreSQL, and JWT-based authentication. It supports user registration, login, bank account creation, transaction recording, atomic fund transfers (using a stored procedure), and user profile retrieval.

---

## Table of Contents

- [Overview](#overview)
- [Database Schema Overview](#database-schema-overview)
- [API Endpoints](#api-endpoints)
- [Authentication Workflow](#authentication-workflow)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Testing the API](#testing-the-api)
- [Deployment Considerations](#deployment-considerations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This project demonstrates how to build a Supabase-backed banking system with the following core features:

- **User Registration & Profile Management:**  
  Capture full name, email, phone number, date of birth, residential address, account type, username, and hashed password.

- **User Authentication:**  
  Login with email and password; issue JWT tokens for protecting subsequent endpoints.

- **Bank Account Creation:**  
  Create bank accounts associated with registered users.

- **Transaction Processing:**  
  Record deposits, withdrawals, and other transactions.

- **Atomic Fund Transfers:**  
  Perform inter-account transfers atomically via a stored procedure (`transfer_funds`).

- **Expenditure Tracking:**  
  Log expenditures for each bank account.

The API uses environment variables (via a `.env` file) to securely store connection strings, keys, and secrets.

---

## Database Schema Overview

The Supabase PostgreSQL database includes the following tables:

1. **user_accounts**  
   Stores user registration details such as full name, email, phone number, date of birth, address, account type, username, and hashed password.

2. **bank_accounts**  
   Stores bank account details linked to a user. Each account records its type (e.g., checking or savings) and balance.

3. **transactions**  
   Logs financial transactions (deposits, withdrawals, etc.) for each bank account.

4. **loans**  
   Stores loan records with loan amount, interest rate, and status.

5. **transfers**  
   Records inter-account fund transfers. Transfers are performed atomically using the stored procedure `transfer_funds`.

6. **expenditures**  
   Logs expenditures against a bank account by category (e.g., food, bills).

Indexes are added on key columns (e.g., email, user_id, account references) to improve query performance.

---

## API Endpoints

> **Note:** All endpoints (except those for login) are protected using JWT authentication. Include the JWT token in the `Authorization` header as:  
> `Authorization: Bearer <your-jwt-token>`

### 1. Test Connection

- **Endpoint:** `GET /api/test-connection`  
- **Description:** Verifies connectivity with the Supabase database (for example, by querying the `user_accounts` table).  
- **Example Request:**
  ```bash
  curl http://localhost:3000/api/test-connection
  ```
- **Example Response:**
  ```json
  {
    "message": "Connection successful",
    "data": [ ... ]
  }
  ```

### 2. User Registration

- **Endpoint:** `POST /api/register`  
- **Description:** Registers a new user by inserting their details into `user_accounts`.  
- **Request Body Example:**
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone_number": "1234567890",
    "date_of_birth": "1990-01-01",
    "residential_address": "123 Main St",
    "account_type": "savings",
    "username": "johndoe",
    "password": "yourpassword"
  }
  ```
- **Example Response:**
  ```json
  {
    "user": {
      "user_id": "11111111-1111-1111-1111-111111111111",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "1234567890",
      "date_of_birth": "1990-01-01",
      "residential_address": "123 Main St",
      "account_type": "savings",
      "username": "johndoe",
      "created_at": "2025-02-11T20:00:00.000Z"
    }
  }
  ```

### 3. User Login

- **Endpoint:** `POST /api/login`  
- **Description:** Authenticates a user, compares the provided password to the stored hash, and issues a JWT token.
- **Request Body Example:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Example Response:**
  ```json
  {
    "token": "<jwt-token>",
    "user": {
      "user_id": "11111111-1111-1111-1111-111111111111",
      "email": "john@example.com"
      // Additional fields...
    }
  }
  ```

### 4. Create Bank Account

- **Endpoint:** `POST /api/create-account`  
- **Description:** Creates a new bank account associated with the given user.
- **Request Body Example:**
  ```json
  {
    "user_id": "11111111-1111-1111-1111-111111111111",
    "account_type": "checking"
  }
  ```
- **Example Response:**
  ```json
  {
    "account": {
      "account_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "user_id": "11111111-1111-1111-1111-111111111111",
      "account_type": "checking",
      "balance": 0.00,
      "created_at": "2025-02-11T20:05:00.000Z"
    }
  }
  ```

### 5. Create Transaction

- **Endpoint:** `POST /api/transaction`  
- **Description:** Records a financial transaction (deposit, withdrawal, etc.) for a bank account.
- **Request Body Example:**
  ```json
  {
    "account_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "transaction_type": "deposit",
    "amount": 500.00,
    "description": "Initial deposit"
  }
  ```
- **Example Response:**
  ```json
  {
    "transaction": {
      "transaction_id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
      "account_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "transaction_type": "deposit",
      "amount": 500.00,
      "transaction_timestamp": "2025-02-11T20:10:00.000Z",
      "description": "Initial deposit"
    }
  }
  ```

### 6. Atomic Transfer

- **Endpoint:** `POST /api/transfer`  
- **Description:** Performs an atomic fund transfer between two accounts using a stored procedure (`transfer_funds`).
- **Request Body Example:**
  ```json
  {
    "from_account": "cccccccc-cccc-cccc-cccc-cccccccccccc",
    "to_account": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "amount": 300.00,
    "description": "Payment for services"
  }
  ```
- **Example Response:**
  ```json
  {
    "transfer": {
      "transfer_id": "ffffffff-ffff-ffff-ffff-ffffffffffff"
      // Additional transfer details returned by the stored procedure...
    }
  }
  ```
> **Important:** Ensure that the `transfer_funds` stored procedure is defined in your database per your business rules.

### 7. Get User Profile

- **Endpoint:** `GET /api/user/:id`  
- **Description:** Retrieves the details of a user from `user_accounts` based on the provided user ID.
- **Example Request:**
  ```bash
  curl -H "Authorization: Bearer <your-jwt-token>" http://localhost:3000/api/user/11111111-1111-1111-1111-111111111111
  ```
- **Example Response:**
  ```json
  {
    "user": {
      "user_id": "11111111-1111-1111-1111-111111111111",
      "full_name": "John Doe",
      "email": "john@example.com",
      // Additional fields...
    }
  }
  ```

---

## Authentication Workflow

1. **User Registration:**  
   - New users register via the `/api/register` endpoint.
2. **User Login:**  
   - Users authenticate via `/api/login` to receive a JWT token.
3. **Protected Endpoints:**  
   - All endpoints under `/api` require the JWT token in the `Authorization` header:
     ```
     Authorization: Bearer <your-jwt-token>
     ```

---

## Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the project root with the following content (replace with your actual values):

   ```ini
   SUPABASE_URL=https://your-supabase-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgres://username:password@host:port/database
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Set Up the Database**

   - Use the Supabase SQL Editor or `psql` to run your database schema creation scripts (which include table creation, indexes, and dummy data).
   - Ensure that the `transfer_funds` stored procedure is created in your database.

---

## Running the Application

Start the API server by running:

```bash
node server.js
```

Or, if you have configured a start script in your `package.json`:

```bash
npm run start
```

The server will start on the port specified in your `.env` file (default is 3000).

---

## Testing the API

- **Manual Testing:**  
  Use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to send requests to the endpoints and verify their functionality.

- **Command-Line Testing:**  
  Use `curl` to test endpoints. For example, to register a user:

  ```bash
  curl -X POST http://localhost:3000/api/register \
    -H "Content-Type: application/json" \
    -d '{
          "full_name": "John Doe",
          "email": "john@example.com",
          "phone_number": "1234567890",
          "date_of_birth": "1990-01-01",
          "residential_address": "123 Main St",
          "account_type": "savings",
          "username": "johndoe",
          "password": "yourpassword"
        }'
  ```

---

## Deployment Considerations

- **Environment Variables:**  
  Ensure that your deployment environment securely manages sensitive values using your provider's secret management features.

- **Security:**  
  Use HTTPS in production and secure all endpoints using JWT authentication.

- **Scaling:**  
  Monitor your database and API performance; adjust connection pools, indexes, and API endpoints as needed.

- **CI/CD:**  
  Consider setting up automated tests and deployment pipelines (e.g., using GitHub Actions) for continuous integration and deployment.

---

## Contributing

Contributions, issues, and feature requests are welcome. Please open an issue or submit a pull request in the repository.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For any questions or support, please open an issue in the repository or contact the maintainer.

---
```