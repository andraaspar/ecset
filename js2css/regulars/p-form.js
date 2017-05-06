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

module.exports = `
.${P}-form-area
{
	width: 300px;
	flex-grow: 0;
	
	display: flex;
	flex-direction: column;
	
	overflow: auto;
}
.${P}-form-section
{
	flex-basis: 100%;
	
	display: flex;
	flex-direction: column;
}
.${P}-form-section + .${P}-form-section
{
	border-top: 1px solid black;
}
.${P}-form-title
{
	font-size: 10px;
	color: ${rgba(`white`, .6)};
	padding: ${BUTTON_PADDING_SMALL};
}
.${P}-form-list,
.${P}-form-content
{
	flex-basis: 20px;
	flex-shrink: 0;
	flex-grow: 1;
	
	display: flex;
	flex-direction: column;
	overflow: auto;
}
.${P}-form-buttons
{
	flex-shrink: 0;
	
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.${P}-form-list-placeholder
{
	flex-grow: 0;
	flex-shrink: 0;
	display: flex;
	padding: 0;
	font-size: ${FONT_SIZE_TINY};
	line-height: 1;
}
.${P}-form-list-item
{
	border-bottom: 1px solid black;
	display: flex;
}
.${P}-form-list-item-end
{
	flex-grow: 1;
}
.${P}-form-list-item-opener
{
	flex-grow: 0;
	align-self: flex-start;
	padding-left: 5px;
	padding-right: 5px;
}
.${P}-form-list-item-name
{
	justify-content: flex-start;
	flex-shrink: 1;
}
.${P}-form-list-item-name.${P}--unnamed
{
	font-style: italic;
}
.${P}-form-list-item-extra-button
{
	flex-grow: 0;
}
.${P}-form-item,
.${P}-form-list-item-meta
{
	font-size: ${FONT_SIZE_TINY};
	padding: ${BUTTON_PADDING};
}
.${P}-form-item-label,
.${P}-form-list-item-meta-label
{
	font-weight: bold;
	color: ${rgba(`white`, .6)};
}
.${P}-form-item-value,
.${P}-form-list-item-meta-value
{
	color: ${rgba(`white`, .8)};
}
.${P}-form-no-items
{
	padding: ${BUTTON_PADDING};
	text-align: center;
	font-style: italic;
}
`