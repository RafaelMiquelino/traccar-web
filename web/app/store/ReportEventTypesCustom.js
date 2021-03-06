/*
 * Copyright 2016 Anton Tananaev (anton@traccar.org)
 * Copyright 2021 Rafael Miquelino (rafaelmiquelino@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.store.ReportEventTypesCustom', {
    extend: 'Ext.data.Store',
    fields: ['type', 'name'],

    data: [{
        type: 'roadOverspeed',
        name: Strings.eventRoadOverspeed
    }, {
        type: 'roadSuspiciousUturn',
        name: Strings.eventRoadSuspiciousUturn
    }, {
        type: 'roadForbiddenDirection',
        name: Strings.eventRoadForbiddenDirection
    }, {
        type: 'roadForbiddenAccess',
        name: Strings.eventRoadForbiddenAccess
    }, {
        type: 'roadNoThroughTraffic',
        name: Strings.eventRoadNoThroughTraffic
    }, {
        type: 'roadIllegalUturn',
        name: Strings.eventRoadIllegalUturn
    }, {
        type: 'roadGateTraversal',
        name: Strings.eventRoadGateTraversal
    }, {
        type: 'roadIllegalTurn',
        name: Strings.eventRoadIllegalTurn
    }, {
        type: 'roadStopSignViolation',
        name: Strings.eventRoadStopSignViolation
    }, {
        type: 'roadUnknownWarning',
        name: Strings.eventRoadUnknownWarning
    }]
});
