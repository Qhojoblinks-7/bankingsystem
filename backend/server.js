// server.js
require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Import the Supabase client from supabaseClient.js
const supabase = require('./supabaseClient');

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Initialize PostgreSQL client using environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// -----------------------------------------------------------------
// JWT Authentication Middleware
// -----------------------------------------------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expect header in the format "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user; // Attach decoded token info to request
    next();
  });
}

// -----------------------------------------------------------------
// Serve userDashBoard.html
// -----------------------------------------------------------------
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'userDashBoard.html'));
});

// -----------------------------------------------------------------
// Test Connection Endpoint
// -----------------------------------------------------------------
app.get('/api/test-connection', async (req, res) => {
  try {
    // Query the user_accounts table as a connection test
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .limit(1);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ message: 'Connection successful', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Login Endpoint (for issuing JWT tokens)
// -----------------------------------------------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Retrieve user by email
    const { data: user, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error || !user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Issue a JWT token (include user_id and email)
    const tokenPayload = { user_id: user.user_id, email: user.email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protect endpoints below this middleware
app.use('/api', authenticateToken);

// -----------------------------------------------------------------
// Registration Endpoint
// -----------------------------------------------------------------
app.post('/api/register', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone_number,
      date_of_birth,
      residential_address,
      account_type,
      username,
      password,
    } = req.body;

    // Hash the password with bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert a new user record into user_accounts
    const { data, error } = await supabase
      .from('user_accounts')
      .insert([{
        full_name,
        email,
        phone_number,
        date_of_birth,
        residential_address,
        account_type,
        username,
        password_hash,
      }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Create Bank Account Endpoint
// -----------------------------------------------------------------
app.post('/api/create-account', async (req, res) => {
  try {
    const { user_id, account_type } = req.body;

    const { data, error } = await supabase
      .from('bank_accounts')
      .insert([{ user_id, account_type }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ account: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Create Transaction Endpoint
// -----------------------------------------------------------------
app.post('/api/transaction', async (req, res) => {
  try {
    const { account_id, transaction_type, amount, description } = req.body;

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ account_id, transaction_type, amount, description }])
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ transaction: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Atomic Transfer Endpoint using Stored Procedure
// -----------------------------------------------------------------
app.post('/api/transfer', async (req, res) => {
  try {
    const { from_account, to_account, amount, description } = req.body;

    // Call the stored procedure 'transfer_funds' to perform the atomic transfer.
    // Make sure you have already created the transfer_funds function in your database.
    const { data, error } = await supabase
      .rpc('transfer_funds', {
        p_from_account: from_account,
        p_to_account: to_account,
        p_amount: amount,
        p_description: description,
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ transfer: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Get User Profile Endpoint
// -----------------------------------------------------------------
app.get('/api/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('user_accounts')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ user: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Get Balance Endpoint
// -----------------------------------------------------------------
app.get('/api/balance', async (req, res) => {
  try {
    const { user_id } = req.user;
    // For demonstration purposes, assume balance is stored in bank_accounts table.
    // You might need to adjust this query if balance is stored elsewhere.
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('balance')
      .eq('user_id', user_id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ balance: data.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------
// Start the Server
// -----------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});
