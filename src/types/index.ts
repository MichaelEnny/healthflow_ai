export interface HealthRecord {
  id: string;
  date: string;
  symptoms: string;
  normalizedSymptoms?: string;
  potentialConditions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedTests: string[];
  summary?: string; // Optional: for AI summarized history
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  doctor?: string;
}

export interface DiagnosisResult {
  potentialConditions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedTests: string[];
}
