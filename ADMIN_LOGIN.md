# Admin Dashboard - Authentication Guide

## Protected Dashboard with Admin Login

The FeedPulse admin dashboard now requires authentication to access sensitive feedback management features.

## Authentication System

### Hardcoded Admin Credentials

For simplicity, the system uses hardcoded admin credentials (no complex auth needed):

- **Email**: `admin@feedpulse.com`
- **Password**: `FeedPulse@123`

These credentials are displayed on the login page for demo purposes.

## How It Works

### 1. Login Page (`/login`)

- Clean, professional login interface
- Email and password fields
- Password visibility toggle
- Demo credentials displayed for reference
- Validates credentials on submit
- Shows error messages for invalid attempts

### 2. Authentication Logic (`lib/auth.ts`)

```typescript
// Simple, client-side authentication
auth.login(email, password); // Returns true/false
auth.logout(); // Clears session
auth.isAuthenticated(); // Checks if logged in
auth.getToken(); // Gets auth token
```

### 3. Protected Route Component

```tsx
<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>
```

- Automatically redirects to `/login` if not authenticated
- Shows loading state while checking auth
- Uses browser localStorage to persist session

### 4. Session Storage

Session tokens are stored in browser localStorage:

```json
{
    "email": "admin@feedpulse.com",
    "timestamp": 1711836000000
}
```

## Login Flow

1. **User visits `/login`**
    - Sees login form with demo credentials displayed

2. **User enters email + password**
    - Form validates input (required fields)
    - Submit button disabled if fields empty
    - Real-time error clearing

3. **User clicks "Login to Dashboard"**
    - Credentials validated against hardcoded admin email/password
    - If correct:
        - Session token stored in localStorage
        - User redirected to `/dashboard`
    - If incorrect:
        - Error message shown
        - Password field cleared for security

4. **Dashboard Protected**
    - ProtectedRoute component checks auth on mount
    - If not authenticated, redirects to `/login`
    - Shows loading state during check

5. **Logout**
    - Click "Logout" button in top-right
    - Session cleared from localStorage
    - Redirected to `/login`

## File Structure

```
frontend/
├── lib/
│   └── auth.ts                    # Authentication logic
├── components/
│   └── ProtectedRoute.tsx         # Route protection wrapper
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   └── dashboard/
│       └── page.tsx              # Protected dashboard
```

## Login Page Features

✅ **Professional UI**

- Gradient background
- FeedPulse branding
- Clean form layout
- Responsive design

✅ **User Experience**

- Password visibility toggle (👁️)
- Error messages
- Loading spinner during submission
- Demo credentials displayed
- Link back to feedback form

✅ **Security**

- Password field cleared on failed login
- No credentials shown in URL
- Session stored securely in localStorage
- Automatic redirect if accessing protected routes

## Testing the Login

### Step 1: Try to access dashboard without login

1. Go to http://localhost:3000/dashboard
2. You'll be redirected to http://localhost:3000/login

### Step 2: Login with demo credentials

1. Enter email: `admin@feedpulse.com`
2. Enter password: `FeedPulse@123`
3. Click "Login to Dashboard"
4. You'll see the admin dashboard

### Step 3: Test incorrect credentials

1. Go to http://localhost:3000/login
2. Enter wrong email or password
3. See error message: "Invalid email or password"

### Step 4: Logout

1. On the dashboard, click "Logout" button (top-right)
2. You'll be redirected to login page
3. Try accessing /dashboard again → redirected to /login

### Step 5: Check session persistence

1. Login to dashboard
2. Refresh the page
3. You should stay logged in (session persists in localStorage)

## Security Notes

⚠️ **Development Only**

- Hardcoded credentials are for demo/development only
- **NOT suitable for production**
- No password hashing (plain text comparison)
- No HTTPS enforcement in dev
- No CSRF protection
- No rate limiting on login attempts

### For Production:

- [ ] Remove hardcoded credentials
- [ ] Implement proper backend authentication
- [ ] Use JWT tokens with expiration
- [ ] Hash passwords with bcrypt
- [ ] Add HTTPS
- [ ] Implement rate limiting
- [ ] Add 2FA support
- [ ] Add session timeout
- [ ] Implement proper auth middleware

## API Integration

The dashboard automatically:

- ✅ Loads all feedback from API
- ✅ Displays with sentiment analysis (from AI)
- ✅ Shows priority scores and tags
- ✅ Filters by status, category, priority
- ✅ Generates AI insights
- ✅ Allows editing/deleting feedback

## Next Steps

After login is working:

- [ ] Add admin-only operations (edit, delete, status updates)
- [ ] Add activity logging
- [ ] Add audit trail
- [ ] Implement proper backend auth
- [ ] Add password reset flow
- [ ] Add multi-admin support

## Troubleshooting

**Problem**: Login page doesn't appear

- Solution: Navigate to http://localhost:3000/login directly

**Problem**: Credentials rejected

- Solution: Check caps lock, ensure exact match: `admin@feedpulse.com` / `FeedPulse@123`

**Problem**: Can't access dashboard after login

- Solution: Check browser console for errors, ensure cookies/localStorage enabled

**Problem**: Session cleared after refresh

- Solution: This is expected if localStorage is disabled in browser settings

**Problem**: Logout button not working

- Solution: Clear browser cache and refresh

## Further Reading

- [Browser localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Next.js Route Protection Patterns](https://nextjs.org/docs/app/building-your-application/routing)
- [React Context for Auth](https://react.dev/reference/react/useContext)
