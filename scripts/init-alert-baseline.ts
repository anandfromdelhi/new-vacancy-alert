import dotenv from 'dotenv';
dotenv.config();

import { initFirebaseAdmin } from '../src/server/firebaseAdmin';
import { initializeJobAlertBaseline } from '../src/server/automaticJobAlertScheduler';

async function main() {
  console.log('========================================================');
  console.log('  INITIALIZING PHASE 4 JOB ALERT BASELINE');
  console.log('========================================================');
  console.log('Scanning canonical jobs to mark them as pre-existing baseline.');
  console.log('This ensures ZERO Telegram alerts will be sent for existing jobs.\n');

  initFirebaseAdmin();

  try {
    const result = await initializeJobAlertBaseline();
    console.log('\n✅ Baseline Initialization Succeeded!');
    console.log(`   Total Jobs Baselined: ${result.totalBaselined}`);
    console.log(`   Baselined At:        ${result.baselinedAt}`);
    console.log(`   Telegram Messages:   0 (Guaranteed Zero Messages)`);
    console.log('========================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Baseline Initialization Failed:', err.message);
    process.exit(1);
  }
}

main();
