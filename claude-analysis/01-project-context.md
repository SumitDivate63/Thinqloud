# Event Management Platform — Project Context

## Objective

I am building an Event Management Platform as part of a campus hiring assessment for Thinqloud.

The assessment evaluates:

**Understand → Analyse → Design → Build → Explain**

The company is specifically interested in:

- Understanding a real business process
- Requirement analysis
- System design
- Logical thinking
- Application development
- Use of modern AI-assisted development
- Ability to explain technical decisions
- Ability to demonstrate a complete working application

The application should therefore not be a collection of disconnected CRUD screens. It should represent a complete event management business process.

---

# Selected Application

**Event Management Platform**

The platform manages:
- Event creation
- Event registration
- Participants
- Sessions
- Speakers
- Attendance
- Feedback
- Event analytics
- Notifications
- Organizer/admin operations

---

# Target Platform

The application is web based.

Preferred deployment:
- Vercel for frontend
- Firebase for authentication (Google OAuth)
- Firebase Firestore for database
- Firebase Cloud Functions where backend/server-side logic is required
- Firebase Storage for assets/banners
- Dynamic QR-based attendance verification

---

# Authentication

Role-based access control with Google OAuth via Firebase Authentication:
- Participant
- Organizer
- Admin

---

# Existing Project Context

Reference project: `ConferenceApp` (Flutter + Firebase).
The existing project is treated as a reference for domain understanding. The new system is designed as a web-first application using React + TypeScript/JS + Firebase + Vercel.
