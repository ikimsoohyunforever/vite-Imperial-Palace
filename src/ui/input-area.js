import chatService from '../services/chat.js';

// 创建并渲染输入区域
export function setupInputArea(onSendCallback) {
  const container = document.getElementById('input-area');

  container.innerHTML = `
    <div class="flex flex-col space-y-3 p-4 bg-white rounded-lg shadow">
      <div class="flex space-x-2">
        <input
          type="text"
          id="message-input"
          placeholder="输入消息... (按 Enter 发送)"
          class="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          id="send-button"
          class="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
      <div class="flex justify-between text-sm text-gray-500">
        <span id="status-indicator">
          <i class="fas fa-circle text-green-500 mr-1"></i>连接正常
        </span>
        <span>当前用户: <strong id="current-user-display">未设置</strong></span>
      </div>
    </div>
  `;

  const inputEl = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-button');
  const userDisplay = document.getElementById('current-user-display');

  // 更新当前用户显示
  const currentUser = chatService.getUser();
  if (currentUser) {
    userDisplay.textContent = currentUser;
    inputEl.placeholder = `以 ${currentUser} 的身份发言...`;
  }

  // 发送消息函数
  const sendMessage = async () => {
    const text = inputEl.value.trim();
    if (!text) return;

    sendBtn.disabled = true;
    const result = await chatService.sendMessage(text);

    if (result.success) {
      inputEl.value = ''; // 清空输入框
      inputEl.focus();
    } else {
      alert(`发送失败: ${result.error}`);
    }
    sendBtn.disabled = false;
  };

  // 绑定发送按钮事件
  sendBtn.addEventListener('click', sendMessage);

  // 绑定回车键发送
  inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // 定期更新在线状态指示器
  function updateStatusIndicator() {
    const indicator = document.getElementById('status-indicator');
    const isOnline = chatService.getOnlineStatus();
    if (isOnline) {
      indicator.innerHTML = '<i class="fas fa-circle text-green-500 mr-1"></i>连接正常';
    } else {
      indicator.innerHTML = '<i class="fas fa-circle text-red-500 mr-1"></i>连接断开，尝试重连中...';
    }
  }
  setInterval(updateStatusIndicator, 2000);
}