// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cxfxwbroqidispfvdzed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Znh3YnJvcWlkaXNwZnZkemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTMxMTEsImV4cCI6MjA3NDk2OTExMX0.yqdnTDiL5LVUoOWmljf3Lui_pI48CTpYCxFDxnS9rDA';

// Create and export the real Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Export URL for use in other files if needed
export const SUPABASE_URL_EXPORT = SUPABASE_URL;