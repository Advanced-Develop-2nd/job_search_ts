import React, { useState, type UIEvent } from 'react'; // typeを追加
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import termsText from '../assets/terms.md?raw';

const AgreementPage: React.FC = () => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme(); // isDarkModeを削除

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      setHasReadToBottom(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-12 transition-colors">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        <div className="px-8 py-10 md:px-16 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">利用規約</h1>
          </div>
          <button onClick={toggleTheme} className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-all cursor-pointer">
            ✨
          </button>
        </div>

        <div className="p-8 md:p-16 flex-1">
          <div 
            onScroll={handleScroll}
            className="h-[45vh] md:h-[520px] overflow-y-auto rounded-[2rem] border border-slate-200 terms-surface-fixed p-8 md:p-12 shadow-inner custom-scrollbar text-left"
          >
            <article className="prose prose-slate prose-lg max-w-none prose-headings:text-black prose-p:text-slate-800">
              <ReactMarkdown>{termsText}</ReactMarkdown>
            </article>
          </div>

          <div className="mt-12 space-y-8">
            <label className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all ${
              hasReadToBottom ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-100 opacity-30'
            }`}>
              <input 
                type="checkbox" 
                className="w-8 h-8 cursor-pointer"
                disabled={!hasReadToBottom}
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span className="text-lg font-bold">同意する</span>
            </label>
            <button
              onClick={() => navigate('/chat')}
              disabled={!isAgreed}
              className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white text-xl font-black rounded-2xl disabled:bg-slate-200"
            >
              次へ進む
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;