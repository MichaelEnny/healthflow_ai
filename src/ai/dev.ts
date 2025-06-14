import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-health-history.ts';
import '@/ai/flows/normalize-symptoms.ts';