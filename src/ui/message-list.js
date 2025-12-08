import chatService from '../services/chat.js';

// 渲染单条消息
function renderMessage(msg) {
  const isCurrentUser = (msg.username === chatService.getUser());
  const time = new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return `
    <div class="fade-in mb-3 ${isCurrentUser ? 'text-right' : ''}">
      <div class="inline-block max-w-xs md:max-w-md lg:max-w-lg text-left">
        <div class="text-sm text-gray-500 mb-1">
          ${isCurrentUser ? '你' : msg.username} • ${time}
        </div>
        <div class="p-3 rounded-2xl ${isCurrentUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}">
          ${escapeHtml(msg.message).replace(/\n/g, '<br>')}
        </div>
      </div>
    </div>
  `;
}

// 简单的HTML转义，防止XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 渲染整个消息列表
export function renderMessageList(messages = []) {
  const container = document.getElementById('message-list');
  if (!container) return;

  // 如果是首次渲染或加载历史，替换全部内容
  if (messages.length > 1 || container.children.length === 0) {
    container.innerHTML = messages.map(renderMessage).join('');
  } else {
    // 否则只追加最新的一条消息
    container.innerHTML += renderMessage(messages[0]);
  }

  // 滚动到底部
  container.scrollTop = container.scrollHeight;
}