const supabase = require('../config/supabaseClient'); // Assuming the Supabase client is set up
const { logger } = require('../utils/logger'); // Assuming a logger utility for better logging

class TransactionModel {
  // Create a new transaction (deposit/withdrawal)
  static async createTransaction(account_id, transaction_type, amount, description) {
    try {
      // Validate transaction type and amount
      if (!['deposit', 'withdrawal'].includes(transaction_type)) {
        throw new Error('Invalid transaction type');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      // Generate a unique reference number (you can customize the generation logic)
      const reference_number = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Insert transaction into database
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: account_id,  // Use user_id instead of account_id for consistency with schema
            transaction_type,
            amount,
            description,
            reference_number,
            status: 'pending', // Initially set to pending
          },
        ]);

      if (error) throw error;

      // Log the successful transaction creation
      logger.info(`Transaction created successfully for account_id ${account_id} with reference number ${reference_number}`);

      return data;
    } catch (error) {
      logger.error(`Error creating transaction: ${error.message}`);
      throw new Error('Failed to create transaction');
    }
  }

  // Get all transactions for a specific account
  static async getTransactionsByAccount(account_id) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', account_id) // Ensure consistency with schema
        .order('transaction_date', { ascending: false }); // Order by most recent transaction

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error fetching transactions for account ${account_id}: ${error.message}`);
      throw new Error('Failed to fetch transactions');
    }
  }

  // Update a transaction status (e.g., mark as completed)
  static async updateTransactionStatus(transaction_id, status) {
    try {
      // Validate status
      if (!['pending', 'completed', 'failed'].includes(status)) {
        throw new Error('Invalid status');
      }

      const { data, error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', transaction_id); // Ensure consistency with schema

      if (error) throw error;

      // Log the status update
      logger.info(`Transaction ${transaction_id} status updated to ${status}`);

      return data;
    } catch (error) {
      logger.error(`Error updating transaction ${transaction_id}: ${error.message}`);
      throw new Error('Failed to update transaction status');
    }
  }

  // Get a single transaction by its ID
  static async getTransactionById(transaction_id) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transaction_id) // Ensure consistency with schema
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error fetching transaction ${transaction_id}: ${error.message}`);
      throw new Error('Failed to fetch transaction');
    }
  }

  // Ensure atomic operations on deposits and withdrawals
  static async updateAccountBalance(account_id, transaction_type, amount) {
    try {
      // Start a transaction block to ensure consistency
      const { data, error } = await supabase.rpc('update_balance', { account_id, transaction_type, amount });

      if (error) throw error;

      // If successful, log the balance update
      logger.info(`Account balance updated for account_id ${account_id}`);

      return data;
    } catch (error) {
      logger.error(`Error updating balance for account_id ${account_id}: ${error.message}`);
      throw new Error('Failed to update account balance');
    }
  }
}

module.exports = TransactionModel;
