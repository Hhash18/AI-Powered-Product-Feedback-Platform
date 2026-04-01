# Admin Dashboard

## Overview

The FeedPulse admin dashboard is a **fully protected**, feature-rich interface for managing product feedback. Only authenticated admins can access dashboard features, and they can view, filter, edit, and analyze all feedback submissions in real-time.

---

## Requirement — Protected Dashboard & Authentication ✅

### Login System

**Access Point:** `http://localhost:3000/login`

The login page provides:

- **Clean, professional UI** with centered form
- **Email and Password fields** for credentials
- **Password visibility toggle** (👁️ icon)
- **Demo credentials displayed** for easy testing
- **Real-time error handling** with clear messages
- **Loading states** during authentication
- **Mobile responsive design** for all devices

### Authentication Flow

```
User visits /login
    ↓
Views login form with demo credentials
    ↓
Enters email + password
    ↓
Clicks "Login to Dashboard"
    ↓
Credentials validated (calls backend API)
    ↓
JWT token received and stored
    ↓
Session persisted in localStorage
    ↓
Redirected to /dashboard ✓
```

### Hardcoded Admin Credentials

For development and testing:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `admin@feedpulse.com` |
| Password | `FeedPulse@123`       |

**Note:** These credentials are displayed on the login page for convenience.

### Route Protection

The dashboard is wrapped with `<ProtectedRoute>` component:

```tsx
<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>
```

**Features:**

- ✅ Automatically redirects to `/login` if not authenticated
- ✅ Shows loading state while checking auth
- ✅ Persists session in browser localStorage
- ✅ Session survives page refresh
- ✅ JWT token used for all API requests

### Navigation

**Logged Out State:**

- Header shows "Admin Login" link

**Logged In State:**

- Header shows "Dashboard" button
- Dashboard navbar shows "Logout" button (top-right)
- "Back to Site" link for returning to public page

### Logout

Admins can logout by:

1. Clicking **"Logout"** button in dashboard navbar
2. Session cleared from localStorage
3. Redirected to `/login`
4. Dashboard no longer accessible

---

## Requirement — Feedback Display & Card List ✅

### Dashboard Layout

