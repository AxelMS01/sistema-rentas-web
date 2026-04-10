import { createClient } from "@supabase/supabase-js";

console.log("llave importada:", process.env.SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient("https://rebgfmpgupcvebyacvtj.supabase.co", "sb_publishable_i7gIkO8fXJnwDg-F8AkYcA_zJwV97Ax");