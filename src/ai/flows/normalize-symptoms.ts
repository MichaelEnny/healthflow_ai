// src/ai/flows/normalize-symptoms.ts
'use server';
/**
 * @fileOverview Normalizes user-entered symptoms using natural language processing.
 *
 * - normalizeSymptoms - A function that normalizes symptoms from natural language.
 * - NormalizeSymptomsInput - The input type for the normalizeSymptoms function.
 * - NormalizeSymptomsOutput - The return type for the normalizeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NormalizeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe("The user's symptoms described in natural language."),
});
export type NormalizeSymptomsInput = z.infer<typeof NormalizeSymptomsInputSchema>;

const NormalizeSymptomsOutputSchema = z.object({
  normalizedSymptoms: z
    .string()
    .describe("The user's symptoms, normalized into a standard format."),
});
export type NormalizeSymptomsOutput = z.infer<typeof NormalizeSymptomsOutputSchema>;

export async function normalizeSymptoms(input: NormalizeSymptomsInput): Promise<NormalizeSymptomsOutput> {
  return normalizeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'normalizeSymptomsPrompt',
  input: {schema: NormalizeSymptomsInputSchema},
  output: {schema: NormalizeSymptomsOutputSchema},
  prompt: `You are a medical assistant that normalizes user-provided symptoms into a structured format.

  User Symptoms: {{{symptoms}}}

  Please normalize these symptoms into a concise, standardized medical terminology.
  Return only the normalized symptoms.`,
});

const normalizeSymptomsFlow = ai.defineFlow(
  {
    name: 'normalizeSymptomsFlow',
    inputSchema: NormalizeSymptomsInputSchema,
    outputSchema: NormalizeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
