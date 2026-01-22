import React, { useState } from 'react';
import { useEvents } from '@/contexts/EventContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Clock, Check, X, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/types';
import { useToast } from '@/hooks/use-toast';

const DepartmentDashboard: React.FC = () => {
  const { events, approveEvent, rejectEvent } = useEvents();
  const { toast } = useToast();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [feedback, setFeedback] = useState('');

  const pendingEvents = events.filter(e => e.status === 'pending_approval');
  const approvedEvents = events.filter(e => e.status === 'approved' || e.status === 'venue_selected');

  const handleApprove = (event: Event) => {
    approveEvent(event.id);
    toast({ title: 'Event Approved!', description: `${event.name} has been approved.` });
  };

  const handleReject = () => {
    if (!selectedEvent) return;
    rejectEvent(selectedEvent.id, feedback);
    toast({ title: 'Event Rejected', description: 'Feedback sent to the club.' });
    setShowRejectDialog(false);
    setSelectedEvent(null);
    setFeedback('');
  };

  const EventRow = ({ event, showActions = true }: { event: Event; showActions?: boolean }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-lg">{event.name}</h4>
            <Badge variant="outline">{event.clubName}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{format(new Date(event.date), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.expectedParticipants} expected</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{event.participants.length} registered</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}><Eye className="w-4 h-4" /></Button>
          {showActions && event.status === 'pending_approval' && (
            <>
              <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => handleApprove(event)}><Check className="w-4 h-4" /></Button>
              <Button size="sm" variant="destructive" onClick={() => { setSelectedEvent(event); setShowRejectDialog(true); }}><X className="w-4 h-4" /></Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
          <Card className="stat-card"><p className="text-3xl font-bold text-warning">{pendingEvents.length}</p><p className="text-muted-foreground">Pending Approval</p></Card>
          <Card className="stat-card"><p className="text-3xl font-bold text-success">{approvedEvents.length}</p><p className="text-muted-foreground">Approved Events</p></Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList><TabsTrigger value="pending">Pending ({pendingEvents.length})</TabsTrigger><TabsTrigger value="approved">Approved ({approvedEvents.length})</TabsTrigger></TabsList>
          <TabsContent value="pending" className="space-y-4 mt-4">
            {pendingEvents.length > 0 ? pendingEvents.map(e => <EventRow key={e.id} event={e} />) : <Card className="p-8 text-center"><p className="text-muted-foreground">No pending events.</p></Card>}
          </TabsContent>
          <TabsContent value="approved" className="space-y-4 mt-4">
            {approvedEvents.length > 0 ? approvedEvents.map(e => <EventRow key={e.id} event={e} showActions={false} />) : <Card className="p-8 text-center"><p className="text-muted-foreground">No approved events.</p></Card>}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedEvent && !showRejectDialog} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedEvent && (
            <>
              <DialogHeader><DialogTitle>{selectedEvent.name}</DialogTitle><DialogDescription>{selectedEvent.clubName}</DialogDescription></DialogHeader>
              <div className="space-y-4">
                <p>{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Date:</strong> {format(new Date(selectedEvent.date), 'MMMM d, yyyy')}</div>
                  <div><strong>Expected:</strong> {selectedEvent.expectedParticipants}</div>
                  {selectedEvent.guestName && <div className="col-span-2"><strong>Guest:</strong> {selectedEvent.guestName}</div>}
                </div>
                <div><h4 className="font-semibold">Participants ({selectedEvent.participants.length})</h4>
                  {selectedEvent.participants.length > 0 ? <div className="max-h-40 overflow-y-auto space-y-1 mt-2">{selectedEvent.participants.map((p,i) => <div key={p.id} className="text-sm p-2 bg-muted rounded">{i+1}. {p.studentName} ({p.studentUid}) - {p.studentEmail}</div>)}</div> : <p className="text-sm text-muted-foreground">No registrations yet.</p>}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Event</DialogTitle><DialogDescription>Provide feedback for {selectedEvent?.name}</DialogDescription></DialogHeader>
          <Textarea placeholder="Enter feedback for the club..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={4} />
          <Button variant="destructive" onClick={handleReject}>Reject with Feedback</Button>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DepartmentDashboard;