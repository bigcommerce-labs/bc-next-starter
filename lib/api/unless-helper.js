'use strict';

import Handlebars from 'handlebars'
import ifHelper from './if-helper'

Handlebars.registerHelper('if', ifHelper)

export default function unlessHelper() {
    const options = arguments[arguments.length - 1];
    arguments[arguments.length - 1] = Object.assign({}, options, {
        fn: options.inverse || (() => false),
        inverse: options.fn || (() => true),
        hash: options.hash
    });

    return Handlebars.helpers['if'].apply(this, arguments);
};
