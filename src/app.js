import authService from './services/auth.js';
import chatService from './services/chat.js';
import { renderAuthUI } from './ui/auth-ui.js';
import { renderChatUI } from './ui/chat-ui.js';
import { renderMessageList } from './ui/message-list.js'; // 需要稍后创建

export async function initApp() {  // ⬅️ 这行必须有 `export`
  // 监听认证状态变化
  authService.onAuthStateChange((event, user) => {
    console.log('认证状态变化:', event, user?.email);
    if (event === 'SIGNED_IN') {
      startChatApp();
    } else if (event === 'SIGNED_OUT') {
      renderAuthUI(startChatApp);
    }
  });

  // 初始加载：检查是否已登录
  const user = await authService.loadUser();
  if (user) {
    startChatApp();
  } else {
    renderAuthUI(startChatApp);
  }
}

async function startChatApp() {
  // 渲染聊天界面
  renderChatUI();

  // 加载历史消息
  const messages = await chatService.loadHistory();
  renderMessageList(messages);

  // 订阅新消息
  chatService.subscribeToMessages((newMessage) => {
    renderMessageList([newMessage]);
  });
}