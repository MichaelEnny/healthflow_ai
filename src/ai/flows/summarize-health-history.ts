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
    .describe('A string containing the user health history.'),
});
export type SummarizeHealthHistoryInput = z.infer<typeof SummarizeHealthHistoryInputSchema>;

const SummarizeHealthHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user health history.'),
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
  prompt: `You are an AI assistant summarizing a user's health history.
Summarize the following health history:

{{healthHistory}}`,
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
