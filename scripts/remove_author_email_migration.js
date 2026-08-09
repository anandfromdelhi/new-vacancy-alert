/**
 * Admin SDK Migration Script: Remove author_email PII from Firestore Comments
 * 
 * Instructions:
 * 1. Download Service Account Key JSON from Firebase Console -> Project Settings -> Service Accounts.
 * 2. Save key file locally as 'serviceAccountKey.json' (do NOT commit to git).
 * 3. Run script using Node.js: node scripts/remove_author_email_migration.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

async function migrateCommentsAuthorEmail() {
  const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Error: serviceAccountKey.json not found in project root!');
    console.error('Please download your Firebase Admin Service Account Key from Firebase Console and place it at:', serviceAccountPath);
    process.exit(1);
  }

  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  console.log('🚀 Starting author_email PII cleanup migration on Firestore comments collection...');

  const commentsRef = db.collection('comments');
  const snapshot = await commentsRef.get();

  if (snapshot.empty) {
    console.log('ℹ️ No comment documents found in Firestore comments collection.');
    process.exit(0);
  }

  console.log(`📊 Found ${snapshot.size} total comment document(s) in Firestore.`);

  let batch = db.batch();
  let operationCount = 0;
  let totalModified = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if ('author_email' in data) {
      batch.update(doc.ref, {
        author_email: admin.firestore.FieldValue.delete()
      });
      operationCount++;
      totalModified++;

      // Commit batch when reaching Firestore limit of 500 writes
      if (operationCount === 500) {
        await batch.commit();
        console.log(`✅ Committed batch of 500 document updates...`);
        batch = db.batch();
        operationCount = 0;
      }
    }
  }

  if (operationCount > 0) {
    await batch.commit();
    console.log(`✅ Committed final batch of ${operationCount} document update(s).`);
  }

  console.log('\n=======================================================');
  console.log(`🎉 MIGRATION COMPLETED SUCCESSFULLY!`);
  console.log(`   - Total Comments Scanned  : ${snapshot.size}`);
  console.log(`   - Total Documents Cleaned  : ${totalModified} (author_email field stripped)`);
  console.log('=======================================================\n');

  process.exit(0);
}

// Uncomment line below to execute manually when ready:
// migrateCommentsAuthorEmail().catch(console.error);
