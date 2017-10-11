import { GLOBAL } from 'illa/GLOBAL'
import { escapeHtml } from 'illa/StringUtil'
import { throttle } from "illa/FunctionUtil";

let out: HTMLElement
let messages: string[] = []

GLOBAL.console = {
	log: log.bind(null, 'L'),
	info: log.bind(null, 'I'),
	error: log.bind(null, 'E'),
	warn: log.bind(null, 'W'),
}

function log(level: string, ...args: any[]) {
	messages.push(level + ': ' + args.join(' '))
	if (messages.length > 100) {
		messages.shift()
	}
	renderThrottled()
}

let renderThrottled = throttle(render, null, 500)
function render() {
	if (out) {
		out.style.whiteSpace = `pre-wrap`
		out.innerHTML = escapeHtml(messages.join('\n'))
	}
}

export function setOut(e: HTMLElement) {
	out = e
}
