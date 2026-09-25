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
                    │   Google OAuth (Free)   │
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
       │ Firestore  │    │ Image URLs  │    │ Deploy       │
       │ DB (Free)  │    │ Unsplash/   │    │ Vercel       │
       │            │    │ Dicebear    │    │ (Free)       │
       └────────────┘    └─────────────┘    └──────────────┘
              │
              ▼
       ┌──────────────────────────────────────────┐
       │ Attendance / QR Verification             │
       │ Registration / Feedback / Analytics      │
       └──────────────────────────────────────────┘
```

## Zero-Cost 100% Free Tier Architecture (Firebase Spark Plan + Vercel)

To ensure this web platform is **100% Free** without requiring a credit card or Firebase Blaze plan:

1. **Firebase Authentication**: 100% Free on Spark Plan (Up to 50,000 active users/month).
2. **Cloud Firestore**: 100% Free on Spark Plan (1 GB storage, 50,000 reads/day, 20,000 writes/day).
3. **Image Handling (No Cloud Storage / No Cloudinary Needed)**: Event banners, speaker photos, and participant avatars are stored as **high-resolution CDN image URLs directly in Firestore documents** (using free image hosts like Unsplash and SVG Dicebear APIs). Storing string URLs in Firestore is 100% free and avoids billing prompts.
4. **Frontend Hosting**: Deployed for **$0 on Vercel** (Hobby Plan).
