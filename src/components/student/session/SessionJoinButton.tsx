
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SessionJoinButtonProps {
  sessionStartTime: string | Date;
  meetingLink?: string;
  onJoin: () => void;
}

export const SessionJoinButton: React.FC<SessionJoinButtonProps> = ({
  sessionStartTime,
  meetingLink,
  onJoin
}) => {
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntilJoin, setTimeUntilJoin] = useState<string>('');

  useEffect(() => {
    const checkJoinAvailability = () => {
      const now = new Date();
      const sessionStart = new Date(sessionStartTime);
      const joinTimeWindow = new Date(sessionStart.getTime() - 15 * 60 * 1000); // 15 minutes before

      if (now >= joinTimeWindow) {
        setCanJoin(true);
        setTimeUntilJoin('');
      } else {
        setCanJoin(false);
        const diff = joinTimeWindow.getTime() - now.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeUntilJoin(`${minutes}m ${seconds}s`);
      }
    };

    // Check immediately
    checkJoinAvailability();

    // Set up interval to check every second
    const interval = setInterval(checkJoinAvailability, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleJoinClick = () => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
    onJoin();
  };

  if (!canJoin) {
    return (
      <Button disabled className="w-full">
        <Clock className="h-4 w-4 mr-2" />
        Join available in {timeUntilJoin}
      </Button>
    );
  }

  return (
    <Button onClick={handleJoinClick} className="w-full">
      Join Session
    </Button>
  );
};
