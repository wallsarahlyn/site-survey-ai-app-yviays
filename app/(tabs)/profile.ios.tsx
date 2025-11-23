
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/app/integrations/supabase/client';
import { GlassView } from 'expo-glass-effect';

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session ? 'Found' : 'None');
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'Session exists' : 'No session');
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        // Handle specific error cases
        if (error.message.includes('Email not confirmed')) {
          Alert.alert(
            'Email Not Verified',
            'Please check your email and click the verification link before signing in. Check your spam folder if you don\'t see it.',
            [
              { text: 'OK' },
              {
                text: 'Resend Email',
                onPress: async () => {
                  const { error: resendError } = await supabase.auth.resend({
                    type: 'signup',
                    email: email,
                    options: {
                      emailRedirectTo: 'https://natively.dev/email-confirmed'
                    }
                  });
                  
                  if (resendError) {
                    Alert.alert('Error', 'Failed to resend verification email. Please try again.');
                  } else {
                    Alert.alert('Success', 'Verification email sent! Please check your inbox.');
                  }
                }
              }
            ]
          );
        } else if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Sign In Error', 'Invalid email or password. Please try again.');
        } else {
          Alert.alert('Sign In Error', error.message);
        }
      } else {
        console.log('Sign in successful');
        Alert.alert('Success', 'Signed in successfully!');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          Alert.alert(
            'Account Exists',
            'An account with this email already exists. Please sign in instead or use the password reset option if you forgot your password.'
          );
        } else {
          Alert.alert('Sign Up Error', error.message);
        }
      } else {
        console.log('Sign up successful, user needs to verify email');
        Alert.alert(
          'Verification Email Sent! 📧',
          `We've sent a verification link to ${email}.\n\nPlease check your email (including spam folder) and click the link to verify your account before signing in.\n\nThe link will expire in 24 hours.`,
          [
            { text: 'OK', onPress: () => {
              setEmail('');
              setPassword('');
              setIsSignUp(false);
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        Alert.alert('Error', error.message);
      } else {
        console.log('Sign out successful');
        Alert.alert('Success', 'Signed out successfully!');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter Email', 'Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://natively.dev/email-confirmed',
      });

      if (error) {
        console.error('Password reset error:', error);
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Password Reset Email Sent',
          'Check your email for a password reset link.'
        );
      }
    } catch (error) {
      console.error('Unexpected error during password reset:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile & Settings</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Manage your account and preferences
          </Text>
        </View>

        {!session ? (
          <GlassView style={styles.section} glassEffectStyle="regular">
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
            
            <TextInput
              style={[styles.input, { 
                color: colors.text,
                borderColor: colors.border 
              }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={[styles.input, { 
                color: colors.text,
                borderColor: colors.border 
              }]}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={isSignUp ? handleSignUp : handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {!isSignUp && (
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={[styles.forgotPasswordText, { color: colors.textSecondary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text style={[styles.switchButtonText, { color: colors.primary }]}>
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.infoCard, { backgroundColor: colors.background, opacity: 0.8 }]}>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                ℹ️ Authentication is required to use AI analysis and historical data features.
              </Text>
              {isSignUp && (
                <Text style={[styles.infoText, { color: colors.textSecondary, marginTop: 8 }]}>
                  📧 You&apos;ll need to verify your email before you can sign in.
                </Text>
              )}
            </View>
          </GlassView>
        ) : (
          <GlassView style={styles.section} glassEffectStyle="regular">
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
            
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email:</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{session.user.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status:</Text>
              <Text style={[styles.infoValue, { color: '#10B981' }]}>✓ Signed In</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>User ID:</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary, fontSize: 12 }]}>
                {session.user.id.substring(0, 8)}...
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={handleSignOut}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </GlassView>
        )}

        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
          
          <View style={styles.themeButtons}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { 
                  backgroundColor: mode === 'light' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setMode('light')}
            >
              <Text style={[
                styles.themeButtonText,
                { color: mode === 'light' ? '#FFFFFF' : colors.text }
              ]}>
                ☀️ Light
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { 
                  backgroundColor: mode === 'dark' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setMode('dark')}
            >
              <Text style={[
                styles.themeButtonText,
                { color: mode === 'dark' ? '#FFFFFF' : colors.text }
              ]}>
                🌙 Dark
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { 
                  backgroundColor: mode === 'field' ? colors.primary : 'transparent',
                  borderColor: colors.border,
                }
              ]}
              onPress={() => setMode('field')}
            >
              <Text style={[
                styles.themeButtonText,
                { color: mode === 'field' ? '#FFFFFF' : colors.text }
              ]}>
                🏗️ Field
              </Text>
            </TouchableOpacity>
          </View>
        </GlassView>

        <GlassView style={styles.section} glassEffectStyle="regular">
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About InspectAI</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            InspectAI is a professional property inspection platform powered by advanced AI technology.
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </GlassView>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
