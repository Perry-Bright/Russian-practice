import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { Question } from '../types';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Test() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { questions, history, saveResult } = useAppContext();

  // Validate state
  useEffect(() => {
    if (!state) navigate('/');
  }, [state, navigate]);

  const { questionCount, duration, isWrongMode } = state || { questionCount: 25, duration: 1800, isWrongMode: false };

  const testQuestions = useMemo(() => {
    let pool = [...questions];
    if (isWrongMode) {
      const wrongIds = new Set<number>();
      history.forEach(result => {
        result.answers.forEach(a => {
          if (!a.isCorrect) wrongIds.add(a.questionId);
        });
      });
      pool = pool.filter(q => wrongIds.has(q.id));
    }

    // Shuffle and pick
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool.slice(0, questionCount === 0 ? pool.length : questionCount);
  }, [questions, history, isWrongMode, questionCount]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  useEffect(() => {
    if (duration === 0) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, duration]);

  const currentQ = testQuestions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optionIndex }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const testResultAnswers = testQuestions.map(q => {
      const selected = answers[q.id] ?? null;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        selectedAnswerIndex: selected,
        isCorrect
      };
    });

    const result = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      duration,
      timeSpent: duration === 0 ? 0 : duration - timeLeft,
      totalQuestions: testQuestions.length,
      correctAnswers: correct,
      incorrectAnswers: testQuestions.length - correct,
      score: Math.round((correct / testQuestions.length) * 100),
      answers: testResultAnswers
    };

    saveResult(result);
    navigate(`/review/${result.id}`);
  };

  if (!currentQ) return <div className="text-center py-20">Loading test...</div>;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
          Вопрос {currentIndex + 1} из {testQuestions.length}
        </div>
        {duration > 0 && (
          <div className={`flex items-center gap-2 font-mono text-lg font-medium px-4 py-2 rounded-full ${timeLeft < 300 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors p-6 md:p-12 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQ.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-10 leading-relaxed text-slate-900 dark:text-white">
              {currentQ.text}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {currentQ.options.map((opt, i) => {
                const isSelected = answers[currentQ.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-50' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-medium">{opt}</span>
                    <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                    }`}>
                      {isSelected && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 sm:mt-12 flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Назад</span>
          </button>

          {currentIndex === testQuestions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 px-8 py-3 flex items-center gap-2"
            >
              Завершить
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="border border-slate-200 rounded-lg text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors px-6 py-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 hidden sm:flex items-center gap-2"
              >
                Завершить
              </button>
              <button
                onClick={() => setCurrentIndex(i => Math.min(testQuestions.length - 1, i + 1))}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm"
              >
                Далее
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
