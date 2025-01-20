/**
 * 用户行为栈事件类型
 */
export enum BreadcrumbTypes {
	ROUTE = "Route",
	CLICK = "UI.Click",
	CONSOLE = "Console",
	XHR = "Xhr",
	FETCH = "Fetch",
	UNHANDLEDREJECTION = "Unhandledrejection",
	VUE = "Vue",
	REACT = "React",
	RESOURCE = "Resource",
	CODE_ERROR = "Code Error",
	CUSTOMER = "Customer",
}

/**
 * 重写的事件类型
 */
export enum eventTypes {
	// 网络请求
	XHR = "xhr",
	FETCH = "fetch",

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
}
