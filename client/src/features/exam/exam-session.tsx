import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';

import Button from '@/shared/components/ui/button';
import { colors } from '@/styles/theme';
import { Question } from '@/shared/ts/types';

import ExamQuestions from './exam-questions';

export default function ExamSession() {
  const { connectionCode } = useParams<{
    connectionCode: string;
  }>();

  const [status, setStatus] = useState<string>('Connecting...');
  const [logs, setLogs] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [joined, setJoined] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState(0);

  const fullNameRef = useRef<HTMLInputElement>(null);

  const socketUrl =
    process.env.NODE_ENV === 'production'
      ? `ws://examiaai-production.up.railway.app`
      : `ws://localhost:7676`;

  useEffect(() => {
    const socket = new WebSocket(
      `${socketUrl}/ws/session/${connectionCode}`
    );

    socket.onopen = () => {
      setStatus('Connected');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const log = JSON.parse(event.data);

      if (log.message) {
        setLogs((prev) => [...prev, log.message]);
      }

      if (log.questions) {
        setQuestions(log.questions);
      }

      if (log.duration) {
        setDuration(log.duration);
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
      ws.send(
        JSON.stringify({
          type: 'join',
          fullName,
        })
      );
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
          logs.some((arr) => arr.includes('The exam has started!')) &&
          duration !== 0 ? (
            <ExamQuestions
              questions={questions}
              duration={duration}
              ws={ws as WebSocket}
            />
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
            <Button onClick={joinSession}>Join exam session</Button>
          </div>
        ))}
      <div className="text-center">
        {logs.slice(-3).map((log, index) => (
          <p key={index} className={`${colors.text.muted}`}>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
