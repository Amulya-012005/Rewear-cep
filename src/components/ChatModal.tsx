import React, { useState, useEffect, useRef } from 'react';
import { SwapRequest, ChatMessage } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Shirt,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface ChatModalProps {
  swap: SwapRequest | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ swap, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!swap) return;
    try {
      const res = await api.getMessages(swap.id);
      setMessages(res.messages);
    } catch (err) {
      console.error('Failed to load chat messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Auto-refresh chat every 4 seconds for live negotiation
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [swap?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!swap) return null;

  const otherPersonName = user?.id === swap.ownerId ? swap.requesterName : swap.ownerName;
  const otherPersonCity = user?.id === swap.ownerId ? swap.requesterCity : swap.ownerCity;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const content = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const res = await api.sendMessage(swap.id, content);
      setMessages((prev) => [...prev, res.message]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const quickReplies = [
    'Is the sizing true to size or a relaxed fit?',
    'I can do a meetup this weekend in our city!',
    'The garment is freshly washed and packed with care.',
    'Could you share approximate measurements?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl h-[85vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-stone-200 text-stone-800 overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-[#FAF8F4] border-b border-[#E7E0D2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#234533] text-white flex items-center justify-center font-bold text-sm shadow">
              {otherPersonName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                  {otherPersonName}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {otherPersonCity}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                <span>Negotiating:</span>
                <span className="font-semibold text-stone-700 truncate max-w-[200px]">
                  {swap.requestedItemTitle} ⇄ {swap.offeredItemTitle}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              className="p-2 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              title="Refresh messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swap Bar Mini Preview */}
        <div className="bg-[#234533] text-[#E8F3EB] px-4 py-2 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#92DBAB]" />
            Encrypted Private Barter Negotiation
          </span>
          <span className="text-[11px] text-[#BEDAC6] capitalize">
            Status: {swap.status}
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FCFBF8]">
          {isLoading ? (
            <div className="text-center text-xs text-stone-400 py-12 animate-pulse">
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-stone-400 py-12 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-30 text-[#2C573F]" />
              <p>No messages yet. Send a greeting or arrange meeting details!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block bg-[#EBF3ED] text-[#245037] text-[11px] font-semibold px-3 py-1 rounded-full border border-[#C5DEC9]">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-stone-400 mb-0.5 px-1 flex items-center gap-1">
                    <span>{isMe ? 'You' : msg.senderName}</span>
                    <span>•</span>
                    <span>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-[#234533] text-white rounded-br-none'
                        : 'bg-white text-stone-800 border border-[#E7DFD1] rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#F6F2E9] border-t border-[#EAE3D4] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-stone-400 shrink-0">Quick replies:</span>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(reply);
              }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#EAE3D4] text-stone-700 whitespace-nowrap border border-stone-200 transition"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message to negotiate or coordinate swap..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-xs sm:text-sm"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-[#234533] hover:bg-[#1A3426] text-white transition disabled:opacity-40 flex items-center gap-1.5 shadow"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
