import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Skill {
  id: string;
  name: string;
  years: string;
}

const ChatPage = () => {
  const [skills, setSkills] = useState<Skill[]>([{ id: crypto.randomUUID(), name: '', years: '' }]);
  const [careerVision, setCareerVision] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addSkill = () => setSkills([...skills, { id: crypto.randomUUID(), name: '', years: '' }]);
  const removeSkill = (id: string) => {
    if (skills.length > 1) setSkills(skills.filter(s => s.id !== id));
  };
  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // API送信処理
  const handleAnalyze = async () => {
    setIsLoading(true);
    setAiResponse(null);

    // リクエスト仕様に基づいたデータ整形
    const requestData = {
      body: {
        skills: skills
          .filter(s => s.name.trim() !== '')
          .map(s => ({
            name: s.name,
            years: Number(s.years) || 0
          })),
        wish: careerVision
      }
    };

    try {
      const response = await fetch('https://app.azp-eng.com/webhook/jobsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Response仕様の "result" フィールド（Markdown）をセット
      if (data && data.result) {
        setAiResponse(data.result);
      } else {
        setAiResponse("解析結果のデータ構造が正しくありません。");
      }
    } catch (error) {
      console.error('API Error:', error);
      setAiResponse("### 通信エラー\nAPIとの通信に失敗しました。接続設定やCORS設定を確認してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <header className="h-20 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mr-4 shadow-lg">J</div>
        <h1 className="text-xl font-black uppercase tracking-tight">Job Search AI</h1>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 左側：入力フォーム */}
        <div className="lg:col-span-5 space-y-8 text-left">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-black flex items-center gap-3">
              <span className="text-indigo-600">01.</span> 保有スキル
            </h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex gap-3">
                  <input
                    placeholder="例: JavaScript"
                    className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500/50"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="年"
                    className="w-16 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center outline-none"
                    value={skill.years}
                    onChange={(e) => updateSkill(skill.id, 'years', e.target.value)}
                  />
                  <button onClick={() => removeSkill(skill.id)} className="text-slate-400 hover:text-red-500 transition-colors">🗑️</button>
                </div>
              ))}
              <button onClick={addSkill} className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 font-bold hover:bg-indigo-50/20 transition-all">+ スキルを追加</button>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-black flex items-center gap-3">
              <span className="text-purple-600">02.</span> キャリアビジョン
            </h2>
            <textarea
              placeholder="将来の希望や挑戦したいことを入力してください"
              className="w-full h-40 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none focus:ring-2 ring-purple-500/50"
              value={careerVision}
              onChange={(e) => setCareerVision(e.target.value)}
            />
          </section>

          <button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white font-black rounded-2xl text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                解析中...
              </span>
            ) : "AI分析を実行"}
          </button>
        </div>

        {/* 右カラム：解析結果表示 */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl min-h-[600px] border border-slate-100 dark:border-slate-800 flex flex-col text-left">
            <h2 className="text-2xl font-black mb-8 italic underline decoration-indigo-500 underline-offset-8">Analysis Results</h2>
            <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-8 shadow-inner overflow-y-auto">
              {aiResponse ? (
                <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-h3:text-indigo-600 dark:prose-h3:text-indigo-400 prose-h3:mt-8 prose-h3:mb-2 prose-p:leading-relaxed">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </article>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                  <span className="text-6xl animate-pulse">✨</span>
                  <p className="font-bold">入力を完了して分析を開始してください</p>
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