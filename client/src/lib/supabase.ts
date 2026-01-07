
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials missing. Utilizing Mock Mode.');
}

// Create a safe initialization
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            signInWithPassword: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            signUp: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            getUser: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            signOut: () => Promise.resolve({ error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "No DB" } }) }),
                order: () => Promise.resolve({ data: [], error: { message: "No DB" } }),
                insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
                update: () => ({ eq: () => Promise.resolve({ error: null }) }),
                delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
            })
        }),
        rpc: () => Promise.resolve({ data: null, error: { message: "No DB" } }),
        storage: {
            from: () => ({
                getPublicUrl: () => ({ data: { publicUrl: "" } })
            })
        }
    } as any;
