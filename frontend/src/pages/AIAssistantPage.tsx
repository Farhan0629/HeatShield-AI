import React from 'react';
import { ChatWindow } from '../components/assistant/ChatWindow';
import type { AIChatMessage } from '../types/ai';
import type { Facility } from '../types/facility';
import type { EnvironmentalMetrics } from '../types/heat';
import type { RiskAssessment } from '../types/risk';

interface Props {
  facility: Facility | null;
  metrics: EnvironmentalMetrics | null;
  assessment: RiskAssessment | null;
  messages: AIChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const AIAssistantPage: React.FC<Props> = ({
  facility,
  metrics,
  assessment,
  messages,
  isLoading,
  onSendMessage
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white font-mono">
          AI OPERATIONS ASSISTANT
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Interactive decision support assistant grounded in live FortyGuard environmental data & HeatShield risk scores.
        </p>
      </div>

      <ChatWindow
        facility={facility}
        metrics={metrics}
        assessment={assessment}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};
