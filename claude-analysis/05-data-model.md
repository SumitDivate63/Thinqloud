# Firestore Data Model Design

## Primary Collections & Schema

### 1. `users`
- `uid`: string (Primary Key)
- `email`: string
- `displayName`: string
- `role`: 'participant' | 'organizer' | 'admin'
- `createdAt`: timestamp

### 2. `events`
- `eventId`: string
- `title`: string
- `description`: string
- `location`: string
- `startDate`: string
- `organizerId`: string
- `capacity`: number

### 3. `sessions`
- `sessionId`: string
- `eventId`: string
- `title`: string
- `room`: string
- `time`: string
- `speakerId`: string
- `attendanceActive`: boolean
- `currentDynamicToken`: string

### 4. `registrations`
- `registrationId`: string
- `eventId`: string
- `participantId`: string
- `passType`: 'virtual' | 'standard' | 'vip'
- `registeredAt`: timestamp

### 5. `attendance`
- `attendanceId`: string
- `sessionId`: string
- `eventId`: string
- `participantId`: string
- `participantName`: string
- `verifiedAt`: timestamp
- `tokenUsed`: string

### 6. `feedback`
- `feedbackId`: string
- `sessionId`: string
- `participantId`: string
- `rating`: number (1-5)
- `comment`: string
- `submittedAt`: timestamp
