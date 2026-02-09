import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  years: string;
}

const ChatPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [skills, setSkills] = useState<Skill[]>([{ id: crypto.randomUUID(), name: '', years: '' }]);
  const [careerVision, setCareerVision] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const addSkill = () => setSkills([...skills, { id: crypto.randomUUID(), name: '', years: '' }]);
  const removeSkill = (id: string) => skills.length > 1 && setSkills(skills.filter(s => s.id !== id));
  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAnalyze = () => {
    setAiResponse("AIがあなたのキャリアプランを策定しています...");
    setTimeout(() => {
      setAiResponse(`あなたの${skills.length}つの強みを分析しました。\n「${careerVision}」という目標に向けて、まずは専門性を深めることをお勧めします。`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <header className="h-24 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">J</div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">Job Search AI</h1>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-12">
          {/* Skill Card */}
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
            <h2 className="text-2xl font-black flex items-center gap-4">
              <span className="text-indigo-600">01.</span> 保有スキル
            </h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-4 group">
                  <input
                    placeholder="Skill"
                    className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-4 ring-indigo-500/10 outline-none"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Years"
                    className="w-24 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-center outline-none"
                    value={skill.years}
                    onChange={(e) => updateSkill(skill.id, 'years', e.target.value)}
                  />
                  <button onClick={() => removeSkill(skill.id)} className="text-slate-300 hover:text-red-500 transition-colors">🗑️</button>
                </div>
              ))}
              <button onClick={addSkill} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 font-bold hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-all">+ スキルを追加</button>
            </div>
          </section>

          {/* Vision Card */}
          <section className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-8">
            <h2 className="text-2xl font-black flex items-center gap-4 text-slate-900 dark:text-slate-100">
              <span className="text-purple-600">02.</span> キャリアイメージ
            </h2>
            <textarea
              placeholder="挑戦したい業界や、目指すポジションなど..."
              className="w-full h-48 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none resize-none leading-relaxed"
              value={careerVision}
              onChange={(e) => setCareerVision(e.target.value)}
            />
          </section>

          <button onClick={handleAnalyze} className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-3xl text-xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all">
            AI分析を開始
          </button>
        </div>

        {/* Result Card */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-14 shadow-2xl min-h-[800px] border border-slate-100 dark:border-slate-800 flex flex-col transition-all">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 italic underline decoration-indigo-500 underline-offset-8 text-slate-900 dark:text-slate-100">
              Analysis Results
            </h2>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] p-10 leading-loose text-lg text-slate-700 dark:text-slate-300">
              {aiResponse ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-pre-wrap text-left">
                  {aiResponse}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-6">
                  <div className="text-8xl animate-bounce">✨</div>
                  <p className="font-bold text-2xl">Awaiting Your Input</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;