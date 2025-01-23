import { ErrorTracker } from './ErrorLogger';

interface UploadEventParams {
    eventName: string;
    eventParams: Record<string, any>;
}
export class Track {
    private options: any;
    private commonParams: Record<string, any>;
    // 上报队列
    private queue: UploadEventParams[];
    // 上次上报时间
    private lastUploadTime: number;

    // 定时上报
    private timer: ReturnType<typeof setInterval>;

    private errorTracker: ErrorTracker; 

    static DEFAULT_CONFIG = {
        uploadUrl: 'https://analytics.example.com/collect',
        batchSize: 10,                    // 批量上报数量
        uploadInterval: 5000,             // 上报间隔(ms)
        maxRetryTimes: 3,                 // 最大重试次数
        env: 'production',                // 环境
        debug: false,                     // 调试模式
        sampling: 1,                      // 采样率 0-1
    };

    constructor(options) {
        this.validateOptions(options);
        this.options = { ...Track.DEFAULT_CONFIG, ...options };
        this.commonParams = {};
        // 存储上报队列
        this.queue = [];
        this.init();
        // 初始化错误追踪器
        this.errorTracker = new ErrorTracker(this);
    }


    init() {
        // TODO: 初始化

        // 初始化设备信息
        this.initDeviceInfo();

        // 启动定时上报
    }

    initDeviceInfo() {
        // TODO: 初始化设备信息
    }

    // 启动定时上报
    startTimer() {
        // 启动定时上报
        const timer = setInterval(() => {
            this.flush();
        }, this.options.uploadInterval);
        
        this.timer = timer;
    }

    validateOptions(options) {
        if (!options.uploadUrl) {
            throw new Error('uploadUrl is required');
        }

        // TODO: 补充必要参数
    }
    uploadEvent(eventName, eventParams = {}) {
        const data = {
            // 一些基础信息，比如事件名，时间用户id，事件id等等
            eventName,
            eventId:this.generateEventId(),
            userId: this.options.userId,
            timestamp: Date.now(),
            // 其他参数
            ...this.commonParams,
            ...eventParams,
        }
        // 上报数据
        this.send(data);
    }

    // 生成事件id的函数, 因为是前端生成的，所以需要保证唯一性
    generateEventId() {
        return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    // 获取会话ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('track_session_id');
        if (!sessionId) {
            sessionId = this.generateEventId();
            sessionStorage.setItem('track_session_id', sessionId);
        }
        return sessionId;
    }

    // 发送数据
    send(data) {
        // 添加到队列
        this.queue.push(data);
        
        // 判断是否需要立即上报
        if (this.shouldUploadImmediately()) {
            this.flush();
        }
    }
    shouldUploadImmediately() {
        return this.queue.length >= this.options.maxBatchSize || Date.now() - this.lastUploadTime >= this.options.maxBatchInterval;
    }

    async flush() {
        if (this.queue.length === 0) return;

        const events = [...this.queue];
        this.queue = [];

       try {
            await fetch(this.options.uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    events,
                    timestamp: Date.now()
                })
            });
            this.lastUploadTime = Date.now();
        } catch (error) {
            // 上报失败，重新加入队列
            this.queue.unshift(...events);
            console.error('Track upload failed:', error);
        }
    }

    // 暴露手动捕获错误的方法
    public captureError(error: Error) {
        this.errorTracker.captureError(error);
    }
}