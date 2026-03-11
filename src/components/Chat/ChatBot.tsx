import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am OZRTI AI Assistant. I can help you analyze parliamentary documents, extract key insights, and answer questions about legislation. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Based on the parliamentary documents analysis, I found several key points related to your query. The legislation shows strong emphasis on transparency and accountability measures.",
        "I've analyzed the relevant documents. This bill proposes significant reforms in governance structure with implementation timelines spanning 18-24 months.",
        "According to the parliamentary records, this topic has been discussed in 3 committee sessions. The main concerns raised include budget allocation and implementation feasibility.",
        "The document analysis reveals this initiative aligns with the national development strategy. Key stakeholders identified include Ministry of Finance and local government bodies.",
        "I've reviewed the amendments proposed. The changes primarily focus on strengthening oversight mechanisms and improving public participation in decision-making processes.",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 100,
      right: 24,
      width: 420,
      height: 600,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: 'white',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 24 }}>🤖</div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>OZRTI AI Assistant</h3>
          </div>
          <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#10b981',
            }} />
            Online
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            width: 32,
            height: 32,
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px 24px',
        background: '#f9fafb',
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: 16,
              display: 'flex',
              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
              gap: 12,
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: message.role === 'user' ? '#2563eb' : '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {message.role === 'user' ? profile?.full_name?.charAt(0) || 'U' : '🤖'}
            </div>
            <div style={{
              maxWidth: '75%',
            }}>
              <div style={{
                background: message.role === 'user' ? '#2563eb' : 'white',
                color: message.role === 'user' ? 'white' : '#1f2937',
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}>
                {message.content}
              </div>
              <div style={{
                fontSize: 11,
                color: '#9ca3af',
                marginTop: 4,
                paddingLeft: message.role === 'user' ? 0 : 16,
                paddingRight: message.role === 'user' ? 16 : 0,
                textAlign: message.role === 'user' ? 'right' : 'left',
              }}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              flexShrink: 0,
            }}>
              🤖
            </div>
            <div style={{
              background: 'white',
              padding: '12px 16px',
              borderRadius: 12,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', gap: 4 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out',
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out 0.2s',
                }} />
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#9ca3af',
                  animation: 'bounce 1.4s infinite ease-in-out 0.4s',
                }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #e5e7eb',
        background: 'white',
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about parliamentary documents..."
            style={{
              flex: 1,
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: 24,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              padding: '10px 20px',
              background: input.trim() && !isTyping ? '#2563eb' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: 24,
              cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
