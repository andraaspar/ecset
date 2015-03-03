

module ecset.canvas {
	export class Color {
		
		private red: number;
		private green: number;
		private blue: number;
		private alpha: number;
		
		constructor(red: number, green: number, blue: number, alpha: number) {
			this.red = this.sanitize(red);
			this.green = this.sanitize(green);
			this.blue = this.sanitize(blue);
			this.alpha = this.sanitize(alpha);
		}
		
		sanitize(v: number): number {
			return Math.max(0, Math.min(255, Math.round(v)));
		}
		
		getRed(): number {
			return this.red;
		}
		
		getGreen(): number {
			return this.green;
		}
		
		getBlue(): number {
			return this.blue;
		}
		
		getAlpha(): number {
			return this.alpha;
		}
		
		getAlphaMultiplier(): number {
			return this.alpha / 255;
		}
		
		add(color: Color): Color {
			return this.interpolate(color, color.getAlphaMultiplier()).setAlpha(this.alpha + color.alpha);
		}
		
		interpolate(color: Color, t: number): Color {
			return new Color(
				this.red + (color.red - this.red) * t,
				this.green + (color.green - this.green) * t,
				this.blue + (color.blue - this.blue) * t,
				this.alpha + (color.alpha - this.alpha) * t
			);
		}
		
		toArray(): [number, number, number, number] {
			return [this.red, this.green, this.blue, this.alpha];
		}
		
		static fromArray(v: number[], start = 0): Color {
			return new Color(v[start + 0], v[start + 1], v[start + 2], v[start + 3]);
		}
		
		setAlpha(v: number): Color {
			return new Color(this.red, this.green, this.blue, v);
		}
		
		static mix(colors: Color[]): Color {
			var result = colors[0];
			for (var i = 1, n = colors.length; i < n; i++) {
				result = result.interpolate(colors[i], 1 / (i + 1));
			}
			return result;
		}
	}
}