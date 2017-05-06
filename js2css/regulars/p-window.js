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
.${P}-windows
{
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	pointer-events: none;
}

.${P}-window-modal-mask
{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: ${rgba(`black`, .6)};
	pointer-events: all;
	
	display: flex;
	justify-content: center;
	align-items: center;
}

.${P}-window
{
	display: flex;
	max-width: calc(100% - 20px);
}

.${P}-window.${P}--menu
{
	background: white;
	color: black;
	border-radius: 3px;
	padding: 10px;
}

.${P}-window *
{
	word-break: normal;
}
`