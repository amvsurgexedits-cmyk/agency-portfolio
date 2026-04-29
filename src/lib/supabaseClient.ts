import { createClient } from '@supabase/supabase-js';

// TODO: Replace 'YOUR_SUPABASE_ANON_KEY' with your actual anon public key from Supabase Project Settings -> API
const supabaseUrl = 'https://gyjolgavqfxhdsblhfci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5am9sZ2F2cWZ4aGRzYmxoZmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzY1NTIsImV4cCI6MjA4ODYxMjU1Mn0.H9ihAJCoVJTLRrQJL1ybSjjjxnGQ6tl_GrUGNqtKUtM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
