# Firebase rules for the Firestore-first A Plus Academy app

Merge these match blocks with any unrelated production rules. They protect
private contact data, require Google authentication for user-owned writes, and
limit administrative writes to the approved admin emails.

## Firestore

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    function isAdmin() {
      return signedIn() && request.auth.token.email in [
        "irfan.karor.mi@gmail.com",
        "webservicesaplus@gmail.com",
        "aplusacademylahore@gmail.com"
      ];
    }

    match /users/{uid} {
      allow read, create, update: if isOwner(uid) || isAdmin();
      allow delete: if isAdmin();
    }

    match /parentProfiles/{uid} {
      allow read, create, update: if isOwner(uid) || isAdmin();
      allow delete: if isOwner(uid) || isAdmin();
    }

    match /studentProfiles/{uid} {
      allow read, create, update: if isOwner(uid) || isAdmin();
      allow delete: if isOwner(uid) || isAdmin();
    }

    match /teacherApplications/{uid} {
      allow read: if isOwner(uid) || isAdmin();
      allow create: if isOwner(uid)
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.status == "pending";
      allow update: if isAdmin() || (
        isOwner(uid)
        && resource.data.uid == request.auth.uid
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.status == "pending"
        && request.resource.data.verified == false
      );
      allow delete: if isOwner(uid) || isAdmin();
    }

    match /teachers/{teacherId} {
      allow read: if resource.data.verified == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    match /teacherPrivate/{teacherId} {
      allow read, write: if isAdmin();
    }

    match /jobs/{jobId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /siteConfig/{documentId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /tutorRequests/{requestId} {
      allow create: if signedIn()
        && request.resource.data.userId == request.auth.uid;
      allow read: if isAdmin() || (signedIn() && resource.data.userId == request.auth.uid);
      allow update, delete: if isAdmin();
    }

    match /pteEssays/{essayId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    match /pteEssayResponses/{responseId} {
      allow read: if true;
      allow create: if signedIn()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.displayName is string
        && request.resource.data.essayText is string
        && request.resource.data.essayText.size() >= 500
        && request.resource.data.essayText.size() <= 5000
        && request.resource.data.score is int
        && request.resource.data.score >= 0
        && request.resource.data.score <= 90;
      allow update, delete: if isAdmin() || (
        signedIn() && resource.data.userId == request.auth.uid
      );
    }
  }
}
```

## Storage

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn() && request.auth.token.email in [
        "irfan.karor.mi@gmail.com",
        "webservicesaplus@gmail.com",
        "aplusacademylahore@gmail.com"
      ];
    }

    match /teachers/{teacherId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin()
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }

    match /teacher-applications/{uid}/{fileName} {
      allow read: if signedIn() && (request.auth.uid == uid || isAdmin());
      allow write: if signedIn()
        && (request.auth.uid == uid || isAdmin())
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Public teacher documents exclude phone numbers and email addresses. Those are
kept in `teacherPrivate` or `teacherApplications`, which are admin/owner-only.
