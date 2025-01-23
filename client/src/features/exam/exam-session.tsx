import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';

import Button from '@/shared/components/ui/button';
import { colors } from '@/styles/theme';

export default function ExamSession() {
  const { connectionCode } = useParams<{ connectionCode: string }>();

  const [status, setStatus] = useState<string>('Connecting...');
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<number>(0);

  const fullNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:7676/ws/session/${connectionCode}`
    );

    socket.onopen = () => {
      setStatus('Connected');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.message) {
        setMessages((prev) => [...prev, message.message]);
      }

      if (message.participants) {
        setParticipants(message.participants);
      }
    };

    socket.onclose = () => {
      setStatus('Disconnected');
      setWs(null);
    };

    socket.onerror = () => {
      setStatus('Error occurred');
    };

    return () => {
      socket.close();
    };
  }, [connectionCode]);

  const joinSession = () => {
    const fullName = fullNameRef.current?.value?.trim()!;
    if (ws && fullName.trim()) {
      ws.send(fullName); // Send full name to the server
      setJoined(true);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${colors.text.primary} gap-4`}
    >
      <p className="text-2xl font-semibold">Exam {connectionCode}</p>
      <p>Status: {status}</p>

      {status === 'Connected' &&
        (joined ? (
          participants === 2 ? (
            <p>Exam has started</p>
          ) : (
            <p>Waiting for other participants to join</p>
          )
        ) : (
          <div className="flex flex-col items-center gap-4">
            <p>Enter your full name to join the session</p>
            <input
              type="text"
              placeholder="Enter your full name"
              ref={fullNameRef}
              className={`w-full rounded-lg border p-4 ${colors.background.main} ${colors.text.muted} ${colors.border} focus:outline-none focus:ring-2 focus:ring-indigo-900`}
            />
            <Button onClick={joinSession}>Join Session</Button>
          </div>
        ))}

      <p className={`${colors.text.muted}`}>
        {messages[messages.length - 1]}
      </p>
    </div>
  );
}
