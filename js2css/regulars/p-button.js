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
	let buttonSelectors = [`.${P}-button`, ...BUTTON]
	let distances = [1, 5]

	return `
${buttons}
{
	flex-shrink: 0;
	
	display: flex;
}
${buttons}.${P}--wrap
{
	flex-wrap: wrap;
}
${rules(distances, distance => `
${buttons}.${P}--${distance}
{
	margin-top: ${-distance}px;
	margin-left: ${-distance}px;
}
`)}
${selectors(buttonSelectors, button => `${buttons} ${button}`)}
{
	display: flex;
}
${rules(distances, distance => `
${selectors(buttonSelectors, button => `${buttons}.${P}--${distance} ${button}`)}
{
	margin-top: ${distance}px;
	margin-left: ${distance}px;
}
`)}
${selectors(buttonSelectors)}
{
	flex-grow: 1;
	flex-shrink: 0;
	
	display: inline-box;
	background: ${GRAY_6};
	border: 1px solid ${rgba(`white`, .1)};
	color: white;
	padding: ${BUTTON_PADDING};
	text-align: center;
	justify-content: center;
	cursor: pointer;
}

${selectors(buttonSelectors, button => `${button}:focus`)}
{
	outline: 0;
	border-color: ${TEAL_4};
}

${selectors(buttonSelectors, button => `${button}:hover`)}
{
	background: ${GRAY_5};
}

${selectors(buttonSelectors, button => `${button}:active`)}
{
	background: ${GRAY_7};
}

${selectors(buttonSelectors, button => `${button}:disabled`)}
{
	background: ${GRAY_7};
	color: ${rgba(`white`, .2)};
	cursor: default;
}

${selectors(buttonSelectors, button => `${button}.${P}--highlighted`)}
{
	background: ${GRAY_5};
}

${selectors(buttonSelectors, button => `${button}.${P}--highlighted:hover`)}
{
	background: ${GRAY_4};
}

${selectors(buttonSelectors, button => `${button}.${P}--highlighted:active`)}
{
	background: ${GRAY_7};
}

${selectors(buttonSelectors, button => `${button}.${P}--highlighted:disabled`)}
{
	background: ${GRAY_5};
}
`
}