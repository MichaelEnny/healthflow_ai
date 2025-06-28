
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
import { AlertCircle, CalendarClock, ClipboardList, FlaskConical, Lightbulb, Loader2, Stethoscope, ShieldAlert, AlertTriangle, ShieldCheck, ShieldQuestion, Info, MessageCircleQuestion, CalendarPlus } from 'lucide-react';
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
      const mockUrgencyLevels: DiagnosisResult['urgency'][] = ['Low', 'Medium', 'High', 'Critical'];
      const randomUrgency = mockUrgencyLevels[Math.floor(Math.random() * mockUrgencyLevels.length)];
      
      const mockDiagnosis: DiagnosisResult = {
        potentialConditions: normSymptoms ? [`Condition related to ${normSymptoms.substring(0,20)}...`, "Common Cold", "Allergy"] : ["Common Cold", "Allergy", "Flu"],
        urgency: randomUrgency,
        recommendedTests: ["Complete Blood Count (CBC)", "Urinalysis", "Influenza Rapid Test"],
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      setDiagnosisResult(mockDiagnosis);
      setShowAppointmentScheduler(true); 

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
        title: "Error Analyzing Symptoms",
        description: error instanceof Error ? error.message : "An unknown error occurred during analysis.",
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
      title: "Appointment Scheduled!",
      description: `Your appointment for ${newAppointment.reason} is set for ${newAppointment.date} at ${newAppointment.time}.`,
    });
    setShowAppointmentScheduler(false); 
    form.reset(); 
    setNormalizedSymptoms(null);
    setDiagnosisResult(null);
  };

  const UrgencyIndicator = ({ urgency }: { urgency: DiagnosisResult['urgency'] }) => {
    let icon = <ShieldQuestion className="mr-2 h-5 w-5" />;
    let colorClass = "text-muted-foreground";
    let bgColorClass = "bg-muted";

    if (urgency === 'Low') {
      icon = <ShieldCheck className="mr-2 h-5 w-5" />;
      colorClass = "text-green-700 dark:text-green-400";
      bgColorClass = "bg-green-100 dark:bg-green-900/50";
    } else if (urgency === 'Medium') {
      icon = <AlertTriangle className="mr-2 h-5 w-5" />;
      colorClass = "text-yellow-700 dark:text-yellow-400";
      bgColorClass = "bg-yellow-100 dark:bg-yellow-900/50";
    } else if (urgency === 'High' || urgency === 'Critical') {
      icon = <ShieldAlert className="mr-2 h-5 w-5" />;
      colorClass = "text-red-700 dark:text-red-400";
      bgColorClass = "bg-red-100 dark:bg-red-900/50";
    }

    return (
      <div className={cn("flex items-center p-3 rounded-md", bgColorClass)}>
        {icon}
        <span className={cn("font-semibold text-lg", colorClass)}>{urgency} Priority</span>
      </div>
    );
  };

  const NextStepsRecommendations = ({ result, normalizedSymptomsText }: { result: DiagnosisResult, normalizedSymptomsText: string | null }) => {
    let advice = "";
    let adviceIcon = <Info className="mr-2 h-5 w-5 text-primary" />;

    switch (result.urgency) {
      case 'Low':
        advice = "Consider monitoring your symptoms. If they persist or worsen over the next few days, or if new symptoms develop, consider scheduling a non-urgent follow-up.";
        adviceIcon = <Info className="mr-2 h-5 w-5 text-green-600" />;
        break;
      case 'Medium':
        advice = "It is advisable to schedule a follow-up appointment with a healthcare professional to discuss these findings in more detail and determine the best course of action.";
        adviceIcon = <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />;
        break;
      case 'High':
        advice = "Please consider seeking medical attention soon. Schedule an urgent follow-up or contact your healthcare provider. If symptoms are severe, consider urgent care or an emergency room.";
        adviceIcon = <ShieldAlert className="mr-2 h-5 w-5 text-red-600" />;
        break;
      case 'Critical':
        advice = "Your symptoms suggest a potentially critical situation. Please seek immediate medical attention. Go to the nearest emergency room or call emergency services.";
        adviceIcon = <ShieldAlert className="mr-2 h-5 w-5 text-red-700 font-bold" />;
        break;
      default:
        advice = "Please consult with a healthcare professional for guidance.";
    }

    return (
      <Card className="shadow-xl animate-in fade-in-50 duration-900">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className="mr-2 h-7 w-7 text-primary" /> Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg flex items-center mb-2">
              {adviceIcon}
              Based on Your Urgency Level ({result.urgency})
            </h3>
            <p className="text-muted-foreground text-base">{advice}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold text-lg flex items-center mb-2">
              <MessageCircleQuestion className="mr-2 h-5 w-5 text-primary" />
              What to Discuss with Your Doctor
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground text-base">
              {normalizedSymptomsText && <li>Mention your key symptoms: "<i>{normalizedSymptomsText}</i>".</li>}
              {!normalizedSymptomsText && <li>Describe all your symptoms in detail.</li>}
              {result.potentialConditions.length > 0 && <li>Discuss the possibility of: {result.potentialConditions.slice(0,2).join(', ')}{result.potentialConditions.length > 2 ? ' and other potential conditions identified.' : '.'}</li>}
              {result.recommendedTests.length > 0 && <li>Ask if the following tests are appropriate: {result.recommendedTests.slice(0,2).join(', ')}{result.recommendedTests.length > 2 ? '...' : '.'}</li>}
              <li>Share any concerns or questions you have about your health.</li>
            </ul>
          </div>
          <Separator />
           <div>
             <p className="text-sm text-muted-foreground flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" /> 
                This guidance is AI-generated and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for any health concerns.
             </p>
           </div>
        </CardContent>
        {!showAppointmentScheduler && ( // Show button here if scheduler isn't visible yet, or as a reminder
            <CardFooter>
                 <Button onClick={() => setShowAppointmentScheduler(true)} size="lg" className="text-base px-8 py-6 shadow-md hover:shadow-lg transition-shadow">
                    <CalendarPlus className="mr-2 h-5 w-5" /> Schedule a Follow-up
                </Button>
            </CardFooter>
        )}
      </Card>
    );
  };


  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Stethoscope className="mr-3 h-8 w-8 text-primary" />
            AI Symptom Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Describe your symptoms, and our AI will provide insights. This is not a substitute for professional medical advice.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="symptoms-textarea" className="text-lg font-semibold">Your Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        id="symptoms-textarea"
                        placeholder="e.g., I have a persistent cough, slight fever, and headache for the past 3 days..."
                        className="min-h-[150px] text-base resize-y p-4 focus:ring-primary focus:border-primary shadow-inner"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} size="lg" className="text-base px-8 py-6 shadow-md hover:shadow-lg transition-shadow">
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lightbulb className="mr-2 h-5 w-5" />}
                Analyze My Symptoms
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && !diagnosisResult && (
        <Card className="shadow-md">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Analyzing your symptoms, please wait...</p>
          </CardContent>
        </Card>
      )}

      {normalizedSymptoms && !isLoading && (
        <Card className="shadow-md animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center text-xl"><ClipboardList className="mr-2 h-6 w-6 text-primary" /> Standardized Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic text-base bg-secondary/30 p-3 rounded-md">{normalizedSymptoms}</p>
          </CardContent>
        </Card>
      )}

      {diagnosisResult && !isLoading && (
        <>
          <Card className="shadow-xl animate-in fade-in-50 duration-700">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><ShieldAlert className="mr-2 h-7 w-7 text-primary" /> Diagnostic Insights</CardTitle>
              <CardDescription>Based on your symptoms, here are some potential insights. This is for informational purposes only.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center"><AlertCircle className="mr-2 h-5 w-5 text-primary" /> Urgency Level:</h3>
                <UrgencyIndicator urgency={diagnosisResult.urgency} />
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center"><ClipboardList className="mr-2 h-5 w-5 text-primary" /> Potential Conditions:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  {diagnosisResult.potentialConditions.map((condition, index) => (
                    <li key={index} className="text-base">{condition}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center"><FlaskConical className="mr-2 h-5 w-5 text-primary" /> Recommended Tests:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                  {diagnosisResult.recommendedTests.map((test, index) => (
                    <li key={index} className="text-base">{test}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <NextStepsRecommendations result={diagnosisResult} normalizedSymptomsText={normalizedSymptoms} />
        </>
      )}
      
      {showAppointmentScheduler && diagnosisResult && !isLoading && (
         <Card className="shadow-xl animate-in fade-in-50 duration-1000">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><CalendarClock className="mr-2 h-7 w-7 text-primary" /> Schedule Follow-up</CardTitle>
            <CardDescription>If you'd like to discuss these results, you can schedule a mock appointment.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0 w-full md:w-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow-sm mx-auto md:mx-0"
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))} 
              />
            </div>
            <div className="flex-grow w-full">
              <h4 className="font-semibold mb-3 text-lg">Select a time slot for {selectedDate?.toLocaleDateString()}:</h4>
              {selectedDate ? (
                <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableTimes.map(time => (
                    <Label 
                      key={time} 
                      htmlFor={`time-${time}`} 
                      className={cn(
                        "flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground",
                        selectedTime === time && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      <RadioGroupItem value={time} id={`time-${time}`} className="sr-only" />
                      {time}
                    </Label>
                  ))}
                </RadioGroup>
              ) : <p className="text-muted-foreground">Please select a date first.</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleScheduleAppointment} disabled={!selectedDate || !selectedTime} size="lg" className="text-base px-8 py-6 shadow-md hover:shadow-lg transition-shadow">
              <CalendarClock className="mr-2 h-5 w-5" />
              Book Appointment
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


    