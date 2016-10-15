import {IPath} from './Path'
import * as Renderer from './Renderer'
import GLOBAL from 'illa/GLOBAL'

console.log('Web worker starting...')
export function onMessage(e: MessageEvent) {
	console.log('Render starting...')
	let imageData: ImageData = e.data.imageData
	let path: IPath = e.data.path
	Renderer.render(imageData, path)
	console.log('Render finished.')
	
	GLOBAL.postMessage({imageData: imageData})
}
GLOBAL.onmessage = onMessage.bind(this)