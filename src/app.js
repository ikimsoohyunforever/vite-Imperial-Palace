import chatService from './services/chat.js';
import { setupInputArea } from './ui/input-area.js';
import { renderMessageList } from './ui/message-list.js';

// 渲染应用主界面框架
function renderAppLayout() {
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = `
    <header class="mb-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">💬 我们的聊天室</h1>
      <p class="text-gray-600">一个简单的实时群聊应用</p>
    </header>

    <main class="flex flex-col lg:flex-row gap-6">
      <!-- 左侧：聊天主区域 -->
      <div class="lg:w-3/4">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-4 border-b bg-gray-50">
            <h2 class="font-semibold text-gray-700">
              <i class="fas fa-comments mr-2"></i>聊天区
            </h2>
          </div>
          <!-- 消息列表容器 -->
          <div id="message-list" class="message-list p-4 h-96 overflow-y-auto"></div>
        </div>
        <!-- 输入区域容器 -->
        <div id="input-area" class="mt-4"></div>
      </div>

      <!-- 右侧：信息面板 -->
      <div class="lg:w-1/4">
        <div class="bg-white rounded-xl shadow-lg p-5 sticky top-4">
          <h3 class="font-bold text-lg mb-4 text-gray-700 border-b pb-2">
            <i class="fas fa-info-circle mr-2"></i>信息
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">设置你的昵称</label>
              <div class="flex">
                <input type="text" id="username-input" placeholder="输入昵称"
                  class="flex-grow p-2 border rounded-l-lg">
                <button id="set-username-btn"
                  class="bg-secondary text-white px-4 rounded-r-lg hover:bg-green-600">
                  设置
                </button>
              </div>
            </div>
            <div>
              <button id="load-history-btn"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg transition">
                <i class="fas fa-history mr-2"></i>加载更多历史消息
              </button>
            </div>
            <div class="pt-4 border-t">
              <p class="text-sm text-gray-600">
                <i class="fas fa-lightbulb mr-2"></i>
                提示：这是一个简易聊天室，所有消息公开可见。请勿发送敏感信息。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="mt-8 text-center text-gray-500 text-sm">
      <p>基于 Supabase 实时功能构建 | 使用 Vite + Tailwind CSS</p>
    </footer>
  `;
}

// 初始化聊天室
export async function initApp() {
  // 1. 渲染界面框架
  renderAppLayout();

  // 2. 设置用户（从本地存储或提示输入）
  let username = chatService.getUser();
  if (!username) {
    username = prompt('欢迎！请输入你的昵称：', `用户${Math.floor(Math.random() * 1000)}`);
    if (!username) username = '匿名用户';
    chatService.setUser(username);
    alert(`昵称已设置为: ${username}`);
  }

  // 3. 初始化聊天服务并加载历史
  await chatService.loadHistory();
  const historyMessages = chatService.messages;
  renderMessageList(historyMessages);

  // 4. 设置输入区域
  setupInputArea();

  // 5. 订阅新消息
  chatService.subscribeToMessages((newMessage) => {
    renderMessageList([newMessage]);
  });

  // 6. 绑定右侧面板按钮事件
  document.getElementById('set-username-btn').addEventListener('click', () => {
    const input = document.getElementById('username-input');
    const newName = input.value.trim();
    if (newName) {
      chatService.setUser(newName);
      alert(`昵称已更改为: ${newName}`);
      location.reload(); // 简单起见，刷新以更新所有显示
    }
  });

  document.getElementById('load-history-btn').addEventListener('click', async () => {
    const btn = document.getElementById('load-history-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>加载中...';
    await chatService.loadHistory(100);
    renderMessageList(chatService.messages);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-history mr-2"></i>加载更多历史消息';
  });

  // 7. 将用户名填入输入框
  document.getElementById('username-input').value = username;

  console.log('聊天室初始化完成！当前用户：', username);
}