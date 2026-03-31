'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '@/lib/types';
import HeartButton from './HeartButton';
import { MessageCircle, X, Send, Bot, User, Loader2, ExternalLink, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  resorts?: Listing[];
  requires_manual_search?: boolean;
}

const ManualSearchForm = ({ onSearch }: { onSearch: (filters: any) => void }) => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: location || null,
      category: category || null,
      max_price: maxPrice ? parseInt(maxPrice) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-100 rounded-xl p-4 my-3 space-y-4">
      <h4 className="font-bold text-sm text-blue-800">Or, search manually:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input 
          type="text" 
          placeholder="Location (e.g., Goa)" 
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full bg-white border-blue-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        />
        <select 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="w-full bg-white border-blue-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        >
          <option value="">Any Category</option>
          <option value="BeachFront">BeachFront</option>
          <option value="Mountain">Mountain</option>
          <option value="Hill Station">Hill Station</option>
          <option value="Treehouse">Treehouse</option>
          <option value="Island">Island</option>
          <option value="Desert">Desert</option>
        </select>
        <input 
          type="number" 
          placeholder="Max price (e.g., 15000)" 
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-full bg-white border-blue-200 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
        <Search size={16} />
        Find Stays
      </button>
    </form>
  );
};

const ResortCard = ({ resort }: { resort: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 my-3"
  >
    <div className="relative aspect-[16/9] overflow-hidden">
      <img 
        src={resort.image?.src || resort.image} 
        alt={resort.title} 
        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-2 right-2">
        <HeartButton listingId={resort.id} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <p className="text-white font-medium text-sm truncate">{resort.title}</p>
      </div>
    </div>
    <div className="p-3 space-y-2">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          {resort.location}
        </span>
        <span className="font-semibold text-blue-600">₹{resort.price?.toLocaleString()}</span>
      </div>
      <Link 
        to={`/listings/${resort.id}`} 
        className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 rounded-lg text-sm transition-colors duration-200"
      >
        View Details
        <ExternalLink size={14} />
      </Link>
    </div>
  </motion.div>
);

const AiResortChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: 'Hi! I\'m Wonder Buddy, your AI luxury travel concierge. How can I make your dream vacation a reality today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const examplePrompts = [
    "Beach resort in Goa under 12000",
    "Mountain escape in Manali for 4 people",
    "Luxury heritage stay in Udaipur",
    "Treehouse in Wayanad with WiFi",
    "Desert camp in Jaisalmer under 8000"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % examplePrompts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (messages.length > 15) {
      setMessages(messages.slice(messages.length - 15));
    }
  }, [messages]);

  const handleSend = async (textToSend?: string, filters?: any) => {
    const finalInput = textToSend || input;
    if (!finalInput.trim() && !filters) return;
    
    if (finalInput) {
      const userMessage: Message = { sender: 'user', text: finalInput };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
    }
    setIsLoading(true);

    try {
      const body = filters ? { filters } : { message: finalInput };
      const response = await fetch('/api/ai-resort-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to fetch resorts');

      const data = await response.json();
      if (!data) throw new Error('No data received from AI search');

      const aiMessage: Message = {
        sender: 'ai',
        text: data.message || "I found some exquisite options for you!",
        resorts: Array.isArray(data.resorts) ? data.resorts : [],
        requires_manual_search: !!data.requires_manual_search,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        sender: 'ai', 
        text: 'I apologize, but I\'m having trouble accessing my resort collection right now. Please try again in a moment.',
        requires_manual_search: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-[9999]">
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex items-center gap-2 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex items-center gap-2"
            >
              <MessageCircle size={24} />
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-medium">
                Wonder Buddy
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white flex justify-between items-center shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Wonder Buddy</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0"><Bot size={18} /></div>}
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    {msg.requires_manual_search && <ManualSearchForm onSearch={(filters) => handleSend(undefined, filters)} />}
                    {msg.resorts && msg.resorts.length > 0 && (
                      <div className="mt-3">
                        {msg.resorts.map(resort => (
                          <ResortCard key={resort.id} resort={resort} />
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0"><User size={18} /></div>}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0"><Bot size={18} /></div>
                  <div className="max-w-[80%] p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500 italic">Wonder Buddy is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={examplePrompts[promptIndex]}
                  className="w-full bg-gray-50 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 outline-none text-gray-800 placeholder:text-gray-400"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiResortChat;

