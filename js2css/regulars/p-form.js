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
}
.${P}-form-title
{
	font-size: 10px;
	color: ${rgba(`white`, .6)};
	padding: ${BUTTON_PADDING_SMALL};
}
.${P}-form-list
{
	flex-basis: 20px;
	flex-shrink: 0;
	flex-grow: 1;
}
.${P}-form-list-item
{
	padding: ${BUTTON_PADDING};
}
.${P}-form-list-item + .${P}-form-list-item
{
	border-top: 1px solid black;
}
`