// Initialize Supabase Client
// The credentials are injected via /config.js from the backend reading the .env file
const SUPABASE_URL = window.ENV?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.ENV?.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase Client initialized successfully.");
  } else {
    console.error("Missing Supabase keys in window.ENV. Make sure /config.js is loading correctly.");
  }
} catch (e) {
  console.error("Failed to initialize Supabase:", e);
}

// Optional: Global listener to handle redirect logic on the dashboard
// This can be imported and called on protected pages
async function requireAuth() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error || !session) {
    // If not logged in, redirect to login page
    window.location.href = 'login.html';
  }
}
