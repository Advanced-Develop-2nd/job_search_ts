import React, { useState, type UIEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import termsData from '../assets/termsOfService.json';

const AgreementPage: React.FC = () => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      setHasReadToBottom(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 md:p-12 transition-colors duration-500">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-8 py-8 md:px-12 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">利用規約</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">内容をご確認の上、同意をお願いいたします</p>
          </div>
          <button onClick={toggleTheme} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl hover:scale-105 transition-all cursor-pointer shadow-sm">
            ✨
          </button>
        </div>

        {/* 規約エリア (白背景固定) */}
        <div className="p-6 md:p-10 flex-1">
          <div 
            onScroll={handleScroll}
            className="h-[40vh] md:h-[450px] overflow-y-auto rounded-3xl border border-slate-200 terms-surface-fixed p-8 shadow-inner custom-scrollbar text-left"
          >
            <div className="space-y-6">
              <p className="font-bold border-b pb-2">{termsData.introduction}</p>
              {termsData.articles.map((article) => (
                <section key={article.number} className="space-y-2">
                  <h2 className="font-black text-indigo-600">第{article.number}条（{article.title}）</h2>
                  <p className="text-sm leading-relaxed text-slate-800">{article.content}</p>
                  {article.items && (
                    <ul className="list-disc ml-5 text-sm space-y-1 text-slate-700">
                      {article.items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </div>

          {/* 同意アクション */}
          <div className="mt-8 space-y-6">
            <label className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
              hasReadToBottom 
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 cursor-pointer shadow-md' 
                : 'border-slate-100 dark:border-slate-800 opacity-40 grayscale cursor-not-allowed'
            }`}>
              <input 
                type="checkbox" 
                className="w-6 h-6 rounded border-slate-300 text-indigo-600 cursor-pointer"
                disabled={!hasReadToBottom}
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <span className={`font-bold ${hasReadToBottom ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                規約に同意して次へ進む
              </span>
            </label>

            <button
              onClick={() => navigate('/chat')}
              disabled={!isAgreed}
              className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white text-lg font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:shadow-none"
            >
              AIチャットを開始する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementPage;