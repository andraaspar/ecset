module.exports = () => `
.${P}-path
{
	fill: none;
	stroke: white;
	stroke-width: 1px;
	stroke-linecap: round;
}
.${P}-path-bg
{
	fill: none;
	stroke: black;
	stroke-width: 3px;
	stroke-linecap: round;
}
.${P}-path-handles
{
	fill: none;
	stroke: white;
	stroke-width: 1px;
	stroke-linecap: round;
	stroke-dasharray: 6, 6;
}
.${P}-path-handles-bg
{
	fill: none;
	stroke: black;
	stroke-width: 3px;
	stroke-linecap: round;
	stroke-dasharray: 6, 6;
}
`