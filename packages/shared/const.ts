/**
 * 用户行为栈事件类型
 */
export enum BehaviorType {
	CLICK = "UI.Click", // 点击事件
	INPUT = "input", // 输入事件
	SCROLL = "scroll", // 滚动事件
	CONSOLE = "Console", // 调试信息，有点脏，考虑删除；
	API_REQUEST = "api", // API请求
	RESOURCE = "Resource", // 资源加载
	HISTORY = "history", // 页面跳转, 路由变化
	PAGE_VIEW = "PageView", // 页面加载
	CUSTOM = "Custom", // 自定义事件
}

/**
 * 重写的事件类型
 */
export enum eventTypes {
	// 网络请求
	API_REQUEST = "api", // API请求, 包含xhr和fetch

	//  调试信息收集（CONSOLE）
	CONSOLE = "console",

	// 页面信息收集（DOM），通过事件委托或重写 addEventListener 实现
	DOM = "dom",

	// 监控history.pushState、replaceState 等等，监控页面路由变化
	HISTORY = "history",

	// 监控错误，捕获未被 try-catch 捕获的 JavaScript 错误， 通过window.onerror 或 ErrorEvent 监听实现
	ERROR = "error",

	// 监听url哈希变化， 通过window.onhashchange 事件监听
	HASHCHANGE = "hashchange",

	// 监控未被处理的Promise拒绝，通过window.onunhandledrejection 事件监听
	UNHANDLEDREJECTION = "unhandledrejection",

	// 监控Vue框架的错误，通过处理机制监听
	VUE = "Vue",

	// 监控React框架的错误，通过处理机制监听
	REACT = "React",

	// 监控代码错误
	CODE_ERROR = "Code Error",

	// 自定义事件
	CUSTOM = "Custom",
}

/**
 * 行为优先级
 */
export enum BehaviorPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
}
