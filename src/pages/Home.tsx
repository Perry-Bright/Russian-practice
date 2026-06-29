import { Link } from 'react-router-dom';
import { useAppContext } from '../context';
import { format } from 'date-fns';
import { FileQuestion, Clock, Trophy, Target, AlertTriangle } from 'lucide-react';

export default function Home() {
  const { history, questions } = useAppContext();

  const totalTests = history.length;
  const averageScore = totalTests > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / totalTests) 
    : 0;
  const highestScore = totalTests > 0 
    ? Math.max(...history.map(h => h.score)) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Left Column */}
      <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Привет, Студент!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Готов к новой тренировке? Начни новый тест или повтори ошибки.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors p-6 flex flex-col">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
            Начать тренировку
          </h2>
          
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mb-8 text-base">
            Master your Russian grammar and vocabulary with official certification test questions.
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            <Link to="/config" className="bg-blue-600 text-white rounded-lg font-medium transition-all shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 px-8 py-3 flex items-center gap-2">
              <FileQuestion size={20} />
              Начать тест
            </Link>
            {totalTests > 0 && (
              <Link
                to="/config?mode=wrong"
                className="border border-slate-200 rounded-lg text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors px-6 py-3 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <AlertTriangle size={20} />
                Проработать ошибки
              </Link>
            )}
          </div>
        </div>

        {totalTests > 0 && (
          <div className="flex-1 min-h-0 mt-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Последние результаты</h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Дата</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Вопросы</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase">Счет</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase text-right">Действие</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
                  {history.slice(0, 5).map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {format(new Date(result.date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          {format(new Date(result.date), 'HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4">{result.totalQuestions}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-blue-600' : 'text-red-600'}`}>
                          {result.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/review/${result.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Обзор
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      {totalTests > 0 && (
        <div className="col-span-1 md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors p-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Ваша эффективность</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Средний балл</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">{averageScore}%</div>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${averageScore}%` }}></div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Тестов</div>
                  <div className="text-lg font-bold dark:text-slate-200">{totalTests}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Лучший</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{highestScore}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-900 text-white rounded-xl transition-colors p-6">
            <h2 className="text-sm font-semibold opacity-80 mb-2 flex items-center gap-2">
              <Target size={16} />
              Прогресс
            </h2>
            <p className="text-sm opacity-90 leading-relaxed mb-6">
              Продолжайте практиковаться, чтобы улучшить свои результаты и подготовиться к экзамену.
            </p>
            <Link to="/config" className="block text-center w-full bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 py-3 rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 hover:opacity-90 transition-opacity">
              Тренироваться
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4 transition-colors">
      <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">{title}</p>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
