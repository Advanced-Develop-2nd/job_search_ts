import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  years: string;
}

const ChatPage = () => {
  const { toggleTheme } = useTheme(); // isDarkModeを削除
  const [skills, setSkills] = useState<Skill[]>([{ id: crypto.randomUUID(), name: '', years: '' }]);
  const [careerVision, setCareerVision] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // ... (addSkill, removeSkill, updateSkill, handleAnalyze の実装は前回と同じ)
  const addSkill = () => setSkills([...skills, { id: crypto.randomUUID(), name: '', years: '' }]);
  const removeSkill = (id: string) => skills.length > 1 && setSkills(skills.filter(s => s.id !== id));
  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAnalyze = () => {
    setAiResponse("AI解析中...");
    setTimeout(() => setAiResponse("解析結果を表示します。"), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="h-24 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">JOB SEARCH AI</h1>
        <button onClick={toggleTheme} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">✨</button>
      </header>

      <main className="max-w-[1200px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
             {/* スキル入力フォーム */}
             {skills.map(skill => (
               <div key={skill.id} className="flex gap-2 mb-2">
                 <input className="flex-1 p-2 border rounded" value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} />
                 <button onClick={() => removeSkill(skill.id)}>🗑️</button>
               </div>
             ))}
             <button onClick={addSkill} className="w-full p-2 border-2 border-dashed rounded">+ Add</button>
          </div>
          
          <textarea 
            className="w-full h-32 p-4 rounded-3xl border dark:bg-slate-800"
            value={careerVision}
            onChange={e => setCareerVision(e.target.value)}
          />
          <button onClick={handleAnalyze} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">分析</button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="whitespace-pre-wrap">{aiResponse || "結果がここに表示されます"}</div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;