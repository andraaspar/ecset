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
.${P}-canvas-area
{
	position: relative;
	background: ${GRAY_7} url('image/{{checkers-10.svg}}');
	overflow: hidden;
	flex-grow: 1;
}

.${P}-canvas
{
	position: absolute;
	outline: 1px solid ${rgba('white', .2)};
	box-shadow: 0 0 20px ${rgba('black', .6)};
}

.${P}-canvas-layer,
.${P}-canvas-layer-canvas,
.${P}-canvas-layer-svg
{
	position: absolute;
	top: 0;
	left: 0;
}

.${P}-canvas-layer-svg:not(:root)
{
	overflow: visible;
}
`

