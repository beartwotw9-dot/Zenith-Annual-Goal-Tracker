
import React, { useState, useMemo } from 'react';
import { X, Share2, Info, AlertTriangle, CheckCircle2, Copy, Check, Lock, Send } from 'lucide-react';
import { Goal } from '../types';
import { encodeDataForUrl } from '../utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: Goal[];
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, currentGoals }) => {
  const [copied, setCopied] = useState(false);

  const encoded = useMemo(() => {
    if (!isOpen) return "";
    return encodeDataForUrl(currentGoals);
  }, [currentGoals, isOpen]);

  const finalUrl = useMemo(() => {
    // 使用 origin + pathname 確保不論是在子路徑還是根目錄都能正確導向
    const baseUrl = window.location.origin + window.location.pathname;
    // 移除末尾可能存在的 index.html 以保持網址簡潔
    const cleanUrl = baseUrl.endsWith('index.html') ? baseUrl.slice(0, -10) : baseUrl;
    return `${cleanUrl}#data=${encoded}`;
  }, [encoded]);

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleNativeShare = async () => {
    const shareData = {
      title: 'Zenith 2026 年度計畫模板',
      text: `這是我 2026 年的戰鬥藍圖。邀請你一起參考這份計畫，建立屬於你的年度目標！🚀`,
      url: finalUrl,
    };

    try {
      await navigator.share(shareData);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        handleCopy();
      }
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = finalUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  // 使用 L 等級糾錯讓 QR Code 點陣不那麼密集，增加掃描成功率
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(finalUrl)}&margin=10&ecc=L`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/80 backdrop-blur-md p-0 sm:p-4">
      <div className="bg-white rounded-t-[32px] sm:rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-slate-800">公開分享模板</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mb-6 bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Send className="w-16 h-16 -rotate-12" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Public Template Ready</p>
             <h3 className="text-sm font-bold leading-tight">任何人掃描下方 QR Code<br/>皆可預覽並匯入您的計畫。</h3>
          </div>

          <div className="relative inline-block p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-6">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Scan to Preview</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-6">
            {canNativeShare && (
              <button 
                onClick={handleNativeShare}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>傳送到 LINE / 社群</span>
              </button>
            )}
            
            <button 
              onClick={handleCopy}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                copied ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 hover:border-blue-400 text-slate-600'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '連結已複製' : '複製公開分享網址'}</span>
            </button>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold justify-center">
               <Lock className="w-3 h-3" />
               <span className="uppercase tracking-widest">End-to-End Encrypted Snapshot</span>
            </div>
            <p className="text-[9px] text-slate-300 leading-tight px-4 italic">
              提示：掃描後若出現 404，請確認您的專案已點擊「發布」按鈕變更為公開狀態。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
