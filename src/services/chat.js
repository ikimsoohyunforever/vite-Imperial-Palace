import supabase from '../lib/supabase.js';
import { APP_CONFIG } from '../lib/config.js';

class ChatService {
  constructor() {
    this.messages = [];
    this.subscription = null;
    this.currentUser = localStorage.getItem('chat_username') || '';
    this.isOnline = true;
  }

  // 设置当前用户名
  setUser(username) {
    this.currentUser = username;
    localStorage.setItem('chat_username', username);
    return username;
  }

  // 获取当前用户名
  getUser() {
    return this.currentUser;
  }

  // 加载历史消息
  async loadHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      // 将数据反转，让最早的消息在前
      this.messages = data.reverse();
      return this.messages;
    } catch (error) {
      console.error('加载历史失败:', error);
      return [];
    }
  }

  // 发送新消息
  async sendMessage(text) {
    if (!text.trim() || !this.currentUser) {
      return { success: false, error: '消息为空或用户未设置' };
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          username: this.currentUser,
          message: text.trim(),
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('发送失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 订阅新消息
  subscribeToMessages(callback) {
    // 如果已有订阅，先取消
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }

    // 创建新的实时订阅
    this.subscription = supabase
      .channel('public:messages')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new;
          this.messages.push(newMessage);
          // 如果消息数量超过限制，移除最旧的一条
          if (this.messages.length > APP_CONFIG.maxMessages) {
            this.messages.shift();
          }
          if (callback) callback(newMessage);
        }
      )
      .subscribe((status) => {
        this.isOnline = (status === 'SUBSCRIBED');
      });

    return this.subscription;
  }

  // 获取在线状态
  getOnlineStatus() {
    return this.isOnline;
  }
}

// 导出一个单例实例，全局使用同一个聊天服务
const chatService = new ChatService();
export default chatService;