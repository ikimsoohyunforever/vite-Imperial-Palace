// 应用主入口文件
import { initApp } from './app.js';

// 当页面完全加载后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  // 在实际应用中，可以在这里向用户显示友好的错误提示
});

// 监听网络状态变化
window.addEventListener('online', () => {
  console.log('网络已恢复');
});

window.addEventListener('offline', () => {
  console.log('网络已断开');
  alert('网络连接已断开，请检查后重试。');
});