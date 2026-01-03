
import React, { useState, useRef } from 'react';
import { X, Sparkles, Send, Loader2, Info, Camera, Mic, MicOff, Trash2 } from 'lucide-react';
import { geminiService, MultimodalPart } from '../services/geminiService';
import { Transaction } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>[]) => void;
}

const AIEntry: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  
  // Media states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target?.result as string);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        setAudioBase64(base64);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('无法访问麦克风，请检查权限。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleParse = async () => {
    setIsParsing(true);
    setError('');

    const parts: MultimodalPart[] = [];
    if (text.trim()) parts.push({ text: text.trim() });
    
    if (imagePreview) {
      const base64 = imagePreview.split(',')[1];
      parts.push({ inlineData: { mimeType: imageMimeType, data: base64 } });
    }

    if (audioBase64) {
      parts.push({ inlineData: { mimeType: 'audio/webm', data: audioBase64 } });
    }

    if (parts.length === 0) {
      setIsParsing(false);
      setError('请输入文字、拍摄照片或录制语音。');
      return;
    }

    try {
      const results = await geminiService.parseMultimodal(parts);
      if (results && results.length > 0) {
        const formattedResults = results.map(r => ({
          ...r,
          date: new Date().toISOString()
        }));
        onSubmit(formattedResults);
      } else {
        setError('未能识别清晰的商品明细。请尝试更清晰的照片或描述。');
      }
    } catch (e) {
      setError('AI 智能分析失败，请检查网络或重试。');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles size={24} className="text-yellow-200" />
            </div>
            <h2 className="text-xl font-bold">商品级 AI 记账</h2>
          </div>
          <p className="text-indigo-100 text-sm">我将为您自动拆分每一件购买的商品。</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-2">
            {imagePreview && (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-indigo-100">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={() => setImagePreview(null)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            {audioBase64 && (
              <div className="relative h-20 flex items-center gap-2 bg-indigo-50 px-4 rounded-xl border border-indigo-100">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-1 bg-indigo-400 h-4 rounded-full animate-pulse" />
                  ))}
                </div>
                <span className="text-xs font-medium text-indigo-600">语音已就绪</span>
                <button 
                  onClick={() => setAudioBase64(null)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='手动输入，或使用下方工具识别...'
              className="w-full h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-slate-800 outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              capture="environment" 
              onChange={handleImageSelect}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition-all"
            >
              <Camera size={20} className="text-indigo-500" />
              <span>识别收据</span>
            </button>
            
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold transition-all ${
                isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-200' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} className="text-indigo-500" />}
              <span>{isRecording ? '识别语音' : '按住录音'}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-50 rounded-xl">
              <Info size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleParse}
            disabled={isParsing}
            className="w-full py-4 bg-indigo-600 disabled:bg-slate-300 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            {isParsing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>正在提取商品明细...</span>
              </>
            ) : (
              <>
                <Send size={20} /> 开始记账
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIEntry;
