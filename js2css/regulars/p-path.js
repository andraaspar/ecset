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
