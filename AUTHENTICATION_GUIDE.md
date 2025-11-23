
# Authentication Guide for InspectAI

## Overview

InspectAI uses Supabase Authentication to secure user accounts and data. This guide explains how the authentication system works and how to troubleshoot common issues.

## How User Accounts Work

### 1. Sign Up Process

When a user creates a new account:

- User enters their email and password (minimum 6 characters)
- The system sends a verification email to the provided address
- **Important:** The user MUST click the verification link in the email before they can sign in
- The verification link expires after 24 hours

### 2. Email Verification

After signing up, users will receive an email with a verification link:

- Check the inbox (and spam/junk folder) for the verification email
- Click the verification link to confirm the email address
- Once verified, the user can sign in with their credentials

### 3. Sign In Process

To sign in:

- Enter the email and password used during sign-up
- If the email is not verified, an error message will appear with an option to resend the verification email
- Once signed in, the session persists across app restarts

### 4. Password Reset

If a user forgets their password:

- Enter the email address in the sign-in form
- Click "Forgot Password?"
- Check email for a password reset link
- Follow the link to set a new password

## Common Issues and Solutions

### Issue: "Email not confirmed" error when signing in

**Cause:** The user hasn't clicked the verification link in their email.

**Solution:**
1. Check your email inbox (including spam/junk folder)
2. Look for an email from InspectAI/Supabase
3. Click the verification link
4. Try signing in again
5. If you can't find the email, click "Resend Email" when the error appears

### Issue: "User already registered" error when signing up

**Cause:** An account with this email already exists.

**Solution:**
1. Try signing in instead of signing up
2. If you forgot your password, use the "Forgot Password?" option
3. Check if you previously created an account

### Issue: "Invalid login credentials" error

**Cause:** The email or password is incorrect.

**Solution:**
1. Double-check your email address for typos
2. Ensure your password is correct (passwords are case-sensitive)
3. If you forgot your password, use the "Forgot Password?" option

### Issue: Verification email not received

**Possible causes and solutions:**

1. **Email in spam folder:** Check your spam/junk folder
2. **Wrong email address:** Verify you entered the correct email during sign-up
3. **Email provider blocking:** Some email providers may block automated emails
4. **Expired link:** If more than 24 hours have passed, request a new verification email

## Security Features

### Row Level Security (RLS)

All user data is protected by Row Level Security policies:

- Users can only view, create, update, and delete their own data
- Inspections, images, and historical analyses are isolated per user
- No user can access another user's data

### Session Management

- Sessions are stored securely using AsyncStorage
- Sessions automatically refresh to keep users signed in
- Users can sign out at any time to end their session

### Password Requirements

- Minimum 6 characters
- Passwords are encrypted and never stored in plain text
- Use a strong, unique password for better security

## Technical Details

### Authentication Flow

1. **Sign Up:**
   ```javascript
   supabase.auth.signUp({
     email,
     password,
     options: {
       emailRedirectTo: 'https://natively.dev/email-confirmed'
     }
   })
   ```

2. **Sign In:**
   ```javascript
   supabase.auth.signInWithPassword({
     email,
     password
   })
   ```

3. **Sign Out:**
   ```javascript
   supabase.auth.signOut()
   ```

### Session Persistence

The Supabase client is configured to persist sessions:

```javascript
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### Error Handling

The app provides specific error messages for common authentication issues:

- Email not confirmed
- Invalid credentials
- User already registered
- Network errors

Each error includes helpful guidance on how to resolve the issue.

## Best Practices

1. **Always verify your email** before attempting to sign in
2. **Use a strong password** with a mix of letters, numbers, and symbols
3. **Keep your credentials secure** - never share your password
4. **Sign out on shared devices** to protect your account
5. **Check spam folders** if you don't receive verification emails

## Support

If you continue to experience issues with authentication:

1. Check the console logs for detailed error messages
2. Verify your internet connection is stable
3. Try clearing the app cache and restarting
4. Contact support with specific error messages

## Database Tables

The following tables store user-related data:

- `auth.users` - User accounts and authentication data
- `public.inspections` - User inspection reports
- `public.inspection_images` - Images uploaded by users
- `public.historical_analyses` - Historical data analyses

All tables have RLS policies enabled to ensure data privacy and security.
