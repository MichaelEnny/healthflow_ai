
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { HealthRecord, Appointment } from '@/types';
import { CalendarDays, History, ListChecks, ShieldAlert, FlaskConical, Edit3, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data for localStorage keys
const HEALTH_RECORDS_KEY = 'healthflow_health_records';
const APPOINTMENTS_KEY = 'healthflow_appointments';

export default function DashboardPage() {
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures localStorage is accessed only on client
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
  }, []);

  if (!isClient) {
    return <div className="flex justify-center items-center h-64"><p>Loading dashboard data...</p></div>; // Or a Skeleton loader
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Health Dashboard</h1>
        <Button asChild>
          <Link href="/analyze">
            <Edit3 className="mr-2 h-4 w-4" /> New Symptom Analysis
          </Link>
        </Button>
      </div>

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
                    <Card key={record.id} className="bg-secondary/30">
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
                    <div key={apt.id} className="p-4 border rounded-md bg-secondary/30">
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
    </div>
  );
}

    