
export interface HealthRecord {
  id: string;
  date: string;
  symptoms: string;
  normalizedSymptoms?: string;
  potentialConditions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedTests: string[];
  summary?: string; // Optional: for AI summarized history
  // userId?: string; // Would be added in a multi-user backend scenario
}

export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string;
  doctor?: string;
  // userId?: string; // Would be added in a multi-user backend scenario
}

export interface DiagnosisResult {
  potentialConditions: string[];
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedTests: string[];
}

export interface RegisteredUser {
  userId: string; // Unique identifier for the user
  email: string;
  passwordHash: string; // In a real app, this would be a securely hashed password
}
