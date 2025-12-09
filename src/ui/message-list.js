import authService from '../services/auth.js';

export function renderMessageList(messages = []) {
  const container = document.getElementById('message-list');
  if (!container) return;

  // 清空加载状态
  if (container.innerHTML.includes('加载消息中')) {
    container.innerHTML = '';
  }

  const currentUserId = authService.getUser()?.id;
  
  messages.forEach(msg => {
    const isCurrentUser = (msg.user_id === currentUserId);
    const time = formatTime(msg.created_at);
    
    const messageEl = document.createElement('div');
    messageEl.className = `message-enter ${isCurrentUser ? 'text-right' : ''}`;
    
    messageEl.innerHTML = `
      <div class="inline-block max-w-[85%] text-left">
        ${!isCurrentUser ? `<div class="text-xs text-gray-600 mb-1 px-2">${msg.username}</div>` : ''}
        <div class="px-4 py-3 rounded-2xl ${isCurrentUser ? 
          'bg-black text-white rounded-br-none' : 
          'bg-gray-100 text-gray-800 rounded-bl-none'}">
          ${escapeHtml(msg.message)}
        </div>
        <div class="text-xs text-gray-400 mt-1 px-2">${time}</div>
      </div>
    `;
    
    // 如果已有相同ID的消息，不重复添加
    if (!container.querySelector(`[data-msg-id="${msg.id}"]`)) {
      messageEl.setAttribute('data-msg-id', msg.id);
      container.appendChild(messageEl);
    }
  });

  // 平滑滚动到底部
  setTimeout(() => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  }, 50);
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}