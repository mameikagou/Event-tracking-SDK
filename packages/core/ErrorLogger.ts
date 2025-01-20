import type { Track } from '@/core/track';

interface ErrorInfo {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    type: 'error' | 'unhandledrejection';
    timestamp: number;
}

export class ErrorTracker {
    private track: Track;

    constructor(track: Track) {
        this.track = track;
        this.initErrorListener();
    }

    private initErrorListener() {
        // 捕获运行时错误
        window.addEventListener('error', (event) => {
            const errorInfo: ErrorInfo = {
                message: event.message,
                // 错误堆栈
                stack: event.error?.stack,
                filename: event.filename,
                // 错误行号
                lineno: event.lineno,
                // 错误列号
                colno: event.colno,
                type: 'error',
                timestamp: Date.now()
            };
            this.reportError(errorInfo);
        }, true);

        // 捕获Promise未处理的rejection
        window.addEventListener('unhandledrejection', (event) => {
            const errorInfo: ErrorInfo = {
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack,
                type: 'unhandledrejection',
                timestamp: Date.now()
            };
            this.reportError(errorInfo);
        });

        // TODO：对其余类型的错误进行监听
    }

    // 手动上报错误的方法
    public captureError(error: Error) {
        const errorInfo: ErrorInfo = {
            message: error.message,
            stack: error.stack,
            type: 'error',
            timestamp: Date.now()
        };
        this.reportError(errorInfo);
    }

    private reportError(errorInfo: ErrorInfo) {
        this.track.uploadEvent('error', {
            ...errorInfo,
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
}
