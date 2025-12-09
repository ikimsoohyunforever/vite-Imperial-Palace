import chatService from '../services/chat.js';
import authService from '../services/auth.js';

export function renderChatUI() {
  const user = authService.getUser();
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || '用户';

  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- 移动端优化布局 -->
    <div class="flex flex-col h-screen max-h-screen bg-white">
      <!-- 顶部导航 -->
      <header class="sticky top-0 z-10 px-4 py-3 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg bg-black flex items-center justify-center mr-3">
              <span class="text-white text-sm">💬</span>
            </div>
            <div>
              <h1 class="font-medium text-gray-900">简聊</h1>
              <p class="text-xs text-gray-500">${username}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button id="logout-btn" class="text-gray-600 hover:text-gray-900 p-2">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>

      <!-- 消息区域 -->
      <main class="flex-1 overflow-hidden">
        <div id="message-list" class="h-full overflow-y-auto p-4 space-y-4">
          <!-- 初始加载状态 -->
          <div class="flex justify-center items-center h-32">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black mb-2"></div>
              <p class="text-sm text-gray-500">加载消息中...</p>
            </div>
          </div>
        </div>
      </main>

      <!-- 输入区域 -->
      <footer class="sticky bottom-0 border-t border-gray-200 bg-white p-3">
        <div class="flex items-center space-x-2">
          <input type="text" id="message-input"
            class="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
            placeholder="输入消息..."
            autocomplete="off">
          <button id="send-btn" 
            class="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fas fa-paper-plane text-sm"></i>
          </button>
        </div>
        <div class="mt-2 text-center">
          <span id="status-indicator" class="inline-flex items-center text-xs text-gray-500">
            <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            <span>已连接</span>
          </span>
        </div>
      </footer>
    </div>
  `;

  // 绑定退出登录
  document.getElementById('logout-btn').onclick = async () => {
    if (confirm('确定要退出登录吗？')) {
      await authService.signOut();
      window.location.reload();
    }
  };

  // 绑定发送消息
  const inputEl = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');

  const sendMessage = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
      await chatService.sendMessage(text);
      inputEl.focus();
    } catch (error) {
      alert(`发送失败: ${error.message}`);
      inputEl.value = text; // 恢复文本
    }
    
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fas fa-paper-plane text-sm"></i>';
  };

  sendBtn.onclick = sendMessage;
  inputEl.onkeypress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 自动聚焦输入框
  setTimeout(() => inputEl.focus(), 300);

  return { inputEl, sendBtn };
}