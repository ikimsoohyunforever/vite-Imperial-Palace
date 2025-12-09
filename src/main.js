// src/main.js - 完全重写，增强错误处理
console.log('=== main.js 开始执行 ===');

async function bootstrap() {
  try {
    console.log('1. 开始导入 app.js...');
    
    // 使用动态导入，确保模块加载成功
    const appModule = await import('./app.js');
    console.log('2. app.js 导入成功');
    
    // 检查 initApp 函数是否存在
    if (typeof appModule.initApp !== 'function') {
      throw new Error('app.js 没有导出 initApp 函数');
    }
    
    console.log('3. initApp 函数存在，开始执行...');
    
    // 执行 initApp 并等待完成
    const initPromise = appModule.initApp();
    
    // 确保返回的是 Promise
    if (initPromise && typeof initPromise.then === 'function') {
      await initPromise;
      console.log('4. initApp() 执行完成');
    } else {
      console.log('4. initApp() 执行完成（非Promise）');
    }
    
  } catch (error) {
    console.error('!!! 应用启动失败 !!!', error);
    
    // 显示友好的错误界面
    showErrorUI(error);
  }
}

function showErrorUI(error) {
  const app = document.getElementById('app');
  if (!app) return;
  
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full">
        <div class="text-red-500 text-4xl mb-4 text-center">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">应用启动失败</h1>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <p class="text-gray-700 font-medium mb-2">错误信息：</p>
          <code class="text-sm text-red-600">${error.message}</code>
        </div>
        
        <div class="space-y-3">
          <button onclick="location.reload()" 
            class="w-full bg-black text-white py-3 rounded-lg font-medium">
            重新加载
          </button>
          <button onclick="toggleDebug()" 
            class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-medium">
            显示调试信息
          </button>
        </div>
        
        <div id="debug-info" class="hidden mt-6">
          <pre class="text-xs bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto">${error.stack}</pre>
        </div>
      </div>
    </div>
  `;
  
  window.toggleDebug = function() {
    const debugEl = document.getElementById('debug-info');
    debugEl.classList.toggle('hidden');
  };
}

// 启动应用
console.log('=== 开始启动应用 ===');

// 确保DOM准备就绪
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded 事件触发');
    bootstrap();
  });
} else {
  console.log('DOM已就绪，立即启动');
  bootstrap();
}

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误捕获:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
});