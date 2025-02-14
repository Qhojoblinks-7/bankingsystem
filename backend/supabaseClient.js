// supabaseClient.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // or use the anon key for public access
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
