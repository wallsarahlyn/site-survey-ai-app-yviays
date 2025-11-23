import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://xnmhalybnxbvfaausuru.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubWhhbHlibnhidmZhYXVzdXJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MzkyMzMsImV4cCI6MjA3OTQxNTIzM30.Osca7gjMZ0kkJP3xpHq7rup5WaCO2z7dn70NzeFe4zA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
