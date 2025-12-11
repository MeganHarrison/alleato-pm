# Google OAuth Setup Guide

## What Was Implemented

✅ **Google OAuth Login Button** added to [components/login-form.tsx](components/login-form.tsx)
✅ **Auth Callback Handler** created at [app/auth/callback/route.ts](app/auth/callback/route.ts)
✅ **Error Handling** for OAuth failures

## Setup Instructions

### Step 1: Get Google OAuth Credentials (5 minutes)

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create or Select a Project**:
   - Click "Select a project" → "New Project"
   - Name: "Alleato Procore"
   - Click "Create"

3. **Configure OAuth Consent Screen**:
   - Click "OAuth consent screen" in left sidebar
   - Choose "External" (for testing) or "Internal" (for organization only)
   - Fill in required fields:
     - **App name**: Alleato Procore
     - **User support email**: Your email
     - **Developer contact email**: Your email
   - Click "Save and Continue"
   - Click "Save and Continue" again (skip optional scopes)
   - Add test users if using External (add your email)
   - Click "Save and Continue"

4. **Create OAuth Client ID**:
   - Click "Credentials" in left sidebar
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - **Application type**: Web application
   - **Name**: Alleato Procore Web Client

   **Authorized JavaScript origins**:
   ```
   http://localhost:3001
   https://lgveqfnpkxvzbnnwuled.supabase.co
   ```

   **Authorized redirect URIs**:
   ```
   http://localhost:3001/auth/callback
   https://lgveqfnpkxvzbnnwuled.supabase.co/auth/v1/callback
   ```

   - Click "Create"
   - **SAVE YOUR CLIENT ID AND SECRET** (you'll need these)

---

### Step 2: Configure Supabase (2 minutes)

1. **Go to Supabase Dashboard**:
   - Visit: https://app.supabase.com/project/lgveqfnpkxvzbnnwuled/auth/providers

2. **Enable Google Provider**:
   - Find "Google" in the list
   - Toggle it ON
   - Paste your **Google Client ID**
   - Paste your **Google Client Secret**
   - Click "Save"

---

### Step 3: Test the Integration

#### Option A: Test in Browser
1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3001/auth/login

3. Click "Continue with Google" button

4. You should see:
   - Google account selection screen
   - Permission consent (if first time)
   - Redirect back to `/portfolio` after successful login

#### Option B: Test with Playwright
```bash
npx playwright test tests/test-login.spec.ts --headed
```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Make sure you added BOTH redirect URIs to Google Cloud Console:
- `http://localhost:3001/auth/callback`
- `https://lgveqfnpkxvzbnnwuled.supabase.co/auth/v1/callback`

### Error: "Access blocked: Alleato Procore has not completed the Google verification process"
**Solution**:
1. Add your email as a test user in OAuth consent screen
2. OR publish the app (requires verification for production)

### Error: "Unable to connect to authentication service"
**Solution**: This means Supabase Auth is still having upstream issues. The OAuth flow requires Supabase Auth to be working.

### Google button doesn't appear
**Solution**:
1. Clear browser cache
2. Restart dev server
3. Check browser console for errors

---

## Production Deployment

When deploying to production (Vercel):

1. **Update Authorized URIs in Google Cloud Console**:
   - Add your production domain: `https://yourdomain.com`
   - Add callback: `https://yourdomain.com/auth/callback`
   - Keep the Supabase callback URI

2. **Publish OAuth Consent Screen** (if using External):
   - This requires Google verification (can take weeks)
   - OR keep it in "Testing" mode and manually add users

3. **Update Redirect URL in Code** (if needed):
   - The callback handler already uses `origin` dynamically
   - No code changes needed

---

## Security Notes

- ✅ Client secret is stored in Supabase (not exposed to browser)
- ✅ OAuth flow uses PKCE for additional security
- ✅ Callback validates auth code before creating session
- ⚠️ Keep your Google Client Secret secure
- ⚠️ Never commit credentials to git

---

## Next Steps

After Google OAuth is working:

1. **Add More OAuth Providers**:
   - GitHub (popular for developers)
   - Microsoft (for enterprise)
   - Apple (required for iOS apps)

2. **Implement Magic Links**:
   - Passwordless email authentication
   - Better UX than passwords

3. **Add MFA** (Multi-Factor Authentication):
   - SMS or authenticator app
   - Extra security layer

---

## Support

If you encounter issues:
1. Check Supabase logs: https://app.supabase.com/project/lgveqfnpkxvzbnnwuled/logs/auth-logs
2. Check browser console for errors
3. Verify redirect URIs match exactly (including http vs https)
