import { createClient } from "@supabase/supabase-js";

// Create a new connection with Supabase's client.
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);