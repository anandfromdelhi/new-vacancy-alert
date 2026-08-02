const fs = require('fs');

const indexCode = `
import { faqDataPart1 } from './faqData1';
import { faqDataPart2 } from './faqData2';

export const faqData = [...faqDataPart1, ...faqDataPart2];
`;

fs.writeFileSync('src/pages/notification-sections/faqData.ts', indexCode);
