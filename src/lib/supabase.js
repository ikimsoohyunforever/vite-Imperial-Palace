import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_CONFIG } from './config.js';

// 创建Supabase客户端，这次启用持久化会话
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: {
    persistSession: true, // 重要：启用会话持久化，用户刷新页面后保持登录
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: { params: { apikey: SUPABASE_CONFIG.anonKey } }
});

export default supabase;