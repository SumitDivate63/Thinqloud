# Final Architecture & Live Demonstration Plan

## Live Demonstration Flow (10-15 Minutes)
1. **Google OAuth & Participant Onboarding**: Sign in via Google OAuth, claim access pass.
2. **Schedule Browsing & Registration**: Filter sessions by Day & Track, save sessions to agenda.
3. **Organizer Dynamic Attendance Workflow**:
   - Organizer switches to Organizer Mode.
   - Selects Keynote Session and clicks "Start Attendance Window".
   - Displays real-time **Dynamic QR Code** with security token rotation.
4. **Participant QR Scan & Verification**:
   - Participant scans QR / enters token.
   - Validation pipeline checks Auth, Registration, Expiry, and Duplicates.
   - Instant attendance confirmation displayed.
5. **Real-time Live Organizer Dashboard**:
   - Organizer dashboard increments attendance counter in real-time.
6. **Post-Attendance Feedback & Analytics**:
   - Participant submits rating and comment.
   - Organizer analytics chart displays live attendance rate and average feedback score.
