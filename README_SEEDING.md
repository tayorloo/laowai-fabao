# Laowai Fabao — Seeding Data

## Seed Firestore Collections
Use the Firebase CLI or a custom script to import JSON into Firestore.

Collections and files:
- policies ← seed/policies.json
- faqs ← seed/faqs.json
- cities ← seed/cities.json
- attractions ← seed/attractions.json
- food_items ← seed/food_items.json
- lessons ← seed/lessons.json

### Option A: Use a small Node script
Create a script to read JSON files and write documents keyed by `id`.

### Option B: Manual import
Open Firebase Console → Firestore → Import JSON per collection.

## Upload Storage Media
- Upload lesson audio to `audio/lessons/{lessonId}/standard.mp3`
- Upload user practice audio will be created by the app under `audio/user_practice/{userId}/...`
- Upload attraction images under `media/attractions/{id}/...`

## Rules and Indexes
Deploy `firestore.rules`, `storage.rules`, and `firestore.indexes.json`:

```
firebase deploy --only firestore:indexes,firestore:rules,storage
```