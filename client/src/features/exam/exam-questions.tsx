import { useEffect, useState, useRef } from 'react';

import { colors } from '@/styles/theme';
import { Question } from '@/shared/ts/types';
import Button from '@/shared/components/ui/button';

type Answers = {
  question: string;
  answer: string;
  correct: boolean;
};

export default function ExamQuestions({
  questions,
  duration,
  ws,
}: {
  questions: Question[];
  duration: number;
  ws: WebSocket;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  const isSubmitted = useRef(false); //Use as a flag to handle submits

  const currentQuestion = questions[currentQuestionIndex] as Question;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          console.log('Time is up! Submitting answers...');
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  const handleAnswerSubmit = (selectedAnswer: string) => {
    const trimAnswer = selectedAnswer.trim();
    const isAnswerCorrect = trimAnswer === currentQuestion.answer.trim();

    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: currentQuestion.question,
        answer: trimAnswer,
        correct: isAnswerCorrect,
      },
    ]);

    if (isAnswerCorrect) setScore(score + 1);

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    if (isSubmitted.current) return;
    isSubmitted.current = true;

    console.log('Submitted Answers:', answers, 'Score:', score);
    if (timeLeft > 0) {
      setTimeLeft(0);
    }

    ws.send(
      JSON.stringify({
        type: 'submit',
        score,
      })
    );
  };

  return (
    <div
      className={`rounded-lg ${colors.background.main} ${colors.text.primary}`}
    >
      <header className={`mb-4 border-b pb-2 ${colors.border}`}>
        {timeLeft <= 0 ? (
          <p className={`${colors.text.secondary} text-center`}>
            Congratulations(?) your score is {score} out of{' '}
            {questions.length}
          </p>
        ) : (
          <>
            <p className={`${colors.text.secondary} text-center`}>
              Answer the questions below carefully.
            </p>
            <p className={`${colors.text.secondary} text-center`}>
              Time left: {timeLeft} seconds
            </p>
          </>
        )}
      </header>

      <section>
        {timeLeft > 0 && currentQuestion ? (
          <div
            className={`mb-4 rounded-lg p-4 ${colors.background.secondary}`}
          >
            <h2 className={`text-lg font-semibold ${colors.text.primary}`}>
              {`Question ${currentQuestionIndex + 1}`}
            </h2>
            <p
              className={`${colors.text.muted} border-b-2 border-slate-700 pb-2`}
            >
              {currentQuestion.question}
            </p>

            <div className="mt-4">
              {currentQuestion.answers.split(',').map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSubmit(answer)}
                  className={`mb-2 block w-full rounded-md px-4 py-2 text-left ${colors.background.tertiary} ${colors.text.primary} hover:bg-slate-700/50`}
                >
                  {answer.trim()}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className={`${colors.text.secondary} text-center`}>
            No more questions available.
          </p>
        )}
        {timeLeft <= 0 && (
          <>
            <p className={`${colors.text.secondary} text-center`}>
              The quiz has ended
            </p>
            <div className="space-y-4 py-4">
              {answers.map((a, index) => (
                <div
                  key={index}
                  className={`rounded-lg ${colors.background.secondary} p-4 shadow-md`}
                >
                  <h3
                    className={`text-md mb-2 font-semibold ${colors.text.primary}`}
                  >
                    {a.question}
                  </h3>
                  <p
                    className={`${a.correct ? colors.text.success : colors.text.danger} text-sm`}
                  >
                    Answer: {a.answer}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <footer className={`mt-4 border-t pt-4 ${colors.border}`}>
        {!currentQuestion && (
          <Button
            onClick={handleSubmit}
            className={`rounded-md px-4 py-2 font-medium ${colors.primary.main} ${colors.text.primary} float-right`}
            disabled={timeLeft <= 0}
          >
            Submit Answers
          </Button>
        )}
      </footer>
    </div>
  );
}
