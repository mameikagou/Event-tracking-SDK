import type{ eventTypes } from "@/shared/const";

type anyCallback = (arg: any) => void

// key是事件名，value是所有订阅该事件的回调

const handler = new Map<eventTypes, anyCallback[]>()

export function subscribe(event: eventTypes, callback: anyCallback) {
    const callbacks = handler.get(event) || []
    callbacks.push(callback)
    handler.set(event, callbacks)
}

export function unsubscribe(event: eventTypes, callback: anyCallback) {
    const callbacks = handler.get(event) || []
    const index = callbacks.indexOf(callback)
    if (index !== -1) {
        callbacks.splice(index, 1)
    }
}