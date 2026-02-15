# Implement Token Refresh and Logout Functionality

## Context

The frontend application now successfully stores authentication tokens in localStorage after login/register, but lacks two critical features:

1. **Logout functionality** - Users currently have no way to log out of the application. The backend provides a `logout` mutation that invalidates refresh tokens, but there's no frontend implementation or UI for it.

2. **Token refresh capability** - Access tokens expire, but there's no mechanism to refresh them using the refresh token. The backend provides a `refresh` mutation that returns a new access token, but it's not implemented on the frontend.

3. **Conditional Header UI** - The header always shows "Login" and "Register" buttons, even when a user is logged in. It should instead show a "Logout" button when authenticated.

This task implements logout functionality with proper UI state management and creates the foundation for token refresh (manual implementation first, with option to add automatic refresh later).

## Current State

**What's Working:**
- ✅ Token storage implemented in `app/lib/auth.ts` with utilities: `saveTokens()`, `getAccessToken()`, `getRefreshToken()`, `clearTokens()`, `saveUser()`, `getUser()`
- ✅ Login and Register forms save tokens to localStorage after successful authentication
- ✅ Apollo Client auth middleware uses `getAccessToken()` to attach Bearer tokens to requests
- ✅ Header component displays "Login" and "Register" buttons

**What's Missing:**
- ❌ No logout mutation defined in frontend (backend has `logout(refreshToken: String!): MutationResult!`)
- ❌ No refresh mutation defined in frontend (backend has `refresh(refreshToken: String!): RefreshPayload!`)
- ❌ Header always shows "Login/Register" buttons, even when user is logged in
- ❌ No logout button or functionality
- ❌ No token refresh mechanism when access token expires

**Available Backend Mutations (from schema.gql):**
```graphql
logout(refreshToken: String!): MutationResult!
  Returns: { ok: Boolean! }

refresh(refreshToken: String!): RefreshPayload!
  Returns: { accessToken: String!, accessTokenTTLSec: Float! }
```

**Key Files:**
- `app/components/Header.tsx` - Needs conditional rendering for Logout button
- `app/components/SideMenu.tsx` - Mobile menu, needs same conditional rendering
- `app/lib/auth.ts` - Token storage utilities (already has `clearTokens()` for logout)
- `app/apollo/client.ts` - Auth middleware
- `/Users/evgeniagolubeva/passkey_impl/passkey-backend/src/schema.gql` - GraphQL schema with logout and refresh mutations

## Proposed Solution

### 1. Create Logout GraphQL Mutation

Create `app/graphql/mutations/logout.ts`:
```typescript
import { gql } from '@apollo/client';

export const LOGOUT_MUT = gql`
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken) {
      ok
    }
  }
`;
```

### 2. Create Refresh Token GraphQL Mutation

Create `app/graphql/mutations/refresh.ts`:
```typescript
import { gql } from '@apollo/client';

export const REFRESH_MUT = gql`
  mutation Refresh($refreshToken: String!) {
    refresh(refreshToken: $refreshToken) {
      accessToken
      accessTokenTTLSec
    }
  }
`;
```

### 3. Add Logout Handler Function to auth.ts

Update `app/lib/auth.ts` to add a logout handler:
```typescript
import { apolloClient } from '~/apollo/client';
import { LOGOUT_MUT } from '~/graphql/mutations/logout';

export async function logout(): Promise<void> {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      // Call backend logout mutation to invalidate refresh token
      await apolloClient.mutate({
        mutation: LOGOUT_MUT,
        variables: { refreshToken },
      });
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with local logout even if backend call fails
    }
  }

  // Clear all local tokens and user data
  clearTokens();
}
```

### 4. Add Token Refresh Function to auth.ts

Add a manual refresh function (can be called when needed):
```typescript
import { REFRESH_MUT } from '~/graphql/mutations/refresh';

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return false;
  }

  try {
    const result = await apolloClient.mutate({
      mutation: REFRESH_MUT,
      variables: { refreshToken },
    });

    if (result.data?.refresh?.accessToken) {
      // Update only the access token, keep the same refresh token
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, result.data.refresh.accessToken);
      return true;
    }

    return false;
  } catch (err) {
    console.error('Token refresh error:', err);
    // If refresh fails, user needs to log in again
    clearTokens();
    return false;
  }
}
```

### 5. Update Header Component with Conditional Rendering

Update `app/components/Header.tsx` to show Logout button when authenticated:
```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUser, logout } from '~/lib/auth';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state on mount and after navigation
    const user = getUser();
    setIsAuthenticated(!!user);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-between items-center">
        <Link to="/">
          <h1>Passkey Auth Test</h1>
        </Link>

        <div className="hidden md:flex space-x-4">
          <Link to="/">
            <Button>About</Button>
          </Link>

          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <SideMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </div>
      </nav>
    </header>
  );
}
```

### 6. Update SideMenu Component

Update `app/components/SideMenu.tsx` to accept auth props:
```typescript
interface SideMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function SideMenu({ isAuthenticated, onLogout }: SideMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <nav className="flex flex-col space-y-4">
          <Link to="/" onClick={() => setOpen(false)}>
            About
          </Link>

          {isAuthenticated ? (
            <Button onClick={() => { onLogout(); setOpen(false); }}>
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button>Login</Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
```

