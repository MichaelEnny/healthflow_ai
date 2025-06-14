"use server";

import { normalizeSymptoms, type NormalizeSymptomsInput } from '@/ai/flows/normalize-symptoms';

export async function getNormalizedSymptoms(symptoms: string): Promise<string | null> {
  if (!symptoms.trim()) {
    return null;
  }
  try {
    const input: NormalizeSymptomsInput = { symptoms };
    const result = await normalizeSymptoms(input);
    return result.normalizedSymptoms;
  } catch (error) {
    console.error("Error normalizing symptoms:", error);
    // Depending on desired behavior, you might want to throw the error
    // or return a specific error message / null.
    // For now, let's re-throw to be handled by the caller.
    throw new Error("Failed to normalize symptoms due to an AI processing error.");
  }
}
