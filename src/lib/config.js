// 安全地从环境变量中读取配置（部署时由Azure提供）
export const SUPABASE_CONFIG = {
  // 注意：这里读取的是 *环境变量*，不是写死的字符串
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
};

// 应用通用配置（保持不变）
export const APP_CONFIG = {
  appName: '我们的聊天室',
  maxMessages: 100,
  reconnectDelay: 3000,
};

// 开发环境调试：如果环境变量没读到，在控制台给出明确提示（这行在生产环境无效）
if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey) {
  console.warn(
    'Supabase 环境变量未设置。\n' +
    '在本地开发时，请创建 .env.local 文件并设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY。\n' +
    '在部署平台（如Azure），请在配置设置中添加这两个环境变量。'
  );
}