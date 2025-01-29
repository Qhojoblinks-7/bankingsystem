import supabase from '../config/supabaseClient';

// Apply for a loan
export const applyForLoan = async (req, res) => {
  const { user_id, loan_amount, loan_term, interest_rate } = req.body;

  try {
    // Insert loan application
    const { data, error } = await supabase
      .from('loans')
      .insert([
        {
          user_id,
          loan_amount,
          loan_term,
          interest_rate,
          status: 'pending'
        }
      ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'Loan application submitted', loan: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve/Reject Loan (admin logic)