```
┌─────────────────────────────────────────┐
│ FeedPulse Logo          [Logout] Button │
├─────────────────────────────────────────┤
│ ┌─ Filters ──────────────────────────┐ │
│ │ Status ▼  Category ▼  Priority ▼  │ │
│ │              [Reset Filters]       │ │
│ └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ ┌─ Feedback Card ─────────────────────┐ │
│ │ Title 😊                            │ │
│ │ Description text...                 │ │
│ │ [Badges] [Priority] [Category]      │ │
│ │ Status: [Dropdown ▼]  [Delete]      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─ Another Feedback Card ─────────────┐ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### What's Displayed on Each Card

Every feedback item shows:

| Element             | Details                                                      |
| ------------------- | ------------------------------------------------------------ |
| **Title**           | Displayed prominently at top with sentiment emoji badge      |
| **Sentiment Badge** | 😊 (Positive) 😐 (Neutral) 😞 (Negative)                     |
| **Description**     | Full user-submitted text                                     |
| **Priority Score**  | 1-10 rating (AI-generated)                                   |
| **Category**        | Color-coded badge (Bug, Feature Request, Improvement, Other) |
| **Status**          | Interactive dropdown for editing                             |
| **AI Summary**      | Concise AI-generated summary from Gemini                     |
| **AI Tags**         | Keywords extracted by AI (#UI, #Performance, etc.)           |
| **User Info**       | Name and email (if provided)                                 |
| **Timestamp**       | "Submitted: 3/30/2024 at 2:45 PM"                            |
| **Actions**         | Status dropdown + Delete button                              |

### Card Visual Example

```
┌─ Add dark mode feature 😊
│
│ It would be amazing to have a dark mode option for the dashboard.
│ Many users work late and a dark theme would be much easier on the eyes.
│
│ ■ High Priority    ■ Feature Request    Score: 8/10
│ Status: [In Progress ▼]  [🗑️ Delete]
│
│ Tags: #UI #Settings #Accessibility
│
│ Summary: User requests dark mode for dashboard with emphasis on
│          nighttime usability and eye comfort.
│
│ From: Sarah Chen
│ Email: sarah@company.com
│ Submitted: 3/30/2024 at 2:45 PM
└─
```

### Display Features

✅ **Sentiment Emoji Badges**

- 😊 Green badge = Positive feeding
- 😐 Gray badge = Neutral feedback
- 😞 Red badge = Negative feedback

✅ **Color-Coded Badges**

- Priority: Red (Critical), Orange (High), Yellow (Medium), Green (Low)
- Category: Blue pill
- Status: Dropdown with color changes per status
- Score: Purple pill

✅ **Auto-Generated Content**

- AI-generated summary (from Gemini API)
- Tags extracted by AI
- Sentiment analyzed by AI
- Priority scored by AI (1-10)

✅ **Responsive Design**

- Cards adapt to screen size
- Mobile-friendly spacing
- Readable on all devices

---

## Requirement — Filter by Category ✅

### Category Filter Options

```
Category Filter Dropdown:
├─ All Categories (default)
├─ 🐛 Bug
├─ ✨ Feature Request
├─ ⬆️ Improvement
└─ 📌 Other
```

### How It Works

1. **Click the Category dropdown** → Select a category
2. **List updates instantly** → Only shows matching feedback
3. **Reset filters** → Click "Reset Filters" button to clear all

### Example Scenarios

| Selection       | Result                             |
| --------------- | ---------------------------------- |
| All Categories  | Shows all feedback submissions     |
| Bug             | Shows only bug reports             |
| Feature Request | Shows only feature requests        |
| Improvement     | Shows only improvement suggestions |
| Other           | Shows miscellaneous feedback       |

### Combining Filters

Filters work together:

- Select Category: "Bug"
- Also select Status: "New"
- Result: Shows only NEW bugs

---

## Requirement — Filter by Status ✅

### Status Filter Options

```
Status Filter Dropdown:
├─ All Statuses (default)
├─ New (blue)
├─ Reviewed (purple)
├─ In Progress (indigo)
├─ Completed (green)
└─ Archived (gray)
```

### Status Workflow

```
New Submission Received
        ↓
     New (just received)
        ↓
   Reviewed (team reviewed it)
        ↓
  In Progress (working on it)
        ↓
   Completed (finished/shipped)
        ↓
   Archived (closed/old)
```

### Use Cases for Each Status

| Status          | When/Why                                 |
| --------------- | ---------------------------------------- |
| **New**         | Just submitted, not reviewed yet         |
| **Reviewed**    | Team has reviewed, discussing next steps |
| **In Progress** | Assigned to someone, being worked on     |
| **Completed**   | Issue resolved or feature shipped        |
| **Archived**    | Closed or very old feedback              |

### Filtering by Status

1. **Click Status dropdown** → Choose status
2. **List updates instantly** → Shows only feedback in that status
3. **Combine with other filters** → Works with Category and Priority

---

## Requirement — Update Status (Inline Editing) ✅

### Status Inline Editor

Each feedback card has an **interactive status dropdown** that updates status instantly without page refresh.

```
Before: Status: New          (static badge)
After:  Status: [New ▼]      (interactive dropdown)
```

### How to Update Status

**Step 1:** Find the status dropdown on any feedback card

**Step 2:** Click the status dropdown → Opens menu

**Step 3:** Select new status → Choose from: New, Reviewed, In Progress, Completed, Archived

**Step 4:** Status updates instantly → Changes visible immediately

**Step 5:** Persisted to database → Survives page refresh

### Status Update Features

✅ **Real-Time Updates**

- No page refresh required
- Updates appear instantly (< 1 second)
- Very fast API response

✅ **Visual Feedback**

- Dropdown shows loading state during update
- Color changes when status changes
- Previous state preserved on error

✅ **Automatic Persistence**

- Updates saved to MongoDB
- Changes survive page refresh
- Visible to all users immediately

✅ **Error Handling**

- If update fails, reverts to previous status
- Error logged to console
- User can retry

### Status Update Workflow

```
Admin clicks status dropdown
        ↓
Selects new status (e.g., "In Progress")
        ↓
Frontend calls API: PUT /api/feedback/:id
        ↓
Backend updates MongoDB
        ↓
Response returned with updated document
        ↓
Card updates with new status
        ↓
