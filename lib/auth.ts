import { createClient } from '@/lib/supabase/server';

// Admin emails that have access to /admin dashboard
// Add your email(s) here
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL, // Set in .env.local
].filter(Boolean) as string[];

export async function getUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  
  if (!user || !user.email) {
    return false;
  }
  
  return ADMIN_EMAILS.includes(user.email);
}

/**
 * Get user with admin status
 */
export async function getUserWithAdminStatus() {
  const user = await getUser();
  
  if (!user) {
    return { user: null, isAdmin: false };
  }
  
  const adminStatus = user.email ? ADMIN_EMAILS.includes(user.email) : false;
  
  return { user, isAdmin: adminStatus };
}

