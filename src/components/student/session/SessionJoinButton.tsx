
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SessionJoinButtonProps {
  sessionStartTime: string | Date;
  sessionEndTime?: string | Date;
  meetingLink?: string;
  onJoin: () => void;
}

export const SessionJoinButton: React.FC<SessionJoinButtonProps> = ({
  sessionStartTime,
  sessionEndTime,
  meetingLink,
  onJoin
}) => {
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntilJoin, setTimeUntilJoin] = useState<string>('');

  useEffect(() => {
    const checkJoinAvailability = () => {
      const now = new Date();
      const sessionStart = new Date(sessionStartTime);
      const sessionEnd = sessionEndTime ? new Date(sessionEndTime) : new Date(sessionStart.getTime() + 60 * 60 * 1000); // Default 1 hour if no end time
      const joinTimeWindow = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 minutes before

      // Can join if it's 15 minutes before session start OR during the session (between start and end time)
      if (now >= joinTimeWindow && now <= sessionEnd) {
        setCanJoin(true);
        setTimeUntilJoin('');
      } else if (now < joinTimeWindow) {
        setCanJoin(false);
        const diff = joinTimeWindow.getTime() - now.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilJoin(`${minutes}m ${seconds}s`);
      } else {
        // Session has ended
        setCanJoin(false);
        setTimeUntilJoin('');
      }
    };

    // Check immediately
    checkJoinAvailability();

    // Set up interval to check every second
    const interval = setInterval(checkJoinAvailability, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime, sessionEndTime]);

  const handleJoinClick = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
    onJoin();
  };

  const now = new Date();
  const sessionStart = new Date(sessionStartTime);
  const sessionEnd = sessionEndTime ? new Date(sessionEndTime) : new Date(sessionStart.getTime() + 60 * 60 * 1000);

  // If session has ended, show "Session Ended" button
  if (now > sessionEnd) {
    return (
      <Button disabled className="w-full">
        Session Ended
      </Button>
    );
  }

  // If session is currently active (between start and end time)
  if (now >= sessionStart && now <= sessionEnd) {
    return (
      <Button onClick={handleJoinClick} className="w-full bg-green-600 hover:bg-green-700">
        Join Now (Live)
      </Button>
    );
  }

  // If we can't join yet (more than 15 minutes before)
  if (!canJoin && timeUntilJoin) {
    return (
      <Button disabled className="w-full">
        <Clock className="h-4 w-4 mr-2" />
        Join available in {timeUntilJoin}
      </Button>
    );
  }

  // If we can join (15 minutes before session starts)
  return (
    <Button onClick={handleJoinClick} className="w-full">
      Join Session
    </Button>
  );
};
