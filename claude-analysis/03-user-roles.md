# User Roles and Authorization Matrix

## Roles Overview

### 1. Participant
- Can: Sign in using Google OAuth, view events/schedules, register for events, scan dynamic attendance QR, view personal attendance log, submit feedback.
- Cannot: Create events, generate attendance tokens, access organizer analytics.

### 2. Organizer
- Can: Create/edit events & sessions, start/stop attendance window, display dynamic QR code, monitor live attendance counter, view feedback & analytics.
- Cannot: Modify global admin settings.

### 3. Administrator
- Can: Manage users/organizers, manage all events, view global platform analytics and audit logs.

---

## Permission Matrix

| Operation | Participant | Organizer | Admin |
| :--- | :---: | :---: | :---: |
| Google OAuth Sign In | ✅ | ✅ | ✅ |
| View Published Events | ✅ | ✅ | ✅ |
| Register for Event | ✅ | ❌ | ❌ |
| Create Event / Session | ❌ | ✅ | ✅ |
| Start Attendance Window | ❌ | ✅ | ✅ |
| Display Dynamic QR Code | ❌ | ✅ | ✅ |
| Scan QR / Submit Token | ✅ | ❌ | ❌ |
| Live Attendance Dashboard | ❌ | ✅ | ✅ |
| Submit Session Feedback | ✅ (Attended) | ❌ | ❌ |
| View Event Analytics | ❌ | ✅ | ✅ |
