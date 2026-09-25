# Business Requirements Analysis

Analyse the Event Management Platform as a real business application.

---

# Core Business Problem

Event organizers currently manage multiple disconnected activities:
- Creating events
- Managing registrations
- Managing participants
- Scheduling sessions
- Managing speakers
- Recording attendance
- Collecting feedback
- Understanding event performance

The platform centralizes these operations into a unified workflow.

---

# Primary Users

1. **Participant**: Registers for events, views schedules, scans dynamic attendance QR, submits feedback.
2. **Organizer**: Creates events/sessions, starts attendance window, monitors live attendance counter, views feedback & analytics.
3. **Administrator**: Manages platform users, organizers, system audit logs, and content moderation.

---

# Event Lifecycle States

Draft → Published → Registration Open → Registration Closed → Event Live → Event Completed → Feedback Collection → Analytics

---

# Key Functional Requirements & Business Rules

1. **Registration Validation**: Participant must be authenticated via OAuth to register. Capacity limit enforced.
2. **Dynamic Attendance Verification**:
   - Only authenticated users registered for the event can mark attendance.
   - Attendance is accepted ONLY during an active attendance window with a valid dynamic security token.
   - Duplicate attendance attempts for the same session are rejected.
3. **Post-Attendance Feedback**:
   - Feedback submission is unlocked ONLY after verified session attendance.
