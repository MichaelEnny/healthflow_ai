
"use client";

import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getNormalizedSymptoms } from '@/actions/symptoms';
import type { DiagnosisResult, Appointment, HealthRecord } from '@/types';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CalendarClock, ClipboardList, FlaskConical, Lightbulb, Loader2, Stethoscope, ShieldAlert } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const symptomFormSchema = z.object({
  symptoms: z.string().min(10, { message: "Please describe your symptoms in at least 10 characters." }),
});

type SymptomFormValues = z.infer<typeof symptomFormSchema>;

// Mock data for localStorage keys
const HEALTH_RECORDS_KEY = 'healthflow_health_records';
const APPOINTMENTS_KEY = 'healthflow_appointments';

export default function SymptomAnalyzerClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [normalizedSymptoms, setNormalizedSymptoms] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [showAppointmentScheduler, setShowAppointmentScheduler] = useState(false);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomFormSchema),
    defaultValues: {
      symptoms: "",
    },
  });

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  useEffect(() => {
    // Reset time when date changes
    setSelectedTime(undefined);
  }, [selectedDate]);

  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    setNormalizedSymptoms(null);
    setDiagnosisResult(null);
    setShowAppointmentScheduler(false);

    try {
      const normSymptoms = await getNormalizedSymptoms(data.symptoms);
      setNormalizedSymptoms(normSymptoms);

      // Mock diagnosis based on normalized symptoms
      // In a real app, this would call Infermedica or similar
      const mockDiagnosis: DiagnosisResult = {
        potentialConditions: normSymptoms ? [`Condition related to ${normSymptoms.substring(0,20)}...`, "Common Cold", "Allergy"] : ["Common Cold", "Allergy"],
        urgency: Math.random() > 0.7 ? 'High' : (Math.random() > 0.4 ? 'Medium' : 'Low'),
        recommendedTests: ["Complete Blood Count (CBC)", "Urinalysis"],
      };
      setDiagnosisResult(mockDiagnosis);
      setShowAppointmentScheduler(true); // Show scheduler after diagnosis

      // Save to health records (localStorage)
      if (typeof window !== 'undefined') {
        const newRecord: HealthRecord = {
          id: new Date().toISOString(),
          date: new Date().toLocaleDateString(),
          symptoms: data.symptoms,
          normalizedSymptoms: normSymptoms || undefined,
          ...mockDiagnosis,
        };
        const existingRecordsRaw = localStorage.getItem(HEALTH_RECORDS_KEY);
        const existingRecords: HealthRecord[] = existingRecordsRaw ? JSON.parse(existingRecordsRaw) : [];
        localStorage.setItem(HEALTH_RECORDS_KEY, JSON.stringify([newRecord, ...existingRecords]));
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedTime || !diagnosisResult) {
      toast({
        variant: "destructive",
        title: "Scheduling Error",
        description: "Please select a date and time for your appointment.",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: new Date().toISOString(),
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      reason: diagnosisResult.potentialConditions[0] || "Follow-up",
      doctor: "Dr. AI Consult",
    };
    
    if (typeof window !== 'undefined') {
      const existingAppointmentsRaw = localStorage.getItem(APPOINTMENTS_KEY);
      const existingAppointments: Appointment[] = existingAppointmentsRaw ? JSON.parse(existingAppointmentsRaw) : [];
      localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify([newAppointment, ...existingAppointments]));
    }

    toast({
      title: "Appointment Scheduled",
      description: `Your appointment for ${newAppointment.reason} is scheduled on ${newAppointment.date} at ${newAppointment.time}.`,
    });
    setShowAppointmentScheduler(false); // Optionally hide scheduler after booking
    form.reset(); // Clear the form
    setNormalizedSymptoms(null);
    setDiagnosisResult(null);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Stethoscope className="mr-2 h-7 w-7 text-primary" />
            AI Symptom Analysis
          </CardTitle>
          <CardDescription>
            Describe your symptoms in natural language, and our AI will help analyze them.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="symptoms-textarea" className="text-lg">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        id="symptoms-textarea"
                        placeholder="e.g., I have a persistent cough, slight fever, and headache for the past 3 days..."
                        className="min-h-[120px] text-base resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Analyze Symptoms
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {normalizedSymptoms && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><ClipboardList className="mr-2 h-6 w-6 text-primary" /> Normalized Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">{normalizedSymptoms}</p>
          </CardContent>
        </Card>
      )}

      {diagnosisResult && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><ShieldAlert className="mr-2 h-6 w-6 text-destructive" /> Diagnostic Insights (Mock Data)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary" /> Potential Conditions:</h3>
              <ul className="list-disc list-inside ml-4">
                {diagnosisResult.potentialConditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center"><AlertCircle className="mr-2 h-5 w-5 text-primary" /> Urgency Level:</h3>
              <p className={cn(
                "font-bold",
                diagnosisResult.urgency === 'High' || diagnosisResult.urgency === 'Critical' ? 'text-destructive' : 
                diagnosisResult.urgency === 'Medium' ? 'text-yellow-600' : 'text-green-600'
              )}>{diagnosisResult.urgency}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-primary" /> Recommended Tests:</h3>
              <ul className="list-disc list-inside ml-4">
                {diagnosisResult.recommendedTests.map((test, index) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
      
      {showAppointmentScheduler && diagnosisResult && (
         <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><CalendarClock className="mr-2 h-6 w-6 text-primary" /> Schedule Follow-up Appointment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} // Disable past dates
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold mb-2">Select a time slot for {selectedDate?.toLocaleDateString()}:</h4>
              {selectedDate && (
                <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="space-y-2">
                  {availableTimes.map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <RadioGroupItem value={time} id={`time-${time}`} />
                      <Label htmlFor={`time-${time}`} className="cursor-pointer">{time}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {!selectedDate && <p className="text-muted-foreground">Please select a date first.</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleScheduleAppointment} disabled={!selectedDate || !selectedTime} size="lg">
              <CalendarClock className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    