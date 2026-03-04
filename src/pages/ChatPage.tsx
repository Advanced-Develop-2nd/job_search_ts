import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Skill {
  id: string;
  name: string;
  years: string;
}

const ChatPage = () => {
  const [skills, setSkills] = useState<Skill[]>([{ id: crypto.randomUUID(), name: '', years: '0.5' }]);
  const [careerVision, setCareerVision] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const hasAnySkill = skills.some(s => s.name.trim() !== '');
  const hasCareerVision = careerVision.trim() !== '';
  const bothEmpty = !hasAnySkill && !hasCareerVision;

  const addSkill = () => setSkills([...skills, { id: crypto.randomUUID(), name: '', years: '0.5' }]);
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

    // バックエンドの期待する構造に合わせる
    const payload = {
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
          'Content-Type': 'application/json',
          // 必要に応じて APIキーを追加
          // 'X-API-KEY': 'your-key'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`分析に失敗しました (${response.status})`);
      
      const data = await response.json();

      // --- 修正箇所：配列の最初の要素から result を取り出す ---
      if (Array.isArray(data) && data.length > 0 && data[0].result) {
        setAiResponse(data[0].result);
      } else if (data.result) {
        // オブジェクトで返ってきた場合のフォールバック
        setAiResponse(data.result);
      } else {
        throw new Error("解析結果が見つかりませんでした。");
      }

    } catch (error: unknown) { // any ではなく unknown に変更
      console.error(error);
      
      // error が Message を持っているかチェックして取り出す
      let errorMessage = "サーバーとの通信に失敗しました。";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setAiResponse(`### エラー\n${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <header className="h-20 sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-8 flex items-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mr-4 shadow-lg">P</div>
        <h1 className="text-xl font-black uppercase tracking-tight">AZAPAENG プロネクAI</h1>
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
                    placeholder="例: JavaScript、MILS、AI"
                    className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 ring-indigo-500/50"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="年"
                    className="w-18 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center outline-none"
                    min = "0"
                    step = "0.5"
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
              placeholder="例：MATLAB/Simulinkを用いた車載システムの開発経験があるため、MILSの案件に関わりたいです。"
              className="w-full h-40 p-5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none resize-none focus:ring-2 ring-purple-500/50"
              value={careerVision}
              onChange={(e) => setCareerVision(e.target.value)}
            />
          </section>

          <button 
            onClick={handleAnalyze} 
            disabled={isLoading || bothEmpty} 
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