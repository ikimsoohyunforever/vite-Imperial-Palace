import supabase from '../lib/supabase.js';
import authService from './auth.js';

class ChatService {
  constructor() {
    this.messages = [];
    this.subscription = null;
  }

  // 发送消息（现在关联用户ID）
  async sendMessage(text) {
    const user = authService.getUser();
    if (!user || !text.trim()) {
      throw new Error('未登录或消息为空');
    }

    const { error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,           // 关联用户ID
        username: user.user_metadata?.username || user.email, // 从元数据取用户名
        message: text.trim(),
        created_at: new Date().toISOString()
      });

    if (error) throw error;
    return true;
  }

  // 加载历史消息
  async loadHistory(limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        username,
        message,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    this.messages = data.reverse();
    return this.messages;
  }

  // 订阅新消息
  subscribeToMessages(callback) {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }

    this.subscription = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new;
          this.messages.push(newMessage);
          if (this.messages.length > 100) this.messages.shift();
          if (callback) callback(newMessage);
        }
      )
      .subscribe();

    return this.subscription;
  }
}

const chatService = new ChatService();
export default chatService;