// backend/controllers/authController.js

import supabase from '../config/supabaseClient';

// Helper function to respond with JSON
function respondWithJson(res, status, message, data = null) {
  res.status(status).json({
    message,
    data,
  });
}

// User sign-up function
export async function signUp(req, res) {
  const { email, password, phoneNumber } = req.body;

  // Basic validation
  if (!email || !password || !phoneNumber) {
    return respondWithJson(res, 400, 'Missing required fields: email, password, or phone number');
  }

  try {
    // Register the user in Supabase Auth
    const { user, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      // Error during sign-up
      return respondWithJson(res, 400, `Error signing up: ${error.message}`);
    }

    // Insert additional user data into 'users' table
    const { data, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        phone_number: phoneNumber,
        account_balance: 0,  // Default balance for new users
      })
      .single();

    if (dbError) {
      return respondWithJson(res, 500, `Database error: ${dbError.message}`);
    }

    // Return success response
    return respondWithJson(res, 200, 'User signed up successfully', { user: data });
  } catch (error) {
    return respondWithJson(res, 500, `Unexpected error: ${error.message}`);
  }
}

// User sign-in function
export async function signIn(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return respondWithJson(res, 400, 'Missing required fields: email or password');
  }

  try {
    // Sign in the user using Supabase Auth
    const { user, session, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return respondWithJson(res, 400, `Error signing in: ${error.message}`);
    }

    return respondWithJson(res, 200, 'User signed in successfully', { user, session });
  } catch (error) {
    return respondWithJson(res, 500, `Unexpected error: ${error.message}`);
  }
}
