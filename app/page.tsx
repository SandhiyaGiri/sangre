'use client';

import { useEffect, useState, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import AnimatedOrb from '@/components/AnimatedOrb';

interface Message {
  id: string;
  role: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);
  const agentSpeakingTimeoutRef = useRef<NodeJS.Timeout>();

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to agent');
      setIsLoading(false);
    },
    onDisconnect: () => {
      console.log('Disconnected');
      setCurrentTranscription('');
    },
    onMessage: (message: any) => {
      console.log('Message:', message);

      // Handle different message types
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
        // Clear previous timeout
        if (agentSpeakingTimeoutRef.current) {
          clearTimeout(agentSpeakingTimeoutRef.current);
        }
        // Reset agent speaking state after 1 second of no new messages
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscription]);

  const startConversation = async () => {
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

  const stopConversation = () => {
    conversation.endSession();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">ElevenLabs Agent</h1>
          <p className="text-gray-400">Voice-powered conversation interface</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          {/* Animated Orb */}
          <AnimatedOrb
            isActive={(conversation as any).isConnected}
            isSpeaking={isAgentSpeaking}
            size="md"
          />

          <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px] w-full">
          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !(conversation as any).isConnected ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <p className="text-gray-400 mb-2">No conversation yet</p>
                  <p className="text-sm text-gray-500">Click "Start Conversation" to begin</p>
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
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.role === 'user'
                            ? 'text-blue-200'
                            : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Current Transcription */}
                {currentTranscription && (
                  <div className="flex justify-end">
                    <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-blue-500 text-white opacity-75">
                      <p className="text-sm italic break-words">{currentTranscription}</p>
                    </div>
                  </div>
                )}

                {/* Agent Thinking Indicator */}
                {(conversation as any).isConnected && messages.length > 0 && !currentTranscription && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            {/* Status Indicator */}
            <div className="flex items-center justify-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  (conversation as any).isConnected
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-gray-500'
                }`}
              />
              <span className="text-sm text-gray-300">
                {isLoading
                  ? 'Connecting...'
                  : (conversation as any).isConnected
                    ? 'Connected - Listening'
                    : 'Ready'}
              </span>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={startConversation}
                disabled={(conversation as any).isConnected || isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {isLoading ? 'Starting...' : 'Start Conversation'}
              </button>
              <button
                onClick={stopConversation}
                disabled={!(conversation as any).isConnected}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                End Call
              </button>
            </div>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Agent ID: {process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}</p>
        </div>
      </div>
    </main>
  );
}
