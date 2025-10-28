import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const getServerUser = async (req = null) => {
  const supabase = createServerSupabaseClient();

  if (req) {
    const {
      data: { user },
    } = await supabase.auth.getUser({
      headers: { Authorization: req.headers.get("Authorization") },
    });
    return user;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};
