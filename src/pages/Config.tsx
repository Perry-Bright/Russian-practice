import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context';
import { Play } from 'lucide-react';

export default function Config() {
  const [searchParams] = useSearchParams();
  const isWrongMode = searchParams.get('mode') === 'wrong';
  const navigate = useNavigate();
  const { history, questions } = useAppContext();

  const [questionCount, setQuestionCount] = useState<number>(25);
  const [duration, setDuration] = useState<number>(30 * 60); // seconds

  const wrongQuestionIds = new Set<number>();
  history.forEach(result => {
    result.answers.forEach(a => {
      if (!a.isCorrect) wrongQuestionIds.add(a.questionId);
    });
  });

  const handleStart = () => {
    navigate('/test', {
      state: {
        questionCount: questionCount === 0 ? questions.length : questionCount,
        duration,
        isWrongMode
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors p-6 md:p-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {isWrongMode ? 'Работа над ошибками' : 'Настройка нового теста'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
          {isWrongMode 
            ? `У вас ${wrongQuestionIds.size} нерешенных вопросов из прошлых тестов.`
            : 'Выберите параметры экзамена перед началом.'}
        </p>

        <div className="space-y-8">
          {!isWrongMode && (
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">Количество вопросов</label>
              <div className="flex flex-wrap gap-3">
                {[25, 50, 100, 0].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-2 border-[1.5px] rounded-full text-sm font-medium transition-colors ${questionCount === count ? 'border-blue-600 text-blue-600 bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/30' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:bg-slate-900'}`}
                  >
                    {count === 0 ? 'Без лимита' : count}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">Время экзамена</label>
            <div className="flex flex-wrap gap-3">
              {[30 * 60, 60 * 60, 90 * 60, 120 * 60, 0].map(time => (
                <button
                  key={time}
                  onClick={() => setDuration(time)}
                  className={`px-4 py-2 border-[1.5px] rounded-full text-sm font-medium transition-colors ${duration === time ? 'border-blue-600 text-blue-600 bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:bg-blue-900/30' : 'border-slate-200 text-slate-500 hover:border-slate-300 bg-white dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:bg-slate-900'}`}
                >
                  {time === 0 ? 'Без таймера' : `${time / 60} мин`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStart}
            disabled={isWrongMode && wrongQuestionIds.size === 0}
            className="w-full sm:w-auto bg-blue-600 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Начать тестирование
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto border border-slate-200 rounded-lg text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors px-6 py-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
