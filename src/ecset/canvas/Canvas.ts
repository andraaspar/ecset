/// <reference path='Color.ts'/>

module ecset.canvas {
	export class Canvas extends berek.Widget {
		
		private canvasJq: jQuery.IInstance;
		private canvas: HTMLCanvasElement;
		private context: CanvasRenderingContext2D;
		private worker: Worker;
		
		constructor(jq: jQuery.IInstance, private width: number, private height: number) {
			super(jq);
			
			jq.html(illa.Arrkup.createString([
				['canvas/', {width: width, height: height, 'data-berek-widget-part': 'canvasJq'}]
			]));
			
			this.initParts();
			
			this.canvas = <HTMLCanvasElement>this.canvasJq[0];
			this.context = this.canvas.getContext('2d');
			
			this.worker = new Worker('script/{{worker.min.js}}');
			this.worker.onmessage = illa.bind(this.onWorkerMessage, this);
		}
		
		draw(): void {
			var c = this.canvas.getContext('2d');
			var iData = c.createImageData(this.canvasJq.width(), this.canvasJq.height());
			var data = iData.data;
			
			for (var i = 0, n = data.length; i < n; i += 4) {
				data[i] = 255;
				data[i+1] = 205;
				data[i+2] = 10;
				data[i+3] = 255;
			}
			
			c.putImageData(iData, 0, 0);
		}
		
		drawPath(p: path.Path): void {
			var iData = this.context.createImageData(this.canvasJq.width(), this.canvasJq.height());
			
			this.worker.postMessage({imageData: iData, path: p});
		}
		
		onWorkerMessage(e: MessageEvent): void {
			var iData: ImageData = e.data.imageData;
			this.context.putImageData(iData, 0, 0);
		}
	}
}