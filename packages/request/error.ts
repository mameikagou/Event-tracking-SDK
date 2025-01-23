import type{ BaseResponse } from './base';

// 错误严重程度枚举
enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// 错误状态
enum ErrorStatus {
    OPEN = 'open',           // 新建
    IN_PROGRESS = 'progress',// 处理中
    IGNORED = 'ignored',     // 已忽略
    RESOLVED = 'resolved'    // 已解决
}


// 错误详情接口
interface ErrorDetail {
    id: string;                     // 错误唯一ID
    type: string;                   // 错误类型 (如 "TypeError", "SyntaxError" 等)
    message: string;                // 错误信息
    stack: string;                  // 错误堆栈
    timestamp: number;              // 错误发生时间
    url: string;                    // 错误发生页面URL
    userId?: string;                // 错误发生用户ID
    userAgent: string;              // 用户浏览器信息
    count: number;                  // 错误发生次数
    lastOccurrence: number;         // 最后一次发生时间
    severity: ErrorSeverity;        // 错误严重程度
    status: ErrorStatus;            // 错误状态
    environment: string;            // 环境（production/staging/development）
    metadata: {                     // 额外信息
        browser: string;
        os: string;
        device: string;
        // ... 其他元数据
    };
    tags: string[];                 // 标签
}

// 错误列表响应接口
interface ErrorListResponse extends BaseResponse {
    data: {
        items: ErrorDetail[];
        total: number;
        page: number;
        pageSize: number;
    }
}