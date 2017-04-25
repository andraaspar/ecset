/*
 * Copyright 2017 András Parditka.
 *
 * This file is part of Ecset.
 *
 * Ecset is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Ecset is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Ecset.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = () => {

let buttons = `.${P}-buttons`
let button = [`.${P}-button`, ...P_BUTTON]
let distances = [1, 5]

return `
${buttons}
{
	flex-shrink: 0;
	
	display: flex;
	flex-wrap: wrap;
}
${
distances.map(distance => `
${buttons}.${P}--${distance}
{
	margin-top: ${-distance}px;
	margin-left: ${-distance}px;
}
`)
}
${button.map(button => `${buttons} ${button}`)}
{
	flex-shrink: 0;
	
	display: flex;
	flex-wrap: wrap;
}
${
distances.map(distance => `
${button.map(button => `${buttons}.${P}--${distance} ${button}`)}
{
	margin-top: ${distance}px;
	margin-left: ${distance}px;
}
`)
}
${button.join()}
{
	flex-grow: 1;
	flex-shrink: 0;
	
	display: inline-box;
	background: ${GRAY_6};
	border: 1px solid ${color(`white`).alpha(.1)};
	color: white;
	padding: ${BUTTON_PADDING};
	text-align: center;
	justify-content: center;
	cursor: pointer;
}

${button.map(_ => `${_}:hover`).join()}
{
	background: ${GRAY_5};
}

${button.map(_ => `${_}:active`).join()}
{
	background: ${GRAY_7};
}
`
}