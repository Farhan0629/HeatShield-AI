import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Building2 } from 'lucide-react';
import type { AIChatMessage } from '../../types/ai';
import type { Facility } from '../../types/facility';
import type { EnvironmentalMetrics } from '../../types/heat';
import type { RiskAssessment } from '../../types/risk';

interface Props {
  facility: Facility | null;
  metrics: EnvironmentalMetrics | null;
  assessment: RiskAssessment | null;
  messages: AIChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const SUGGESTED_QUESTIONS = [
  "Which facility is currently at greatest heat risk?",
  "Why is this facility at elevated risk?",
  "What actions should we take right now?",
  "When is the peak thermal period expected?",
  "Summarize today's heat situation across all facilities.",
  "What is the operational impact on cooling and workforce?"
];

export const ChatWindow: React.FC<Props> = ({
  facility,
  metrics,
  assessment,
  messages,
  isLoading,
  onSendMessage
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[640px] shadow-2xl overflow-hidden border border-gray-800">
      {/* Assistant Header */}
      <div className="p-4 bg-surface-muted/90 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              HeatShield Assistant
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Grounded Context
              </span>
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              {facility?.name || 'Selected Facility'} • {assessment?.level || 'MODERATE'} Risk ({metrics?.temperature || '--'}°C)
            </p>
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-gray-400 hidden sm:block">
          <span>AI Intelligence: <strong className="text-purple-300">Google Gemini Live</strong> • <strong className="text-emerald-400">FortyGuard Live</strong></span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              <div
                className={`p-2 rounded-xl text-white flex-shrink-0 ${
                  isAssistant ? 'bg-indigo-600/30 border border-indigo-500/40 text-indigo-300' : 'bg-surface-hover border border-gray-700 text-gray-300'
                }`}
              >
                {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed shadow-md ${
                  isAssistant
                    ? 'bg-surface-muted/90 text-gray-200 border border-gray-800'
                    : 'bg-indigo-600 text-white font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.timestamp && (
                  <span className="block mt-2 text-[10px] opacity-60 font-mono text-right">
                    {msg.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3 rounded-2xl bg-surface-muted/90 text-xs text-gray-400 border border-gray-800 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-spin-slow" />
              <span>Analyzing live temperature telemetry & generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-surface-muted/50 border-t border-gray-800/80">
        <p className="text-[11px] font-mono text-gray-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          Suggested Quick Inquiries:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(q)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-hover hover:bg-indigo-950/60 hover:text-indigo-200 text-gray-300 border border-gray-800 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-surface-DEFAULT border-t border-gray-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask HeatShield Assistant about ${facility?.name || 'facility'} conditions...`}
          className="flex-1 bg-surface-muted text-gray-100 placeholder-gray-500 text-xs px-4 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium transition-colors shadow-md flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
