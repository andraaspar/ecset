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

import '../../js2css/index.css'

import './statics.ts'

import * as m from 'mithril'

import { data } from './data/DataMethods'
import { EcsetComp } from './comp/EcsetComp'
import { GLOBAL } from 'illa/GLOBAL'
import jQuery from 'jquery-ts'
import { render } from './data/RenderMethods'

const ECSET_ELEMENT = document.getElementById('ecset')

GLOBAL.$ = GLOBAL.jQuery = jQuery
GLOBAL.m = m
GLOBAL.e = {
	data: data,
	render: render,
}

m.mount(ECSET_ELEMENT, EcsetComp)

render()
