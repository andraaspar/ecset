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
.${P}-path,
.${P}-path-bg,
.${P}-path-ghost
{
	fill: none;
	stroke-linecap: round;
	cursor: pointer;
}
.${P}-path
{
	stroke: white;
	stroke-width: 1px;
}
.${P}-path-bg,
.${P}-path-ghost
{
	stroke: black;
	stroke-width: 6px;
	opacity: .6;
}
.${P}-path-ghost
{
	opacity: 0;
}
.${P}-path-ghost:hover
{
	opacity: .2;
}
`
