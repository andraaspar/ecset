import {IPath} from './Path'
import Renderer from './Renderer'
import GLOBAL from 'illa/GLOBAL'

console.log('Web worker starting...')
export function onMessage(e: MessageEvent) {
	console.log('Render starting...')
	let imageData: ImageData = e.data.imageData
	let path: IPath = e.data.path
	let renderer = new Renderer(imageData, path)
	renderer.render()
	console.log('Render finished.')
	
	GLOBAL.postMessage({imageData: imageData})
}
GLOBAL.onmessage = onMessage.bind(this)