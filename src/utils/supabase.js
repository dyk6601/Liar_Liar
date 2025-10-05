const SUPABASE_URL = 'https://cxfxwbroqidispfvdzed.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4Znh3YnJvcWlkaXNwZnZkemVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTMxMTEsImV4cCI6MjA3NDk2OTExMX0.yqdnTDiL5LVUoOWmljf3Lui_pI48CTpYCxFDxnS9rDA';

export const supabase = {
  from: (table) => ({
    insert: async (data) => ({ data, error: null }),
    select: async () => ({ data: [], error: null }),
    update: async (data) => ({ data, error: null }),
    eq: function(field, value) { return this; },
    single: async () => ({ data: null, error: null })
  })
};