Status change persisted ✓
```

### Example Status Transitions

| From        | To          | Reason                         |
| ----------- | ----------- | ------------------------------ |
| New         | Reviewed    | Team has reviewed the feedback |
| Reviewed    | In Progress | Decided to work on this issue  |
| In Progress | Completed   | Issue fixed or feature shipped |
| Completed   | Archived    | Closing old completed items    |
| New         | Archived    | Spam or invalid feedback       |

---

## Complete Dashboard Features

### Filters & Sort Bar

Located at the top of the "Feedback" tab:

```
┌─ Filters & Management ─────────────────────┐
│                               [Reset Filters] │
├────────────────────────────────────────────┤
│ Status ▼       Category ▼      Priority ▼   │
│ [All Statuses] [All Categories] [All]      │
│                                             │
│ Sort By ▼                                   │
│ [Newest First]                              │
└────────────────────────────────────────────┘
```

### Filter Controls

| Filter            | Options                                              | Purpose                   |
| ----------------- | ---------------------------------------------------- | ------------------------- |
| **Status**        | All, New, Reviewed, In Progress, Completed, Archived | Filter by workflow status |
| **Category**      | All, Bug, Feature Request, Improvement, Other        | Filter by feedback type   |
| **Priority**      | All, Critical, High, Medium, Low                     | Filter by priority level  |
| **Sort By**       | Newest First, Oldest First                           | Control display order     |
| **Reset Filters** | Button                                               | Clear all filters at once |

---

## Dashboard Tabs

### Tab 1: Feedback

- List of all feedback submissions
- Apply filters and search
- Inline status editing
- Delete functionality
- Shows all details from Requirement 3.2

### Tab 2: Analytics

- Charts showing feedback by category
- Charts showing feedback by status
- Charts showing feedback by priority
- Real-time statistics
- Summary metrics

### Tab 3: AI Insights

- AI-generated insights from all feedback
- Pattern analysis across submissions
- Recommendations for product improvements
- Summary of common themes
- Priority recommendations

---

## Implementation Details

### Frontend Files

**`frontend/app/dashboard/page.tsx`**

- Protected with `<ProtectedRoute>` wrapper
- Loads all feedback on mount
- Manages filter state
- Handles status update callback
- Displays three tabs: Feedback, Analytics, Insights

**`frontend/components/FeedbackList.tsx`**

- Displays array of feedback as cards
- Shows all fields: title, description, category, priority, sentiment, tags, summary
- Status dropdown (interactive, calls API on change)
- Delete button for each feedback
- Loading states during updates

**`frontend/components/FeedbackFilters.tsx`**

- Status dropdown filter
- Category dropdown filter
- Priority dropdown filter
- Sort by dropdown
- Reset Filters button
- State management for all filters

**`frontend/lib/auth.ts`**

- `login(email, password)` - Calls backend API, stores JWT token
- `logout()` - Clears token and session
- `isAuthenticated()` - Checks if token exists
- `getToken()` - Returns current JWT token

**`frontend/components/ProtectedRoute.tsx`**

- Checks authentication before rendering
- Redirects to /login if not authenticated
- Shows loading state while checking

### Backend API

All dashboard features use these endpoints:

| Endpoint              | Method | Protected | Purpose                         |
| --------------------- | ------ | --------- | ------------------------------- |
| `/auth/login`         | POST   | No        | Admin login, returns JWT        |
| `/feedback`           | GET    | Yes       | Get all feedback (with filters) |
| `/feedback/:id`       | GET    | Yes       | Get single feedback             |
| `/feedback/:id`       | PUT    | Yes       | Update status or other fields   |
| `/feedback/:id`       | DELETE | Yes       | Delete feedback                 |
| `/feedback/analytics` | GET    | Yes       | Get analytics data              |
| `/feedback/insights`  | GET    | Yes       | Get AI insights                 |

### Authentication

All protected routes require JWT token in Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token is automatically added to all API requests by the frontend auth middleware.

---

## Testing the Features

### Test 1: Login Flow

```bash
1. Go to http://localhost:3000/dashboard
   → Redirected to /login ✓

2. Enter credentials:
   Email: admin@feedpulse.com
   Password: FeedPulse@123

3. Click "Login to Dashboard"
   → Logged in and redirected to dashboard ✓

