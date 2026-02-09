import React, { useState, UIEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '../context/ThemeContext';
import termsText from '../assets/terms.md?raw';

const AgreementPage: React.FC = () => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      setHasReadToBottom(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-12">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-[3rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-8 py-10 md:px-16 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">利用規約</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">内容をご確認の上、同意をお願いいたします</p>
          </div>
        </div>

        {/* Markdown Content (白背景固定) */}
        <div className="p-8 md:p-16 flex-1">
          <div 
            onScroll={handleScroll}
            className="h-[45vh] md:h-[520px] overflow-y-auto rounded-[2rem] border border-slate-200 terms-surface-fixed p-8 md:p-12 shadow-inner custom-scrollbar text-left"
          >
            <article className="prose prose-slate prose-lg max-w-none prose-headings:text-black prose-p:text-slate-800">
              <ReactMarkdown>{termsText}</ReactMarkdown>
            </article>
            <div className="mt-12 py-8 border-t border-slate-100 text-center">
              <p className="text-indigo-600 font-extrabold tracking-widest text-sm italic">--- 規約の全文は以上です ---</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-12 space-y-8">
            <label className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all duration-500 ${
              hasReadToBottom 
                ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 cursor-pointer shadow-xl shadow-indigo-100 dark:shadow-none' 
                : 'border-slate-100 dark:border-slate-800 opacity-30 grayscale'
            }`}>
              <input 
                type="checkbox" 
                className="w-8 h-8 rounded-xl border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                disabled={!hasReadToBottom}
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span className={`text-lg font-bold ${hasReadToBottom ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                プライバシーポリシーの内容に同意する
              </span>
            </label>

            <button
              onClick={() => navigate('/chat')}
              disabled={!isAgreed}
              className="w-full py-6 bg-slate-900 dark:bg-indigo-600 hover:opacity-90 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-xl font-black rounded-2xl shadow-2xl transition-all active:scale-[0.99]"
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