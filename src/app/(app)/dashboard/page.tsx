
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { HealthRecord, Appointment } from '@/types';
import { CalendarDays, History, ListChecks, ShieldAlert, FlaskConical, Edit3, Clock, Trash2, AlertTriangle, BrainCircuit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { summarizeHealthHistory } from '@/ai/flows/summarize-health-history';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data for localStorage keys
const HEALTH_RECORDS_KEY = 'healthflow_health_records';
const APPOINTMENTS_KEY = 'healthflow_appointments';

export default function DashboardPage() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { deleteAccount: authDeleteAccount, currentUser } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // State for AI Summary
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true); 
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem(HEALTH_RECORDS_KEY);
      if (storedRecords) {
        setHealthRecords(JSON.parse(storedRecords));
      }
      const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    }
  }, [currentUser]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await authDeleteAccount();
    if (result.success) {
      toast({
        title: "Account Deleted",
        description: "Your account and associated data have been removed from this prototype.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: result.message || "Could not delete your account. Please try again.",
      });
    }
    setIsDeleting(false);
  };

  const handleGenerateSummary = async () => {
    if (healthRecords.length === 0) {
      setSummaryError("You have no health records to summarize. Start by analyzing your symptoms.");
      return;
    }
    setIsSummarizing(true);
    setSummary(null);
    setSummaryError(null);
    try {
      const historyString = JSON.stringify(healthRecords);
      const result = await summarizeHealthHistory({ healthHistory: historyString });
      setSummary(result.summary);
    } catch (error) {
      console.error("Error generating health summary:", error);
      setSummaryError("Failed to generate AI summary. Please try again later.");
    } finally {
      setIsSummarizing(false);
    }
  };


  if (!isClient) {
    return <div className="flex justify-center items-center h-64"><p>Loading dashboard data...</p></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Health Dashboard</h1>
            {currentUser && <p className="text-muted-foreground">Welcome, {currentUser.email}</p>}
        </div>
        <Button asChild>
          <Link href="/analyze">
            <Edit3 className="mr-2 h-4 w-4" /> New Symptom Analysis
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl flex items-center">
                <BrainCircuit className="mr-2 h-6 w-6 text-primary" /> AI Health Summary
            </CardTitle>
            <CardDescription>Get a concise, AI-powered summary of your entire health history to spot trends.</CardDescription>
        </CardHeader>
        <CardContent>
            {isSummarizing ? (
                <div className="flex items-center justify-center min-h-[100px] flex-col">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-muted-foreground">Analyzing your history...</p>
                </div>
            ) : summaryError ? (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{summaryError}</AlertDescription>
                </Alert>
            ) : summary ? (
                <div className="text-sm text-muted-foreground whitespace-pre-wrap p-4 bg-secondary/30 rounded-md">{summary}</div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">Click the button to generate an intelligent summary of your health records.</p>
                    <Button onClick={handleGenerateSummary} disabled={healthRecords.length === 0}>
                        <BrainCircuit className="mr-2 h-4 w-4" /> Generate AI Summary
                    </Button>
                     {healthRecords.length === 0 && <p className="text-xs text-muted-foreground mt-2">You have no records to summarize yet.</p>}
                </div>
            )}
        </CardContent>
      </Card>


      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <History className="mr-2 h-6 w-6 text-primary" /> Health History
            </CardTitle>
            <CardDescription>Review your past symptom analyses and diagnoses.</CardDescription>
          </CardHeader>
          <CardContent>
            {healthRecords.length === 0 ? (
              <p className="text-muted-foreground">No health records found. Start by analyzing your symptoms.</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {healthRecords.map((record) => (
                    <Card key={record.id} className="bg-secondary/30 shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">Analysis on {record.date}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <p className="font-semibold">Symptoms Reported:</p>
                          <p className="text-muted-foreground truncate">{record.symptoms}</p>
                        </div>
                        {record.normalizedSymptoms && (
                           <div>
                             <p className="font-semibold">Normalized Symptoms:</p>
                             <p className="text-muted-foreground italic truncate">{record.normalizedSymptoms}</p>
                           </div>
                        )}
                        <div>
                          <p className="font-semibold flex items-center"><ListChecks className="mr-1 h-4 w-4" /> Potential Conditions:</p>
                          <ul className="list-disc list-inside ml-4 text-muted-foreground">
                            {record.potentialConditions.map(c => <li key={c}>{c}</li>)}
                          </ul>
                        </div>
                        <div className="flex items-center">
                           <p className="font-semibold flex items-center mr-2"><ShieldAlert className="mr-1 h-4 w-4" /> Urgency:</p> 
                           <span className="font-bold">{record.urgency}</span>
                        </div>
                         <div>
                           <p className="font-semibold flex items-center"><FlaskConical className="mr-1 h-4 w-4" /> Recommended Tests:</p>
                           <ul className="list-disc list-inside ml-4 text-muted-foreground">
                            {record.recommendedTests.map(t => <li key={t}>{t}</li>)}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <CalendarDays className="mr-2 h-6 w-6 text-primary" /> Upcoming Appointments
            </CardTitle>
            <CardDescription>Manage your scheduled appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground">No upcoming appointments. You can schedule one after a symptom analysis.</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {appointments.map((apt) => (
                    <div key={apt.id} className="p-4 border rounded-md bg-secondary/30 shadow-sm hover:shadow-md transition-shadow">
                      <p className="font-semibold text-md">
                        {format(new Date(apt.date), "MMMM d, yyyy")} at {apt.time}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center"><Clock className="mr-1 h-3 w-3" /> For: {apt.reason}</p>
                      {apt.doctor && <p className="text-sm text-muted-foreground">With: {apt.doctor}</p>}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Manage your account preferences and data.</p>
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete My Account"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account data from this prototype's local storage.
                  In a real application, this would involve permanent data deletion according to privacy regulations.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                  {isDeleting ? "Deleting..." : "Yes, delete my account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Account deletion in this prototype removes your data from the browser's local storage.
            A production system would have robust, compliant data deletion processes.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
