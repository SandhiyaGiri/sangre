'use client';

import { useEffect, useState, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import AnimatedOrb from '@/components/AnimatedOrb';
import ReportUploader from '@/components/ReportUploader';
import SessionSummary from '@/components/SessionSummary';
import LanguageSelector from '@/components/LanguageSelector';
import { Language, getTranslation } from '@/lib/translations';

interface Message {
  id: string;
  role: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

interface Summary {
  report_id: string;
  generated_at: string;
  findings: string[];
  key_questions_answered: string[];
  recommendations: string[];
  follow_up_actions: string[];
}

type AppState = 'upload' | 'conversation' | 'summary';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);
  const agentSpeakingTimeoutRef = useRef<NodeJS.Timeout>();

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to agent');
      setIsLoading(false);
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected');
      setCurrentTranscription('');
      setIsAgentSpeaking(false);
      setIsLoading(false);
      setIsConnected(false);
      setIsEndingSession(false);
    },
    onMessage: (message: any) => {
      console.log('Message:', message);

      if (message.type === 'user_message' && typeof message.message === 'string') {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${messageCountRef.current++}`,
            role: 'user',
            message: message.message,
            timestamp: new Date(),
          },
        ]);
        setCurrentTranscription('');
        setIsAgentSpeaking(false);
      } else if (message.type === 'agent_message' && typeof message.message === 'string') {
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${messageCountRef.current++}`,
            role: 'agent',
            message: message.message,
            timestamp: new Date(),
          },
        ]);
        setIsAgentSpeaking(true);
        if (agentSpeakingTimeoutRef.current) {
          clearTimeout(agentSpeakingTimeoutRef.current);
        }
        agentSpeakingTimeoutRef.current = setTimeout(() => {
          setIsAgentSpeaking(false);
        }, 1000);
      } else if (message.type === 'user_transcription' && typeof message.transcription === 'string') {
        setCurrentTranscription(message.transcription);
      }
    },
    onError: (error: any) => {
      console.error('Error:', error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscription]);

  const handleUploadSuccess = (newReportId: string, newPatientName: string) => {
    setReportId(newReportId);
    setPatientName(newPatientName);
    setUploadError(null);
    setAppState('conversation');
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  const startConversation = async () => {
    if (isLoading || isConnected) {
      return;
    }
    setIsLoading(true);
    setMessages([]);
    messageCountRef.current = 0;
    try {
      await conversation.startSession({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!,
        connectionType: 'webrtc',
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      setIsLoading(false);
    }
  };

  const stopConversation = async () => {
    if (!isConnected || isEndingSession) {
      return;
    }

    setIsEndingSession(true);
    try {
      await conversation.endSession();
      setIsAgentSpeaking(false);
      setCurrentTranscription('');
    } catch (error) {
      console.error('Failed to end session:', error);
    } finally {
      setIsEndingSession(false);
    }

    if (reportId && messages.length > 0) {
      await generateSummary();
    }
  };

  const generateSummary = async () => {
    if (!reportId) return;
    setIsSummaryLoading(true);
    try {
      const response = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: reportId,
          transcript: messages.map((m) => ({
            role: m.role,
            content: m.message,
            timestamp: m.timestamp.toISOString(),
          })),
          language,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSummary(result.summary);
        setAppState('summary');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setAppState('upload');
    setReportId(null);
    setPatientName('');
    setMessages([]);
    setSummary(null);
    setUploadError(null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            {getTranslation(language, 'app_title')}
          </h1>
          <p className="text-slate-400 mb-6">
            {appState === 'upload'
              ? 'Upload your health report to begin'
              : appState === 'conversation'
                ? 'Discuss your health report with our AI assistant'
                : 'Your session summary'}
          </p>

          {/* Language Selector */}
          <div className="flex justify-center mb-4">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>

        {/* Upload State */}
        {appState === 'upload' && (
          <div className="space-y-6">
            <ReportUploader
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              language={language}
            />
            {uploadError && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                <p className="font-semibold">{getTranslation(language, 'error')}</p>
                <p className="text-sm mt-1">{uploadError}</p>
              </div>
            )}
          </div>
        )}

        {/* Conversation State */}
        {appState === 'conversation' && (
          <div className="space-y-4">
            {/* Patient Info */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
              <p className="text-slate-300">
                <span className="font-semibold text-blue-400">{getTranslation(language, 'patient_name')}:</span> {patientName}
              </p>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-slate-400">Report ID:</span> {reportId}
              </p>
            </div>

            {/* Animated Orb */}
            <div className="flex justify-center">
              <AnimatedOrb
                isActive={isConnected}
                isSpeaking={isAgentSpeaking}
                size="md"
              />
            </div>

            {/* Conversation Area */}
            <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[500px] border border-slate-700">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !isConnected ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <p className="text-slate-400 mb-2">
                        {getTranslation(language, 'conversation_ended')}
                      </p>
                      <p className="text-sm text-slate-500">
                        {getTranslation(language, 'start_conversation')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-700 text-slate-100'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.role === 'user'
                                ? 'text-blue-200'
                                : 'text-slate-400'
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {currentTranscription && (
                      <div className="flex justify-end">
                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-500 text-white opacity-75">
                          <p className="text-sm italic break-words">{currentTranscription}</p>
                        </div>
                      </div>
                    )}

                    {isConnected && messages.length > 0 && !currentTranscription && (
                      <div className="flex justify-start">
                        <div className="bg-slate-700 text-slate-100 px-4 py-2 rounded-lg">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Control Panel */}
              <div className="border-t border-slate-700 bg-slate-900 p-6 space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isConnected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
                    }`}
                  />
                  <span className="text-sm text-slate-300">
                    {isLoading
                      ? getTranslation(language, 'connecting')
                      : isConnected
                        ? getTranslation(language, 'connected')
                        : getTranslation(language, 'ready')}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startConversation}
                    disabled={isConnected || isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isLoading ? getTranslation(language, 'connecting') : getTranslation(language, 'start_conversation')}
                  </button>
                  <button
                    onClick={stopConversation}
                    disabled={!isConnected || isSummaryLoading || isEndingSession}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    {isSummaryLoading || isEndingSession
                      ? getTranslation(language, 'generating_summary')
                      : getTranslation(language, 'end_call')}
                  </button>
                </div>

                <button
                  onClick={handleBackToUpload}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                  {getTranslation(language, 'back')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary State */}
        {appState === 'summary' && (
          <>
            <SessionSummary
              summary={summary}
              patientName={patientName}
              language={language}
              onClose={handleBackToUpload}
            />
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-500">
          <p>Telehealth Insight Companion v1.0</p>
        </div>
      </div>
    </main>
  );
}
