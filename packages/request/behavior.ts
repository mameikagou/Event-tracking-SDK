import type { BehaviorPriority, BehaviorType } from "@/shared/const"
import type { BaseResponse } from "@/request/base"
export interface BaseBehavior {
	id: string // 行为ID
	type: BehaviorType // 行为类型
	timestamp: number // 发生时间
	url: string // 页面URL
	userId?: string // 用户ID
	sessionId: string // 会话ID
	priority: BehaviorPriority // 行为优先级
	duration?: number // 持续时间（如果适用）
}

export interface ClickBehavior extends BaseBehavior {
	type: BehaviorType.CLICK
	title: string // 事件名
	target: {   
		tagName: string // 元素标签
		className: string // 类名
		elementId: string // 元素ID
		text: string // 元素文本
	}
	position: {
		x: number
		y: number
	}
}

export interface ScrollBehavior extends BaseBehavior {
	type: BehaviorType.SCROLL
}

export interface ConsoleBehavior extends BaseBehavior {
	type: BehaviorType.CONSOLE
}

export interface ApiRequestBehavior extends BaseBehavior {
	type: BehaviorType.API_REQUEST
}

export interface ResourceBehavior extends BaseBehavior {
	type: BehaviorType.RESOURCE
}

export interface HistoryBehavior extends BaseBehavior {
	type: BehaviorType.HISTORY
}
export interface InputBehavior extends BaseBehavior {
	type: BehaviorType.INPUT
}

export interface PageViewBehavior extends BaseBehavior {
	type: BehaviorType.PAGE_VIEW
}
export interface CustomBehavior extends BaseBehavior {
	type: BehaviorType.CUSTOM
}

// 行为栈中的行为类型
export type BehaviorStackItem =
	| ClickBehavior
	| ScrollBehavior
	| ConsoleBehavior
	| ApiRequestBehavior
	| ResourceBehavior
	| HistoryBehavior
	| InputBehavior
	| PageViewBehavior
	| CustomBehavior

// 行为查询参数
export interface BehaviorQueryParams {
	sessionId?: string
	userId?: string
	startTime?: number
	endTime?: number
	types?: BehaviorType[]
	priority?: BehaviorPriority
	page?: number
	pageSize?: number
}

// 行为列表响应
export interface BehaviorListResponse extends BaseResponse {
	data: {
		items: BehaviorStackItem[]
		total: number
		page: number
		pageSize: number
	}
}
