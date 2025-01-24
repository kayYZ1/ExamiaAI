import { useEffect, useState } from 'react';

import { colors } from '@/styles/theme';
import { Question } from '@/shared/ts/types';

export default function ExamQuestions({
  questions,
  duration,
}: {
  questions: Question[];
  duration: number;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);

  const currentQuestion = questions[currentQuestionIndex] as Question;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) =>
        prevTime < 0 ? duration : prevTime - 1000
      );
    }, 1000);

    if (timeLeft === 0) {
      console.log('Time is up! Submitting answers...');
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [duration]);

  const handleAnswerSubmit = (selectedAnswer: string) => {
    const trimAnswer = selectedAnswer.trim();
    setAnswers({
      ...answers,
      [currentQuestion.question]: trimAnswer,
    });
    if (trimAnswer === currentQuestion.answer.trim()) {
      setScore(score + 1);
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div
      className={`rounded-lg ${colors.background.main} ${colors.text.primary}`}
    >
      <header className={`mb-4 border-b pb-2 ${colors.border}`}>
        <p className={`${colors.text.secondary} text-center`}>
          Answer the questions below carefully.
        </p>
        <p className={`${colors.text.secondary} text-center`}>
          Time left: {timeLeft} seconds
        </p>
      </header>

      <section>
        {currentQuestion ? (
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
      </section>

      <footer className={`mt-4 border-t pt-4 ${colors.border}`}>
        {!currentQuestion && (
          <button
            onClick={() =>
              console.log('Submitted Answers:', answers, 'Score:', score)
            }
            className={`rounded-md px-4 py-2 font-medium ${colors.primary.main} ${colors.text.primary} float-right`}
          >
            Submit Answers
          </button>
        )}
      </footer>
    </div>
  );
}