4. Refresh page
   → Still logged in (session persisted) ✓
```

### Test 2: Feedback Display

```bash
1. Go to /dashboard
2. Look at first feedback card
   → See title with sentiment emoji ✓
   → See description text ✓
   → See category badge ✓
   → See priority score ✓
   → See status dropdown ✓
   → See AI tags ✓
   → See AI summary ✓
```

### Test 3: Filter by Category

```bash
1. Click "Category" dropdown
2. Select "Bug"
   → See only bug reports ✓
3. Select "Feature Request"
   → See only feature requests ✓
4. Click "Reset Filters"
   → See all feedback again ✓
```

### Test 4: Filter by Status

```bash
1. Click "Status" dropdown
2. Select "New"
   → See only new feedback ✓
3. Select "Completed"
   → See only completed items ✓
4. Click "Reset Filters"
   → See all feedback again ✓
```

### Test 5: Inline Status Update

```bash
1. Find any feedback card
2. Click status dropdown
3. Select different status (e.g., "In Progress")
   → Status updates instantly ✓
   → Color changes ✓
   → No page refresh needed ✓
4. Refresh page
   → Status still changed (persisted) ✓
```

### Test 6: Combined Filters

```bash
1. Filter Category: "Bug"
2. Filter Status: "New"
   → See only NEW bugs ✓
3. Change Category to "Feature Request"
   → See only NEW feature requests ✓
4. Remove Status filter
   → See all Feature Requests (new and old) ✓
```

### Test 7: Logout

```bash
1. Click "Logout" button (top-right)
   → Redirected to /login ✓
2. Try accessing /dashboard
   → Redirected to /login ✓
```

---

## Security Considerations

### ✅ Implemented

- Client-side validation
- JWT token-based authentication
- Protected routes with automatic redirects
- Logout functionality clears all session data
- Error handling and validation

### ⚠️ Development Only

- Client-side token passing to API
- No HTTPS enforcement
- No rate limiting
- No session timeout

### 🚀 For Production, Add:

- [ ] HTTPS enforcement
- [ ] CSRF token protection
- [ ] Rate limiting
- [ ] Session timeout (15-30 minutes)
- [ ] Activity logging
- [ ] IP whitelisting
- [ ] Multi-factor authentication (2FA)
- [ ] Password reset flow

---

## File Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Public feedback form
│   ├── login/
│   │   └── page.tsx               # Admin login page
│   ├── dashboard/
│   │   └── page.tsx               # Protected admin dashboard
│   └── layout.tsx                 # Root layout
├── components/
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   ├── SiteHeader.tsx             # Dynamic navigation header
│   ├── FeedbackForm.tsx           # Public feedback submission
│   ├── FeedbackList.tsx           # Feedback card display
│   ├── FeedbackFilters.tsx        # Filter controls
│   └── AnalyticsDashboard.tsx    # Charts and analytics
├── lib/
│   └── auth.ts                    # Authentication logic
└── types/
    └── feedback.ts                # TypeScript interfaces
```

---

## Admin Credentials

For development and testing:

| Field        | Value                 |
| ------------ | --------------------- |
| **Email**    | `admin@feedpulse.com` |
| **Password** | `FeedPulse@123`       |

**Access Points:**

- Public Feedback Form: `http://localhost:3000`
- Admin Login: `http://localhost:3000/login`
- Admin Dashboard: `http://localhost:3000/dashboard`

---

## Summary

✅ **Requirement** - Protected dashboard with authentication

- Login page with demo credentials
- Session persistent in localStorage
- ProtectedRoute guards dashboard access
- Logout functionality

✅ **Requirement** - Feedback card display

- All feedback fields displayed on cards
- Sentiment emoji badges
- Priority badges
- Category tags
- AI-generated summaries and tags
- User information and timestamp

✅ **Requirement** - Filter by category

- Dropdown with category options
- Works independently and with other filters
- Updates list instantly

✅ **Requirement** - Filter by status

- Dropdown with status workflow states
- Works independently and with other filters
- Updates list instantly

✅ **Requirement** - Inline status editing

- Interactive status dropdown on each card
- Updates instantly without page refresh
- Persists to database
- Error handling with revert on failure

---

**All Requirements Complete and tested!** 🚀
