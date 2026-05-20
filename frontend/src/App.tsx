import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { askQuestion } from './api/ragApi';
import type { Source } from './api/ragApi';
import './App.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (question: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await askQuestion(question);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Medical RAG Assistant</h1>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Clear Chat
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Medical RAG Assistant</h2>
              <p className="mb-6">Ask me any medical question and I'll answer based on the medical textbook.</p>
              <div className="grid gap-3 max-w-md mx-auto">
                <button
                  onClick={() => handleSend('What is chemotherapy?')}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  What is chemotherapy?
                </button>
                <button
                  onClick={() => handleSend('What is surgery?')}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  What is surgery?
                </button>
                <button
                  onClick={() => handleSend('Explain cancer metastasis')}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Explain cancer metastasis
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-t border-red-200 px-4 py-2">
          <div className="max-w-3xl mx-auto text-sm text-red-600">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

export default App;
