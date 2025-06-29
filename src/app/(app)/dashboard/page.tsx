
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { HealthRecord, Appointment } from '@/types';
import { BrainCircuit, Loader2, BarChart2, User, ShieldCheck, Tag, Table, AlertTriangle, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for localStorage keys
const HEALTH_RECORDS_KEY = 'healthflow_health_records';
const APPOINTMENTS_KEY = 'healthflow_appointments';

const UserProfileCard = ({ user, onDeleteAccount, isDeleting }: any) => (
  <Card className="shadow-card">
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src="https://placehold.co/100x100.png" data-ai-hint="person portrait"/>
        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle className="text-xl">{user?.email}</CardTitle>
        <CardDescription>Patient Profile</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
       <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isDeleting} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" /> {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="shadow-modal">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account data from this prototype's local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteAccount} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        This is a prototype. Deleting your account only removes it from this browser's storage.
      </p>
    </CardContent>
  </Card>
);

const HealthConditionsCard = () => (
    <Card className="shadow-card">
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><Tag className="mr-2 h-5 w-5 text-primary" />Health Conditions</CardTitle>
            <CardDescription>Based on your health history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary">Hypertension</Badge>
            <Badge variant="secondary">Allergies</Badge>
            <Badge variant="secondary">Asthma</Badge>
            <Badge variant="outline">Common Cold</Badge>
        </CardContent>
    </Card>
);

const ProgressChartCard = () => (
    <Card className="shadow-card">
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Symptom Frequency</CardTitle>
            <CardDescription>Trends over the last month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-1">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Headaches</span>
                    <span className="text-sm text-muted-foreground">8 days</span>
                </div>
                <Progress value={27} />
            </div>
            <div className="space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fatigue</span>
                    <span className="text-sm text-muted-foreground">14 days</span>
                </div>
                <Progress value={47} />
            </div>
            <div className="space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cough</span>
                    <span className="text-sm text-muted-foreground">3 days</span>
                </div>
                <Progress value={10} />
            </div>
        </CardContent>
    </Card>
);

const WeeklyOverviewCard = ({ appointments }: { appointments: Appointment[] }) => (
    <Card className="shadow-card">
        <CardHeader>
            <CardTitle className="text-xl flex items-center"><Table className="mr-2 h-5 w-5 text-primary" />Weekly Overview</CardTitle>
            <CardDescription>Your upcoming appointments</CardDescription>
        </CardHeader>
        <CardContent>
            {appointments.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No upcoming appointments.</p>
                     <Button asChild size="sm" className="mt-4">
                        <Link href="/analyze">Analyze Symptoms</Link>
                    </Button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Reason</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.slice(0, 4).map(apt => (
                                <TableRow key={apt.id}>
                                    <TableCell>{apt.date}</TableCell>
                                    <TableCell>{apt.time}</TableCell>
                                    <TableCell>{apt.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
    </Card>
);


export default function DashboardPage() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { deleteAccount: authDeleteAccount, currentUser } = useAuth();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem(HEALTH_RECORDS_KEY);
      if (storedRecords) setHealthRecords(JSON.parse(storedRecords));
      const storedAppointments = localStorage.getItem(APPOINTMENTS_KEY);
      if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    }
  }, [currentUser]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await authDeleteAccount();
    if (result.success) {
      toast({
        title: "Account Deleted",
        description: "Your account and associated data have been removed.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: result.message || "Could not delete your account.",
      });
    }
    setIsDeleting(false);
  };

  const handleGenerateSummary = async () => {
    if (healthRecords.length === 0) {
      setSummaryError("You have no health records to summarize.");
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
      setSummaryError("Failed to generate AI summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {currentUser?.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="shadow-card">
              <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                      <BrainCircuit className="mr-2 h-5 w-5 text-primary" /> AI Health Summary
                  </CardTitle>
                  <CardDescription>A concise, AI-powered summary of your health history.</CardDescription>
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
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap p-4 bg-muted/50 rounded-md">{summary}</div>
                  ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed rounded-lg">
                          <p className="text-muted-foreground mb-4">Click to generate an intelligent summary of your records.</p>
                          <Button onClick={handleGenerateSummary} disabled={healthRecords.length === 0}>
                              <BrainCircuit className="mr-2 h-4 w-4" /> Generate Summary
                          </Button>
                      </div>
                  )}
              </CardContent>
            </Card>
            <WeeklyOverviewCard appointments={appointments} />
            <ProgressChartCard />
        </div>

        <div className="lg:col-span-1 space-y-6">
            <UserProfileCard user={currentUser} onDeleteAccount={handleDeleteAccount} isDeleting={isDeleting} />
            <HealthConditionsCard />
        </div>
      </div>
    </div>
  );
}
