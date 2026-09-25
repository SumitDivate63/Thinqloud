# Attendance System Design (Dynamic QR Workflow)

## Overview

Attendance is the flagship business workflow of the platform. Rather than a static "Mark Present" button, the system uses a secure, real-time **Dynamic QR Code** verification loop.

---

## Complete Attendance Workflow

```
Participant Registers
        ↓
Participant Opens Session Page
        ↓
Organizer Starts Attendance Window
        ↓
System Generates Dynamic QR Code (+ Time-Limited Security Token)
        ↓
Participant Scans QR Code / Enters Token
        ↓
Firebase Auth Verifies User Identity
        ↓
System Validates:
   1. User is authenticated
   2. User is registered for the event
   3. Session ID is valid
   4. Attendance window is ACTIVE (token not expired)
   5. User has NOT already marked attendance for this session
        ↓
Attendance Record Written to Firestore
        ↓
Organizer Dashboard Live Counter Updates (+1)
        ↓
Participant Sees Real-Time Verified Attendance Badge & History
```

---

## Security & Trade-offs: Static vs Dynamic QR Codes

| Approach | Security Level | Abuse Prevention | Complexity | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Static QR** | Low | Vulnerable to screenshots & chat sharing | Low | Not Recommended |
| **Dynamic QR (Rotated)** | High | Prevents static screenshot reuse | Medium | **Recommended (Selected)** |

---

## Edge Case Handling

1. **Duplicate Scan**: Re-verification check stops second submission and displays "Already Marked".
2. **Expired Window**: Returns "Attendance Window Closed".
3. **Unregistered User**: Prompt to register first before scanning.
