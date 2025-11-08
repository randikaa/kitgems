// Admin utilities and checks

import { supabase } from './supabase/client';

/**
 * Check if current user is an admin
 * @returns Promise<boolean>
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user found');
      return false;
    }

    console.log('Checking admin status for user:', user.id);

    // TEMPORARY: Allow all authenticated users (REMOVE THIS IN PRODUCTION!)
    // Uncomment the line below to bypass admin check for testing
    // return true;

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no row

    if (error) {
      console.error('Admin check error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      // If column doesn't exist, return false (admin setup not complete)
      if (error.code === '42703' || error.message.includes('column') || error.message.includes('is_admin')) {
        console.warn('Admin column not set up. Run supabase/add-admin-role.sql to enable admin features.');
        return false;
      }
      
      // If RLS policy blocks access, try to help debug
      if (error.code === 'PGRST116' || error.message.includes('Row')) {
        console.error('RLS policy may be blocking access. Check if "Users can view own profile" policy exists.');
      }
      
      return false;
    }

    if (!data) {
      console.warn('No profile found for user. Profile may not exist.');
      return false;
    }

    console.log('Admin check result:', data);
    return data?.is_admin === true;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
}

/**
 * Get admin status for a user
 * @param userId - User ID to check
 * @returns Promise<boolean>
 */
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) return false;
    return data?.is_admin === true;
  } catch (error) {
    return false;
  }
}

/**
 * Make a user an admin
 * @param userId - User ID to make admin
 * @returns Promise<boolean>
 */
export async function makeUserAdmin(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);

    return !error;
  } catch (error) {
    return false;
  }
}

/**
 * Remove admin status from a user
 * @param userId - User ID to remove admin from
 * @returns Promise<boolean>
 */
export async function removeUserAdmin(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: false })
      .eq('id', userId);

    return !error;
  } catch (error) {
    return false;
  }
}
