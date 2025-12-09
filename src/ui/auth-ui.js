import authService from '../services/auth.js';

export function renderAuthUI(onLoginSuccess) {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- 全屏居中容器 -->
    <div class="min-h-screen flex items-center justify-center p-6">
      <div class="w-full max-w-sm">
        <!-- 品牌标识 -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white text-2xl mb-4">
            💬
          </div>
          <h1 class="text-3xl font-light text-gray-900">Emperor and eunuch</h1>
          <p class="text-gray-500 mt-2">ฮ่องเต้และขันที</p>
        </div>

        <!-- 表单容器 -->
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <!-- 动态表单区域 -->
          <div id="form-container">
            <!-- 默认显示登录表单 -->
            ${renderLoginForm()}
          </div>

          <!-- 切换链接 -->
          <div class="mt-8 pt-6 border-t border-gray-100 text-center">
            <p id="toggle-text" class="text-gray-600 text-sm">
              还没有账户？ 
              <button id="toggle-btn" class="text-black font-medium hover:underline">
                注册新账户
              </button>
            </p>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-400">输入邮箱和密码即可开始聊天</p>
        </div>
      </div>
    </div>
  `;

  let isLoginForm = true;
  const toggleBtn = document.getElementById('toggle-btn');
  const toggleText = document.getElementById('toggle-text');
  const formContainer = document.getElementById('form-container');

  // 切换登录/注册表单
  toggleBtn.onclick = () => {
    isLoginForm = !isLoginForm;
    
    if (isLoginForm) {
      formContainer.innerHTML = renderLoginForm();
      toggleText.innerHTML = '还没有账户？ <button id="toggle-btn" class="text-black font-medium hover:underline">注册新账户</button>';
    } else {
      formContainer.innerHTML = renderSignupForm();
      toggleText.innerHTML = '已有账户？ <button id="toggle-btn" class="text-black font-medium hover:underline">直接登录</button>';
    }
    
    // 重新绑定事件
    document.getElementById('toggle-btn').onclick = toggleBtn.onclick;
    bindFormEvents(onLoginSuccess);
  };

  // 绑定表单事件
  bindFormEvents(onLoginSuccess);
}

function renderLoginForm() {
  return `
    <form id="auth-form" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
        <input type="email" id="email" required autocomplete="email"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="name@example.com">
      </div>
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <span class="text-xs text-gray-500">至少6位</span>
        </div>
        <input type="password" id="password" required minlength="6"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="••••••">
      </div>
      <button type="submit" id="submit-btn"
        class="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
        登录
      </button>
    </form>
  `;
}

function renderSignupForm() {
  return `
    <form id="auth-form" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">用户名</label>
        <input type="text" id="username" required autocomplete="username"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="如何称呼你">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
        <input type="email" id="email" required autocomplete="email"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="name@example.com">
      </div>
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">密码</label>
          <span class="text-xs text-gray-500">至少6位</span>
        </div>
        <input type="password" id="password" required minlength="6"
          class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="••••••">
      </div>
      <button type="submit" id="submit-btn"
        class="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition">
        注册
      </button>
    </form>
  `;
}

function bindFormEvents(onLoginSuccess) {
  const form = document.getElementById('auth-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'mt-4 text-sm text-center';
  form.appendChild(messageDiv);

  form.onsubmit = async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username')?.value;
    
    const isLogin = !document.getElementById('username'); // 是否有用户名字段
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>处理中...';
    messageDiv.textContent = '';
    messageDiv.className = 'mt-4 text-sm text-center text-blue-600';

    try {
      if (isLogin) {
        await authService.signIn(email, password);
        messageDiv.textContent = '登录成功！正在进入...';
        messageDiv.className = 'mt-4 text-sm text-center text-green-600';
      } else {
        await authService.signUp(email, password, username);
        messageDiv.textContent = '注册成功！正在登录...';
        messageDiv.className = 'mt-4 text-sm text-center text-green-600';
      }
      
      setTimeout(() => onLoginSuccess(), 800);
    } catch (error) {
      messageDiv.textContent = `错误: ${error.message}`;
      messageDiv.className = 'mt-4 text-sm text-center text-red-600';
      submitBtn.disabled = false;
      submitBtn.innerHTML = isLogin ? '登录' : '注册';
    }
  };
}