import supabase from '../lib/supabase.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.loadUser();
  }

  // 从本地存储加载用户
  async loadUser() {
    const { data: { session } } = await supabase.auth.getSession();
    this.currentUser = session?.user || null;
    return this.currentUser;
  }

  // 邮箱密码注册
  async signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username } // 将用户名存储在用户的元数据中
      }
    });
    if (error) throw error;
    this.currentUser = data.user;
    return data;
  }

  // 邮箱密码登录
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    this.currentUser = data.user;
    return data;
  }

  // 退出登录
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.currentUser = null;
  }

  // 获取当前用户
  getUser() {
    return this.currentUser;
  }

  // 监听认证状态变化
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      callback(event, this.currentUser);
    });
  }
}

const authService = new AuthService();
export default authService;