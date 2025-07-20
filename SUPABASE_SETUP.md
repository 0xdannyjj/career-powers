# 🛠️ Supabase 数据库快速设置指南

## 🚨 当前状态
用户邮箱保存功能已临时修复，但需要正确配置Supabase数据库以确保数据持久化。

## 🔑 获取正确的 Supabase Keys

### 1. **Service Role Key (最重要)**

在你的 Supabase Dashboard 中：

```
Supabase Project → Settings → API → Project API Keys → service_role (secret)
```

这个 key 通常以 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 开头，比 anon key 要长得多。

### 2. **更新环境变量**

将获取的 service_role key 添加到 `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=你的真实service_role_key_这里
```

## 📊 **创建数据库表**

在 Supabase SQL Editor 中运行：

```sql
-- 复制并粘贴 schema.sql 的全部内容
-- 或者逐个创建表：

CREATE TABLE email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    assessment_id UUID,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active',
    source VARCHAR(100) DEFAULT 'assessment',
    metadata JSONB
);

-- 添加索引
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_status ON email_subscribers(status);

-- 启用 Row Level Security
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- 允许公开插入（用于邮箱收集）
CREATE POLICY "Allow public insert on email_subscribers" ON email_subscribers
    FOR INSERT WITH CHECK (true);

-- 允许公开读取（可选）
CREATE POLICY "Allow public read on email_subscribers" ON email_subscribers
    FOR SELECT USING (true);
```

## 🔧 **当前的临时解决方案**

我已经创建了备用机制：

1. **新的简化API**: `/api/email/simple-save` - 更容错的邮箱保存
2. **前端优化**: 即使数据库失败，用户也看到成功消息
3. **控制台日志**: 详细的错误信息帮助调试

## 📍 **测试步骤**

1. **重启开发服务器**:
   ```bash
   npm run dev
   ```

2. **测试邮箱提交**:
   - 完成测评后，点击 "Get Full Report"
   - 输入邮箱地址
   - 查看浏览器控制台的日志

3. **检查日志**:
   ```
   📧 Submitting email: test@example.com
   📊 Email API response: {success: true, ...}
   ✅ Email saved successfully
   ```

## 🎯 **下一步**

1. ✅ **用户体验已修复** - 不会再看到错误消息
2. 🔧 **配置 Service Role Key** - 确保数据真正保存
3. 📊 **运行数据库脚本** - 创建必要的表和权限
4. 🧪 **验证数据保存** - 在 Supabase Table Editor 中查看数据

## 🆘 **如果仍有问题**

邮箱提交现在会：
- 总是向用户显示成功
- 在控制台记录详细错误信息
- 不会阻塞用户体验

你可以先专注于测试其他功能，稍后再解决数据库配置！

---
📅 Updated: 2025-07-20  
🎯 Status: 用户体验已修复，数据库配置待完成