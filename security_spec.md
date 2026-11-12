# Security Specification & Test Definitions

## 1. Data Invariants
1. **User Scoping & Isolation**: All user-specific data resides strictly under `/users/{userId}/...`. A user can only read, create, update, or delete sub-resources within their own document hierarchy (`request.auth.uid == userId`).
2. **Identity Integrity**: All documents written must have `userId == request.auth.uid` matching the path variable `{userId}`.
3. **No Blanket Access**: Unauthenticated access is denied by default (`match /{document=**} { allow read, write: if false; }`).
4. **Input Size & Boundary Guards**: All strings have explicit `.size() <= limit` constraints to prevent denial-of-wallet resource exhaustion.
5. **ID Injection Prevention**: Document ID path variables are guarded with `isValidId(id)` pattern checks (`^[a-zA-Z0-9_\\-]+$`).
6. **Temporal Immutability**: `createdAt` / `savedAt` cannot be mutated on updates.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Read to `/users/alice`**: Attempting to read user profile without sign-in -> `PERMISSION_DENIED`.
2. **Cross-User Snooping**: Authenticated user Bob attempting to list or read Alice's favorites `/users/alice/favorites` -> `PERMISSION_DENIED`.
3. **Ghost Field Injection**: Adding an unpermitted field (e.g. `isAdmin: true` or `role: "admin"`) to user profile on create or update -> `PERMISSION_DENIED`.
4. **Cross-User Bookmark Spoofing**: Bob attempting to write a favorite under `/users/alice/favorites/book-1` -> `PERMISSION_DENIED`.
5. **Identity Mismatch**: Alice attempting to create `/users/alice/favorites/book-1` with `userId: "bob"` -> `PERMISSION_DENIED`.
6. **Malicious Giant String Payload**: Attempting to insert a 2MB `title` into a custom notebook -> `PERMISSION_DENIED`.
7. **Path Traversal / Poisoned ID**: Attempting to create a favorite with document ID `../../admins` or non-regex characters -> `PERMISSION_DENIED`.
8. **Tampering with Immutable Creation Time**: Updating a reading progress document and attempting to alter `savedAt` or `userId` -> `PERMISSION_DENIED`.
9. **Status Enumeration Violation**: Writing a reading progress item with `status: "hacked"` instead of allowed enum -> `PERMISSION_DENIED`.
10. **Blind Global Query**: Attempting `collectionGroup('favorites')` without user filtering -> `PERMISSION_DENIED`.
11. **Client Delegation Bypass**: Attempting to update another user's reading progress notes -> `PERMISSION_DENIED`.
12. **Anonymous Privilege Escalation**: Unverified or unauthenticated caller attempting to create a custom notebook -> `PERMISSION_DENIED`.
