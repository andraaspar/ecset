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

module.exports = () => `
*
{
	box-sizing: content-box;
	margin-top: 0;
	word-break: break-all;
}

html,
body
{
	background: ${GRAY_7};
	color: white;
	height: 100%;
	margin: 0;
}

html,
body,
button,
input,
textarea
{
	font-family: sans-serif;
	font-size: 14px;
	line-height: ${LINE_HEIGHT_P_UNITLESS};
}

`
