import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://ezphcrwqdnvptxwtxscv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cGhjcndxZG52cHR4d3R4c2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNDQxNzYsImV4cCI6MjA4NzcyMDE3Nn0.-IEABtwxIiYYJ199pP9Q6gUmsoPIz04lWGulbf7SPaI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
