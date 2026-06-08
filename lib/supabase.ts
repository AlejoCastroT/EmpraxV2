import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://whzaddhfymvcmxquxjdr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoemFkZGhmeW12Y214cXV4amRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NzA4OTcsImV4cCI6MjA5NjI0Njg5N30.GWJFcGHi-oALMlNTHHXjkSQZxreDLfh6K99XRfTa1L4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});