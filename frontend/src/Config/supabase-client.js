import { createClient } from "@supabase/supabase-js";
console.log(process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY);
export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY);