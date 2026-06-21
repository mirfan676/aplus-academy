# Firestore rules required for PTE essay responses

Merge these match blocks inside the existing
`match /databases/{database}/documents` section. Do not replace unrelated rules.

```text
match /pteEssays/{essayId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null
    && request.auth.token.email in [
      "irfan.karor.mi@gmail.com",
      "webservicesaplus@gmail.com",
      "aplusacademylahore@gmail.com"
    ];
}

match /pteEssayResponses/{responseId} {
  allow read: if true;

  allow create: if request.auth != null
    && request.resource.data.userId == request.auth.uid
    && request.resource.data.displayName is string
    && request.resource.data.essayText is string
    && request.resource.data.essayText.size() >= 500
    && request.resource.data.essayText.size() <= 5000
    && request.resource.data.score is int
    && request.resource.data.score >= 0
    && request.resource.data.score <= 90;

  allow update, delete: if request.auth != null
    && resource.data.userId == request.auth.uid;
}
```

The public response document deliberately excludes the student's email. It
stores only the Firebase user ID needed for ownership rules, Google display
name, profile photo URL, essay, diagnostics, and practice score.
