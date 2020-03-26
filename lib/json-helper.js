'use strict';

import Handlebars from 'handlebars'
const SafeString = Handlebars.SafeString;

function unwrapIfSafeString(val) {
    if (val instanceof SafeString) {
        val = val.toString();
    }
    return val;
}

export default function jsonHelper(data) {
    data = unwrapIfSafeString(data);
    return JSON.stringify(data);
}
