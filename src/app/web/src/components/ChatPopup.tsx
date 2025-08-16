import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, MessageCircle, X, Sparkles } from 'lucide-react';
import { validateChatInput, ChatRateLimit } from '../utils/inputValidation';
import { chatResponses, personalInfo } from '../config/portfolioData';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi there! ✨ I'm ${personalInfo.name}'s AI assistant. I can answer questions about his experience, skills, and projects. What would you like to know?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputError, setInputError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rateLimitRef = useRef(new ChatRateLimit());

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isTyping, isOpen, scrollToBottom]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;

    // Clear previous errors
    setInputError('');

    // Validate input
    const validation = validateChatInput(inputValue);
    if (!validation.isValid) {
      setInputError(validation.errors[0]);
      return;
    }

    // Check rate limiting
    if (!rateLimitRef.current.canSendMessage()) {
      const remainingTime = Math.ceil(rateLimitRef.current.getRemainingTime() / 1000);
      setInputError(`Please wait ${remainingTime} seconds before sending another message`);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      content: validation.sanitizedInput || inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with more realistic timing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue.trim()),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  }, [inputValue, isTyping]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('skills') || lowerMessage.includes('technology')) {
      return chatResponses.skills;
    } else if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return chatResponses.experience;
    } else if (lowerMessage.includes('projects')) {
      return chatResponses.projects;
    } else if (lowerMessage.includes('education')) {
      return chatResponses.education;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return `📧 You can reach ${personalInfo.name} at ${personalInfo.email} or connect with him on LinkedIn. He's always open to discussing exciting opportunities and innovative projects!`;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return chatResponses.hello;
    } else if (lowerMessage.includes('architecture') || lowerMessage.includes('design')) {
      return chatResponses.architecture;
    } else if (lowerMessage.includes('leadership') || lowerMessage.includes('team')) {
      return chatResponses.leadership;
    } else {
      return chatResponses.default;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "💻 What are his key skills?",
    "🏢 Tell me about his experience",
    "🚀 What projects has he built?",
    "👑 What's his leadership style?"
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Enhanced Backdrop with Beautiful Blur */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-[50px] saturate-150 z-50 transition-all duration-500"
        onClick={onClose}
        style={{
          backdropFilter: 'blur(50px) saturate(150%) brightness(0.7)',
          WebkitBackdropFilter: 'blur(50px) saturate(150%) brightness(0.7)'
        }}
      />
      
      {/* Enhanced Chat Modal */}
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-[700px] z-50">
        <div className="glass-card rounded-3xl border border-white/40 h-full flex flex-col overflow-hidden backdrop-blur-[40px] shadow-2xl"
             style={{
               backdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
               WebkitBackdropFilter: 'blur(40px) saturate(180%) brightness(1.1)',
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)'
             }}>
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 glass-subtle rounded-2xl flex items-center justify-center relative">
                <MessageCircle className="h-6 w-6 text-blue-600" />
                <Sparkles className="h-3 w-3 text-purple-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <h3 className="text-xl text-foreground">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">Ask me about {personalInfo.name}'s background</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="glass-button rounded-xl h-10 w-10 p-0 hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Enhanced Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-foreground ml-auto backdrop-blur-sm border border-blue-500/40 shadow-lg'
                        : 'glass-subtle border border-white/20 text-foreground shadow-lg'
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced Typing Indicator */}
            {isTyping && (
              <div className="flex gap-4">
                <div className="glass-subtle border border-white/20 px-5 py-3 rounded-2xl shadow-lg">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full animate-bounce [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-slate-700 to-slate-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-4">✨ Try asking:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => {
                      setInputValue(question);
                      inputRef.current?.focus();
                    }}
                    className="text-sm px-4 py-2 glass-button rounded-xl hover:bg-white/20 transition-all duration-300 text-left text-muted-foreground hover:text-foreground border border-white/20 hover:border-white/40"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="p-6 border-t border-white/20">
            {inputError && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{inputError}</p>
              </div>
            )}
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError(''); // Clear error on typing
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about experience, skills, projects... (max 500 chars)"
                  className={`glass-subtle border-white/30 rounded-xl h-14 px-5 text-base placeholder:text-muted-foreground/60 focus:border-white/50 transition-all duration-300 ${
                    inputError ? 'border-red-500/50 focus:border-red-500/70' : ''
                  }`}
                  disabled={isTyping}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1 px-2">
                  {inputValue.length}/500 characters
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="lg"
                className="glass-button rounded-xl h-14 w-14 p-0 flex-shrink-0 hover:bg-gradient-to-br hover:from-blue-500/30 hover:to-purple-500/30 hover:border-purple-500/40 transition-all duration-300 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles - Fixed to use proper CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.4);
          }
        `
      }} />
    </>
  );
}