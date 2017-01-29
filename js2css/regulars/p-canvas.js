module.exports = () => `
.${P}-canvas
{
	position: relative;
	background: white;
	overflow: auto;
	height: 100%;
}

.${P}-canvas-layer,
.${P}-canvas-layer-canvas,
.${P}-canvas-layer-svg
{
	position: absolute;
	top: 0;
	left: 0;
}
`
