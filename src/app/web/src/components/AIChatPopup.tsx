import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Mic, AudioWaveform, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock AI responses based on portfolio content
const getAIResponse = (question: string): string => {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('experience') || lowerQuestion.includes('years')) {
    return "🚀 Alex brings 8+ years of experience in full-stack development and solution architecture! He's delivered 50+ enterprise projects serving over 10M users globally. His expertise really shines in building scalable systems that maintain 99.99% uptime. Pretty impressive track record!";
  }
  
  if (lowerQuestion.includes('skills') || lowerQuestion.includes('technologies') || lowerQuestion.includes('tech')) {
    return "🛠️ Alex is a true full-stack architect! His toolkit includes:\n\n• **Frontend**: React, Vue.js, Angular, TypeScript, Next.js\n• **Backend**: Node.js, Python, Go, Java, REST APIs, GraphQL\n• **Cloud**: AWS, Azure, GCP, Docker, Kubernetes\n• **Mobile**: React Native, Flutter, iOS, Android\n\nHe's particularly passionate about microservices architecture and cloud-native solutions!";
  }
  
  if (lowerQuestion.includes('projects') || lowerQuestion.includes('work') || lowerQuestion.includes('portfolio')) {
    return "💼 Alex has an impressive portfolio of 50+ delivered projects! His work spans enterprise cloud infrastructure, scalable web applications, and complex system architectures. What sets him apart is his focus on maintainable, high-performance solutions. Check out the Work section below to see some of his featured projects!";
  }
  
  if (lowerQuestion.includes('contact') || lowerQuestion.includes('hire') || lowerQuestion.includes('available')) {
    return "📞 Great news! Alex is currently open to new opportunities. He's particularly interested in:\n\n• Solution Architect roles\n• Technical Lead positions\n• Senior Engineering roles\n\nYou can reach out through the contact form below, connect on LinkedIn, or email him directly. He's always excited to discuss challenging technical problems!";
  }
  
  if (lowerQuestion.includes('education') || lowerQuestion.includes('background') || lowerQuestion.includes('learning')) {
    return "📚 Alex is a lifelong learner who combines strong computer science fundamentals with cutting-edge practical experience. He stays current with emerging technologies and industry trends, always expanding his knowledge in areas like AI/ML, cloud architecture, and modern development practices.";
  }
  
  if (lowerQuestion.includes('leadership') || lowerQuestion.includes('team') || lowerQuestion.includes('management')) {
    return "👥 Leadership is one of Alex's strongest suits! He excels at:\n\n• Leading cross-functional teams\n• Mentoring junior developers\n• Translating complex technical concepts to stakeholders\n• Fostering collaborative, high-performing teams\n\nHis approach combines technical expertise with excellent communication skills.";
  }
  
  if (lowerQuestion.includes('cloud') || lowerQuestion.includes('aws') || lowerQuestion.includes('azure')) {
    return "☁️ Alex is a cloud architecture expert! His cloud expertise includes:\n\n• **Multi-cloud**: AWS, Azure, GCP\n• **Containers**: Docker, Kubernetes\n• **Infrastructure**: Terraform, CloudFormation\n• **CI/CD**: Jenkins, GitLab CI, GitHub Actions\n\nHe specializes in building resilient, scalable cloud-native solutions that grow with business needs.";
  }
  
  if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi') || lowerQuestion.includes('hey')) {
    return "👋 Hello there! I'm Alex's AI assistant, and I'm excited to tell you about his amazing journey in tech! I can share insights about his 8+ years of experience, technical skills, project highlights, leadership style, and much more. What aspect of his expertise interests you most?";
  }
  
  if (lowerQuestion.includes('mobile') || lowerQuestion.includes('react native') || lowerQuestion.includes('flutter')) {
    return "📱 Alex has solid mobile development experience! He's worked with React Native, Flutter, and native iOS/Android development. His approach focuses on creating performant, user-friendly mobile experiences that integrate seamlessly with backend systems and cloud infrastructure.";
  }
  
  if (lowerQuestion.includes('architecture') || lowerQuestion.includes('system design') || lowerQuestion.includes('microservices')) {
    return "🏗️ System architecture is Alex's specialty! He excels at designing scalable, maintainable systems using microservices patterns, event-driven architectures, and cloud-native approaches. His solutions are built to handle growth while maintaining performance and reliability.";
  }
  
  // Default response
  return "🤔 That's an interesting question! Alex brings a wealth of experience in solution architecture and full-stack development. He's passionate about creating scalable systems, mentoring teams, and solving complex technical challenges. Would you like to know more about his specific skills, project experience, or leadership background?";
};

export function AIChatPopup({ isOpen, onClose }: AIChatPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm Alex's AI assistant. Ask me anything about his experience, skills, projects, or background!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when popup opens and handle escape key
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:w-[600px] lg:h-[700px] z-50"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="relative h-full glass-strong rounded-3xl overflow-hidden border border-white/25 dark:border-white/15 shadow-2xl shadow-blue-500/10">
              {/* Header */}
              <div className="relative px-8 sm:px-10 py-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">Ask AI About Alex</h3>
                      <p className="text-sm text-foreground/60">Get instant answers about his experience</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="rounded-full w-8 h-8 p-0 hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-6 space-y-4 h-[calc(100%-140px)] overscroll-contain">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} touch-manipulation`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 select-text touch-manipulation ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                          : 'glass-light border border-white/10 text-foreground'
                      } active:scale-[0.98] transition-transform duration-100 ease-out`}
                      style={{ 
                        WebkitTouchCallout: 'none',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap pointer-events-none">{message.text}</p>
                      <div className="text-xs opacity-60 mt-1 pointer-events-none">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    className="flex justify-start touch-manipulation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="glass-light border border-white/10 rounded-2xl px-4 py-3 pointer-events-none">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <motion.div
                            className="w-2 h-2 bg-foreground/40 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-foreground/40 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-foreground/40 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                        <span className="text-xs text-foreground/60 ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-8 sm:px-10 py-8 border-t border-white/10">
                <div className="relative flex items-center gap-3 mx-2">
                  {/* Plus Icon */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-10 h-10 p-0 hover:bg-white/10 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  
                  {/* Input Field */}
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask anything about Alex..."
                      className="bg-white/5 border border-white/20 rounded-full px-4 py-3 pr-20 text-foreground placeholder:text-foreground/50 focus:border-white/30 focus:bg-white/10 transition-all duration-200"
                    />
                    
                    {/* Right Icons */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0 hover:bg-white/10"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0 hover:bg-white/10"
                      >
                        <AudioWaveform className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
                
                {/* Suggested Questions */}
                {messages.length <= 1 && (
                  <div className="flex flex-wrap gap-2 mt-6 mx-2">
                    {[
                      "What's Alex's experience?",
                      "What technologies does he use?",
                      "Tell me about his projects",
                      "Is he available for hire?"
                    ].map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInputValue(suggestion)}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 h-auto transition-all duration-200 hover:scale-105"
                        >
                          {suggestion}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}