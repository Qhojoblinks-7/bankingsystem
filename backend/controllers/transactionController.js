import supabase from '../config/supabaseClient';

// Process a deposit
export const processDeposit = async (req, res) => {
  const { user_id, amount } = req.body;

  try {
    // Check user balance
    const { data: user } = await supabase
      .from('users')
      .select('account_balance')
      .eq('id', user_id)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update account balance
    const newBalance = user.account_balance + amount;
    await supabase
      .from('users')
      .update({ account_balance: newBalance })
      .eq('id', user_id);

    // Record the transaction
    await supabase.from('transactions').insert([
      {
        user_id,
        transaction_type: 'deposit',
        amount,
        status: 'completed'
      }
    ]);

    res.status(200).json({ message: 'Deposit successful', newBalance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Process a withdrawal (similar to deposit)