### 7. Update Login and Register Forms to Trigger Header Re-render

After successful login/register, we need to notify the Header of the auth state change. The simplest approach is to trigger a page reload or use a custom event:

**Option A: Navigate and let useEffect check** (already works with current implementation)

**Option B: Add custom event for immediate update** (optional enhancement):
```typescript
// In auth.ts, dispatch custom event after saveUser
window.dispatchEvent(new Event('authChange'));

// In Header.tsx, listen for the event
useEffect(() => {
  const handleAuthChange = () => {
    const user = getUser();
    setIsAuthenticated(!!user);
  };

  handleAuthChange(); // Check on mount
  window.addEventListener('authChange', handleAuthChange);

  return () => window.removeEventListener('authChange', handleAuthChange);
}, []);

// Update saveUser and clearTokens to dispatch the event
```

## Files to Create/Modify

**New Files:**
- `app/graphql/mutations/logout.ts` - Logout mutation definition
- `app/graphql/mutations/refresh.ts` - Token refresh mutation definition

**Modified Files:**
- `app/lib/auth.ts` - Add `logout()` and `refreshAccessToken()` functions, optionally add auth state change events
- `app/components/Header.tsx` - Add conditional rendering for Logout button, auth state management
- `app/components/SideMenu.tsx` - Add props for auth state and logout handler, update UI conditionally

## Verification Steps

### 1. Start the development server
```bash
npm run dev
```

### 2. Test Header State Changes

**When Logged Out:**
- Navigate to home page (`/`)
- Verify Header shows "Login" and "Register" buttons
- Verify mobile menu (if screen is small) also shows Login and Register

**After Login:**
- Navigate to `/login`
- Fill in credentials and submit
- Verify Header now shows "Logout" button instead of Login/Register
- Verify mobile menu shows Logout button

**After Registration:**
- Log out first (if logged in)
- Navigate to `/register`
- Fill in form and submit
- Navigate back to home page
- Verify Header shows "Logout" button

### 3. Test Logout Functionality

**Via Desktop Header:**
- While logged in, click "Logout" button in Header
- Verify user is redirected to `/login` page
- Open DevTools → Application → Local Storage
- Verify `accessToken`, `refreshToken`, and `user` are removed
- Verify Header now shows Login and Register buttons again

**Via Mobile Menu:**
- While logged in on mobile view, open the side menu
- Click "Logout" button
- Verify same behavior as desktop

### 4. Test Logout API Call

- Log in successfully
- Open DevTools → Network tab, filter for GraphQL requests
- Click Logout button
- Verify a GraphQL mutation request is made to `logout` with the refresh token
- Check the response shows `{ ok: true }`

### 5. Test Token Refresh (Manual)

This is a manual implementation, so you'll need to test it programmatically:
- Open browser console
- Import and call: `await refreshAccessToken()`
- Check that a new access token is stored in localStorage
- Verify the old access token is replaced with a new one
- Verify refresh token remains the same

### 6. Test Auth State Persistence

- Log in successfully
- Refresh the page
- Verify Header still shows "Logout" button (auth state persists)
- Open a new tab to the same site
- Verify the new tab also shows "Logout" button

### 7. Test Error Handling

**Failed Logout:**
- Stop the backend server
- Try to log out
- Verify local tokens are still cleared even if backend request fails
- Verify user is redirected to login page

**Failed Refresh:**
- Manually corrupt the refresh token in localStorage
- Try to refresh the token
- Verify all tokens are cleared
- Verify user needs to log in again

## Implementation Notes

### Auth State Management Approach

This implementation uses **localStorage + React state** for auth state management:
- `getUser()` checks localStorage for user data
- `useEffect` in Header checks auth state on mount
- Custom event `authChange` (optional) notifies components of auth changes

**Alternative approach (more robust, out of scope):**
- Create a React Context (`AuthContext`) to manage auth state globally
- Provides `isAuthenticated`, `user`, `login`, `logout`, `refresh` to all components
- Eliminates need for localStorage checks in components
- Better for larger apps with many auth-dependent components

### Token Refresh Strategy

This implementation provides a **manual refresh function** (`refreshAccessToken()`):
- Can be called programmatically when needed
- Useful for testing and one-off refresh scenarios
- Does not automatically refresh when access token expires

**Future enhancement (out of scope):**
- Implement automatic token refresh in Apollo Client error handling
- Intercept 401 responses, refresh token, and retry failed request
- Use Apollo Link to add refresh logic transparently
- Monitor token expiration time and proactively refresh before expiry

## Future Enhancements (Out of Scope)

The following improvements could be made later:
- **Automatic token refresh** - Intercept 401 errors and refresh automatically
- **Protected route guards** - Redirect to login if accessing protected routes while unauthenticated
- **Auth Context** - Global state management for auth (more scalable than localStorage checks)
- **User profile display** - Show username in header when logged in
- **Token expiration warnings** - Notify user before token expires
- **Remember me functionality** - Option to persist login longer
- **Multi-tab sync** - Sync logout across browser tabs automatically
