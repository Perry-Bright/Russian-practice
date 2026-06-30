import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context';
import { CheckCircle2, XCircle, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

// For a personal project, you can hardcode your key here or use an environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyA3hJH_dv5O8CjtvvDUQQv8xLHHFcHvZjU";

export default function Review() {
  const { resultId } = useParams();
  const { history, questions } = useAppContext();

  const result = history.find(r => r.id === resultId);

  if (!result) return <div className="text-center py-20">Result not found.</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 mb-8 font-medium transition-colors">
        <ArrowLeft size={18} />
        Назад на главную
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors p-6 sm:p-8 md:p-12 mb-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 text-slate-900 dark:text-slate-100">Результаты теста</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Изучите свои результаты и ошибки.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">{result.score}%</div>
            <div className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Финальный счет</div>
          </div>
          <div className="p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">{result.correctAnswers}</div>
            <div className="text-[10px] sm:text-xs font-semibold text-green-700 dark:text-green-500 uppercase tracking-wider">Верно</div>
          </div>
          <div className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-bold text-red-600 dark:text-red-400 mb-1">{result.incorrectAnswers}</div>
            <div className="text-[10px] sm:text-xs font-semibold text-red-700 dark:text-red-500 uppercase tracking-wider">Ошибки</div>
          </div>
          <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{result.totalQuestions}</div>
            <div className="text-[10px] sm:text-xs font-semibold text-blue-700 dark:text-blue-500 uppercase tracking-wider">Всего</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight px-2 text-slate-900 dark:text-slate-100">Детальный разбор</h2>
        {result.answers.map((ans, idx) => {
          const q = questions.find(q => q.id === ans.questionId);
          if (!q) return null;
          return <ReviewItem key={idx} question={q} answer={ans} index={idx + 1} />;
        })}
      </div>
    </div>
  );
}

function ReviewItem({ question, answer, index }: { question: any, answer: any, index: number }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!answer.isCorrect);

  const fetchExplanation = async () => {
    if (explanation || answer.isCorrect) return;

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      
      const prompt = `
You are a helpful Russian language tutor. 
A student answered a multiple-choice question incorrectly.
Question: "${question.text}"
Options: ${question.options.join(', ')}
Correct Answer: "${question.options[question.correctAnswer]}"
Student's Answer: "${answer.selectedAnswerIndex !== null ? question.options[answer.selectedAnswerIndex] : 'No answer selected'}"

Provide a concise explanation in a mix of simple Russian and English (to help an English-speaking learner of Russian) of why "${question.options[question.correctAnswer]}" is correct and why "${answer.selectedAnswerIndex !== null ? question.options[answer.selectedAnswerIndex] : 'No answer selected'}" is wrong. 
The explanation must be based ONLY on the official correct answer. Keep it under 3 sentences.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      if (response.text) setExplanation(response.text);
    } catch (e: any) {
      console.error(e);
      setExplanation(`Не удалось сгенерировать объяснение. Ошибка: ${e.message || 'Неизвестная ошибка'}. Проверьте ваш API ключ и консоль разработчика.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors overflow-hidden ${answer.isCorrect ? '' : 'border-red-200 dark:border-red-900/50'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex gap-3 sm:gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="mt-1 flex-shrink-0">
          {answer.isCorrect ? <CheckCircle2 className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
        </div>
        <div className="flex-1">
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 sm:mb-2">Вопрос {index}</div>
          <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed mb-3 sm:mb-4">{question.text}</div>
          <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Ваш ответ</div>
              <div className={`text-sm sm:text-base font-medium ${answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {answer.selectedAnswerIndex !== null ? question.options[answer.selectedAnswerIndex] : '—'}
              </div>
            </div>
            {!answer.isCorrect && (
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Верный ответ</div>
                <div className="text-sm sm:text-base font-medium text-green-600 dark:text-green-400">{question.options[question.correctAnswer]}</div>
              </div>
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {!answer.isCorrect && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
          >
            <div className="p-4 sm:p-6 pt-3 sm:pt-4">
              {!explanation && !loading ? (
                <button 
                  onClick={fetchExplanation}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-5 py-2.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Sparkles size={16} />
                  Сгенерировать объяснение ИИ
                </button>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-blue-100 dark:border-blue-900/50 p-4 sm:p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    <Sparkles size={16} className="text-blue-500" />
                    AI Объяснение
                  </h4>
                  {loading ? (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-2 text-sm font-medium">
                      <Loader2 size={16} className="animate-spin" />
                      Анализ...
                    </div>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{explanation}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
