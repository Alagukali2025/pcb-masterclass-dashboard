import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnerEmail = (email) => {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    // Your exact owner email
    return normalized === 'kalialagu201@gmail.com';
  };

  const mapSupabaseUser = (supabaseUser) => {
    if (!supabaseUser) return null;
    
    // Normalize email for comparison
    const email = supabaseUser.email?.toLowerCase().trim();
    const isOwner = isOwnerEmail(email);
    const metadata = supabaseUser.user_metadata || {};
    
    // Fallback logic for names and pictures
    const fullName = metadata.full_name || metadata.name || "";
    const avatarUrl = metadata.avatar_url || metadata.picture;
    
    return {
      id: supabaseUser.id,
      email: email,
      name: isOwner ? "Platform Owner" : (fullName || email),
      initials: (fullName || email).substring(0, 2).toUpperCase(),
      picture: avatarUrl,
      loginTime: new Date().toISOString(),
      isOwner: isOwner,
      authMethod: supabaseUser.app_metadata?.provider || 'email',
      hasPassword: supabaseUser.identities?.some(id => id.provider === 'email') || false,
      industry: metadata.industry || null,
      phone: metadata.phone || null
    };
  };

  const syncUserProfile = async (supabaseUser) => {
    if (!supabaseUser) return;
    
    try {
      const hasPassword = supabaseUser.identities?.some(id => id.provider === 'email') || false;
      const provider = supabaseUser.app_metadata?.provider || 'email';
      
      // 1. First, fetch existing profile to avoid overwriting industry/phone
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('industry, phone')
        .eq('id', supabaseUser.id)
        .single();

      // 2. Perform the upsert with session-related info
      const { data: upsertedData, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUser.id,
          email: supabaseUser.email?.toLowerCase().trim(),
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          last_login: new Date().toISOString(),
          auth_method: provider,
          has_password: hasPassword,
          // Preserve existing if they exist
          industry: existingProfile?.industry || null,
          phone: existingProfile?.phone || null
        }, { onConflict: 'id' })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Update local state with DB fields (like industry)
      if (upsertedData) {
        setUserData(prev => ({
          ...(prev || {}),
          industry: upsertedData.industry,
          phone: upsertedData.phone,
          name: upsertedData.full_name || prev?.name
        }));
      }
    } catch (e) {
      console.error('Auth Sync Error:', e.message);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        console.group('🔍 AUTH DIAGNOSTICS: checkSession');
        
        // 🚨 MANUAL SESSION INJECTION (The Nuclear Option)
        // If Google redirected us back with a token (#access_token=...), 
        // we manually grab it and force Supabase to log us in.
        if (window.location.hash && window.location.hash.includes('access_token')) {
          console.log('⚡ Detected Access Token in URL Fragment! Manually capturing...');
          
          // Parse the hash manually (stripping the leading #)
          const hash = window.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken) {
            console.log('💉 Injecting Session into Supabase...');
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            if (sessionError) {
              console.error('❌ Session Injection Failed:', sessionError.message);
            } else {
              console.log('✅ Session Injected Successfully!');
              // Clean the URL hash so it looks professional
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session metadata:', session ? 'SESSION_EXISTS' : 'NO_SESSION');
        
        if (mounted && session?.user) {
          console.log('User detected:', session.user.email);
          const mapped = mapSupabaseUser(session.user);
          setIsLoggedIn(true);
          setUserData(mapped);
          
          syncUserProfile(session.user);
        }
        console.groupEnd();
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔑 AUTH_EVENT: ${event}`, session ? 'SESSION_EXISTS' : 'NO_SESSION');
      if (mounted) {
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          setIsLoggedIn(true);
          setUserData(mapped);
          
          syncUserProfile(session.user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  // Legacy local login/register remains as placeholders or can be redirected to Supabase
  const login = (userId) => {
    console.warn('Manual login not fully implemented with Supabase. Please use Google Login.');
  };

  const register = (data) => {
    console.warn('Manual registration not fully implemented with Supabase. Please use Google Login.');
  };

  const checkEmailStatus = async (email) => {
    if (!email) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('auth_method, has_password')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  };

  const completePasswordSetup = async (password) => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      // Update local profile flag
      const userId = userData?.id;
      if (userId) {
        await supabase
          .from('profiles')
          .update({ has_password: true, auth_method: 'hybrid' })
          .eq('id', userId);
      }
      
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Change password for a logged-in user (from Settings menu)
  const changePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      // Mark the profile as having a password set
      if (userData?.id) {
        await supabase
          .from('profiles')
          .update({ has_password: true })
          .eq('id', userData.id);
        setUserData(prev => ({ ...prev, hasPassword: true }));
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };


  const updateProfileData = async (newData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: newData.full_name,
          phone: newData.phone,
          industry: newData.industry,
          updated_at: new Date()
        })
        .eq('id', userData.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase Profile Update Failed:', error);
        throw error;
      }

      console.log('✅ Profile Update Successful:', data);

      // Sync local state
      setUserData(prev => ({
        ...prev,
        name: data.full_name,
        phone: data.phone,
        industry: data.industry
      }));

      return { success: true };
    } catch (error) {
      console.error('🔴 Profile update error caught in try/catch:', error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    isLoggedIn,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    checkEmailStatus,
    updateProfileData,
    completePasswordSetup,
    changePassword,
    needsPasswordSetup: isLoggedIn && userData && !userData.hasPassword
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
