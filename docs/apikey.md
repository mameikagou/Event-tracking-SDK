
[toc]

## 安全传递敏感信息

1. 后端不返回敏感信息，前端需要自己保存
也就是前端需要自己保存apikey， 后端不返回apikey，那如何保证前端传递的apikey是不会截获？

2. 通过请求头（Authorization Header）传递apikey

apikey存在前端的localStorage中， 每次请求的时候， 前端需要从localStorage中获取apikey， 然后通过请求头（Authorization Header）传递给后端

```ts
// 前端发送请求示例
const headers = {
    'Authorization': 'Bearer sk-xxxxxxxxxxxxxxxxxxxxx',
    'Content-Type': 'application/json'
};

fetch('api/endpoint', {
    method: 'GET',
    headers: headers
});
```

3. 使用http-only cookie传递apikey

```ts
// 后端设置 Cookie（Node.js Express 示例）
app.post('/login', (req, res) => {
    // 验证登录成功后...
    res.cookie('apiKey', 'sk-xxxxxxxxxxxxxxxxxxxxx', {
        httpOnly: true,           // 防止客户端 JS 访问, 防止脚本攻击
        secure: true,             // 只在 HTTPS 连接中传输
        sameSite: 'strict',       // 防止 CSRF 攻击
        maxAge: 24 * 60 * 60 * 1000, // Cookie 有效期（例如24小时）
        path: '/'                 // Cookie 生效的路径
    });
    res.json({ success: true });
});
```

4. 结合使用：
```ts
// 设置 refresh token 在 HttpOnly Cookie 中
    res.cookie('refreshToken', 'rt-xxxxxxxxxxxxxxxxxxxxx', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000  // 7天
    });

    // 返回 access token
    res.json({
        code: 200,
        message: "登录成功",
        data: {
            accessToken: 'sk-xxxxxxxxxxxxxxxxxxxxx',
            expiresIn: 3600  // 1小时后过期
        }
    });
```


安全性问题：
- 抓包风险
使用 Charles、Fiddler、Wireshark 等工具都可以抓取 HTTP 请求
请求头中的信息（包括 Authorization）都是可见的
即使是 HTTPS，如果中间人攻击（安装了抓包工具的证书），依然可以查看

- 浏览器开发工具
Network 面板可以看到所有请求头信息
包括 Authorization、Cookie 等敏感信息都可见


解决方式：

- 使用 HTTPS 加密传输
- 使用轮换token
```ts
// 使用短期 access token + 长期 refresh token
interface TokenPair {
    accessToken: string;  // 短期token，如1小时
    refreshToken: string; // 长期token，如7天
    expiresIn: number;
}

// 定期刷新 token
async function refreshAccessToken() {
    const response = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',  // 携带 refresh token cookie
    });
    const newTokens = await response.json();
    // 更新 access token
}
```

- 添加请求的数字签名
```ts
interface SignedRequest {
    timestamp: number;
    nonce: string;
    signature: string;
    // ... 其他参数
}

// 生成请求签名
function generateSignature(params: any, timestamp: number, nonce: string, secretKey: string) {
    const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    const signStr = `${sortedParams}&timestamp=${timestamp}&nonce=${nonce}&key=${secretKey}`;
    return crypto.createHash('sha256').update(signStr).digest('hex');
}
```

### 具体实现：

- 使用 JWT 作为 access token
- refresh token 存储在 HttpOnly Cookie 中
- access token 有效期短（如1小时）
- 实现 token 黑名单机制
- 重要操作需要二次验证
- 监控异常请求模式
- 实现请求签名机制
- 使用 HTTPS
- 合理的速率限制
- 严格的 CORS 策略

记住：没有绝对的安全，我们能做的是：
- 提高攻击成本
- 减小泄露影响范围
- 快速发现和处理安全问题
- 建立完整的安全防护体系
