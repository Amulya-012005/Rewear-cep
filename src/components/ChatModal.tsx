import React, { useState, useEffect, useRef } from 'react';
import { SwapRequest, ChatMessage } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  X,
  Send,
  MessageSquare,
  MapPin,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl h-[85vh] flex flex-col bg-[#FFF9E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-[#FEF4D5] border-b border-[#E8D494] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183E2A] text-[#FDE68A] flex items-center justify-center font-bold text-sm shadow-sm border border-[#D4AF37]/40">
              {otherPersonName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1A2E22] leading-tight">
                  {otherPersonName}
                </h3>
                <span className="text-[10px] bg-[#183E2A] text-[#FDE68A] px-2 py-0.5 rounded font-bold flex items-center gap-0.5 border border-[#D4AF37]/30">
                  <MapPin className="w-2.5 h-2.5" />
                  {otherPersonCity}
                </span>
              </div>
              <p className="text-[11px] text-[#6B5B30] mt-0.5 flex items-center gap-1 font-medium">
                <span>Negotiating:</span>
                <span className="font-bold text-[#1A2E22] truncate max-w-[200px]">
                  {swap.requestedItemTitle} ⇄ {swap.offeredItemTitle}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMessages}
              className="p-2 text-[#8A6A1C] hover:text-[#543D10] rounded-xl hover:bg-[#FCEFC7] transition"
              title="Refresh messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#FFF9E6] hover:bg-[#FCEFC7] flex items-center justify-center text-[#8A6A1C] transition border border-[#EED895]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swap Bar Mini Preview */}
        <div className="bg-[#183E2A] text-[#FDF0CD] px-4 py-2 text-xs flex items-center justify-between border-y border-[#D4AF37]/30">
          <span className="flex items-center gap-1.5 font-bold text-[#FDE68A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FDE68A]" />
            Encrypted Private Barter Negotiation
          </span>
          <span className="text-[11px] text-[#E5D7B3] capitalize font-medium">
            Status: {swap.status}
          </span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FEF6DB]">
          {isLoading ? (
            <div className="text-center text-xs text-[#7A6430] py-12 animate-pulse">
              Loading chat history...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-[#6B5B30] py-12 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-[#8A6A1C]" />
              <p>No messages yet. Send a greeting or arrange meeting details!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block bg-[#FEF4D5] text-[#8A6A1C] text-[11px] font-bold px-3 py-1 rounded-full border border-[#E8D494]">
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
                  <div className="text-[10px] text-[#7A6430] mb-0.5 px-1 flex items-center gap-1 font-medium">
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
                        ? 'bg-[#183E2A] text-[#FDE68A] rounded-br-none border border-[#D4AF37]/40'
                        : 'bg-[#FFF9E6] text-[#1A2E22] border border-[#EED895] rounded-bl-none'
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
        <div className="px-4 py-2 bg-[#FEF4D5] border-t border-[#E8D494] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-[#7A6430] shrink-0 font-bold">Quick replies:</span>
          {quickReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => {
                setInputText(reply);
              }}
              className="px-2.5 py-1 rounded-full bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] whitespace-nowrap border border-[#EED895] transition font-medium"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-[#FFF9E6] border-t border-[#EED895] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message to negotiate or coordinate swap..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-xs sm:text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] transition disabled:opacity-40 flex items-center gap-1.5 shadow-md border border-[#D4AF37]/40"
          >
            <Send className="w-4 h-4 text-[#FDE68A]" />
            <span className="hidden sm:inline text-xs font-bold">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
