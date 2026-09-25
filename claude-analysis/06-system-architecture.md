# High-Level System Architecture

```
                    ┌─────────────────────────┐
                    │       Web Browser       │
                    │ React / Next.js / JS    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      Authentication     │
                    │    Firebase Auth        │
                    │      Google OAuth       │
                    └────────────┬────────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  │                             │
                  ▼                             ▼
        ┌─────────────────┐           ┌─────────────────┐
        │ Participant UI  │           │ Organizer/Admin │
        │                 │           │ Dashboard       │
        └────────┬────────┘           └────────┬────────┘
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                    ┌─────────────────────────┐
                    │   Application Services  │
                    │ Events / Registrations  │
                    │ Sessions / Attendance   │
                    │ Feedback / Analytics    │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
       ┌────────────┐    ┌─────────────┐    ┌──────────────┐
       │ Firestore  │    │ Cloud       │    │ Cloud        │
       │ Database   │    │ Functions   │    │ Storage      │
       └────────────┘    └─────────────┘    └──────────────┘
              │
              ▼
       ┌──────────────────────────────────────────┐
       │ Attendance / QR Verification             │
       │ Registration / Feedback / Analytics      │
       └──────────────────────────────────────────┘

                    Deployment
                         │
                         ▼
                  ┌─────────────┐
                  │   Vercel    │
                  └─────────────┘
```

## Image & Asset Storage Recommendation: Why Firebase Storage (Not Cloudinary)

For this assessment deployment:
1. **Firebase Storage** is already integrated in our SDK initialization (`src/firebase.js`).
2. Firebase Storage inherits Firebase Authentication security rules out-of-the-box.
3. Eliminates third-party API key setup, keeping deployment on Vercel clean and straightforward.
