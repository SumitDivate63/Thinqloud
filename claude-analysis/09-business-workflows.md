# End-to-End Business Workflows

## Flagship Assessment Workflow: Organizer QR -> Participant Scan -> Verified Attendance -> Feedback -> Analytics

```
ORGANIZER
   │
   ▼
Create Event & Sessions
   │
   ▼
Publish Event
   │
   ▼
PARTICIPANT
   │
   ▼
Google OAuth Sign-In
   │
   ▼
Register Event (Claim Pass)
   │
   ▼
View Schedule & Select Session
   │
   ▼
ORGANIZER (Laptop Display)
   │
   ▼
Start Attendance Window → System Generates Dynamic QR Code
   │
   ▼
PARTICIPANT (Phone / Web Scanner)
   │
   ▼
Scan Dynamic QR Code / Enter Token
   │
   ▼
SYSTEM VALIDATION
   1. User Auth Check
   2. Registration Check
   3. Window Active Check
   4. Duplicate Check
   │
   ▼
Attendance Record Saved to Firestore
   │
   ▼
Organizer Live Dashboard Counter Updates (+1)
   │
   ▼
Participant Submits Feedback Rating & Comment
   │
   ▼
Organizer Analytics Aggregated
```
