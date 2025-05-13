
import { AdminUser } from '@/components/types/admin';

/**
 * Helper function to create a safe user object, handling null values
 */
export const createSafeUserObject = (user: any | null, hasEmailColumn: boolean): AdminUser => {
  // Handle null user case
  if (!user) {
    return {
      id: 'unknown',
      first_name: 'Unknown',
      last_name: 'User',
      email: 'unknown@placeholder.com',
      role: 'unknown',
      created_at: new Date().toISOString()
    };
  }
  
  // Create a base user with all required fields
  const baseUser: AdminUser = {
    id: user.id || 'unknown',
    first_name: user.first_name || 'Unknown',
    last_name: user.last_name || 'User',
    role: user.role || 'unknown',
    created_at: user.created_at || new Date().toISOString(),
    email: 'placeholder@example.com' // Default value
  };
  
  // Add email if it exists in the database
  if (hasEmailColumn && 'email' in user && user.email) {
    baseUser.email = user.email;
  } else {
    // Generate a placeholder email based on name
    const firstName = String(user.first_name || 'user').toLowerCase();
    const lastName = String(user.last_name || 'unknown').toLowerCase();
    baseUser.email = `${firstName}.${lastName}@placeholder.com`;
  }
  
  return baseUser;
};
