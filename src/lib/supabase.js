import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_CONFIG } from './config.js';

// 创建并导出一个全局可用的 Supabase 客户端实例
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
  auth: { persistSession: false },
  // ！！！ 重点：添加并配置 realtime 选项 ！！！
  realtime: {
    params: {
      // 确保使用最新的实时API版本
      apikey: SUPABASE_CONFIG.anonKey,
    }
  }
});

export default supabase;