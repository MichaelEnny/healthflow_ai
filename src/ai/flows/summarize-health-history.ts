'use server';
/**
 * @fileOverview Summarizes a user's health history for easy tracking.
 *
 * - summarizeHealthHistory - A function that summarizes health history.
 * - SummarizeHealthHistoryInput - The input type for the summarizeHealthHistory function.
 * - SummarizeHealthHistoryOutput - The return type for the summarizeHealthHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHealthHistoryInputSchema = z.object({
  healthHistory: z
    .string()
    .describe("A JSON string representing an array of the user's health records."),
});
export type SummarizeHealthHistoryInput = z.infer<typeof SummarizeHealthHistoryInputSchema>;

const SummarizeHealthHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise, professional summary of the user health history, highlighting trends and key issues.'),
});
export type SummarizeHealthHistoryOutput = z.infer<typeof SummarizeHealthHistoryOutputSchema>;

export async function summarizeHealthHistory(
  input: SummarizeHealthHistoryInput
): Promise<SummarizeHealthHistoryOutput> {
  return summarizeHealthHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeHealthHistoryPrompt',
  input: {schema: SummarizeHealthHistoryInputSchema},
  output: {schema: SummarizeHealthHistoryOutputSchema},
  prompt: `You are an expert medical AI assistant. Your task is to analyze a patient's health history, provided as a JSON array of past records. Provide a concise, professional summary that highlights:
1. Key recurring symptoms or conditions.
2. Any noticeable trends over time (e.g., increasing frequency of headaches).
3. A high-level overview of the patient's reported health journey.

Format the output as a clean, readable summary. Do not just list the records. Synthesize the information into actionable insights.

Health History Data:
{{{healthHistory}}}`,
});

const summarizeHealthHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeHealthHistoryFlow',
    inputSchema: SummarizeHealthHistoryInputSchema,
    outputSchema: SummarizeHealthHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
