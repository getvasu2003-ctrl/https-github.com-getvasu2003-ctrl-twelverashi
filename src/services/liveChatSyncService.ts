import { ChatMessage } from '../types/astrology.ts';

export interface ChatSessionMeta {
  channelId: string;
  clientName: string;
  clientRashi: string;
  astrologerId: string;
  astrologerName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  messageCount?: number;
  isAstrologerConnected: boolean;
  isUserConnected: boolean;
  isTyping?: boolean;
  typingSender?: string;
  createdAt: number;
}

class LiveChatSyncService {
  private activeListeners = new Map<string, (messages: ChatMessage[], meta?: any) => void>();
  private pollIntervals = new Map<string, any>();
  private lastMessageTimestamps = new Map<string, number>();

  /**
   * Initializes or connects to a consultation chat channel
   */
  async initSession(payload: {
    channelId: string;
    clientName: string;
    clientRashi?: string;
    astrologerId: string;
    astrologerName: string;
    role: 'user' | 'astrologer';
  }): Promise<{ success: boolean; messages: ChatMessage[]; isAstrologerConnected: boolean }> {
    try {
      const res = await fetch('/api/chat/session/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to init live chat session on server:', err);
    }
    return { success: true, messages: [], isAstrologerConnected: false };
  }

  /**
   * Sends a message to the shared channel
   */
  async sendMessage(payload: {
    channelId: string;
    sender: 'user' | 'astrologer';
    senderName: string;
    text: string;
    remedyDetails?: ChatMessage['remedyDetails'];
  }): Promise<ChatMessage | null> {
    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return data.message;
      }
    } catch (err) {
      console.warn('Failed to dispatch live chat message:', err);
    }
    return null;
  }

  /**
   * Broadcasts typing status
   */
  async setTyping(channelId: string, sender: 'user' | 'astrologer', isTyping: boolean) {
    try {
      await fetch('/api/chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, sender, isTyping }),
      });
    } catch {
      // Non-blocking
    }
  }

  /**
   * Subscribes to real-time updates for a channel using low-latency polling (1.2s)
   */
  subscribe(
    channelId: string,
    role: 'user' | 'astrologer',
    callback: (messages: ChatMessage[], meta: { isTyping: boolean; typingSender?: string; isAstrologerConnected: boolean }) => void
  ): () => void {
    this.activeListeners.set(channelId, callback);

    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/chat/messages?channelId=${encodeURIComponent(channelId)}&role=${role}`);
        if (res.ok) {
          const data = await res.json();
          callback(data.messages || [], {
            isTyping: Boolean(data.isTyping),
            typingSender: data.typingSender,
            isAstrologerConnected: Boolean(data.isAstrologerConnected),
          });
        }
      } catch (err) {
        // Silently retry on next tick
      }
    };

    // Immediate first fetch
    fetchLatest();

    // Poll every 1200ms for seamless real-time sync across separate tabs/devices
    const timer = setInterval(fetchLatest, 1200);
    this.pollIntervals.set(channelId, timer);

    return () => {
      clearInterval(timer);
      this.pollIntervals.delete(channelId);
      this.activeListeners.delete(channelId);
    };
  }

  /**
   * Fetches all active chat sessions (for the Astrologer Partner portal)
   */
  async getActiveSessions(astrologerId?: string): Promise<ChatSessionMeta[]> {
    try {
      const res = await fetch(`/api/chat/sessions${astrologerId ? `?astrologerId=${encodeURIComponent(astrologerId)}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        return data.sessions || [];
      }
    } catch (err) {
      console.warn('Failed to fetch active chat sessions:', err);
    }
    return [];
  }
}

export const liveChatSyncService = new LiveChatSyncService();
