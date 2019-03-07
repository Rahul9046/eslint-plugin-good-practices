/**
 * @fileoverview Rules that helps developers in writing cleaner codes
 * @author Rahul Das
 */

"use strict";

const no_single_usage_variable  = require('./no-single-usage-variable')['no-single-usage-variable'];
const no_static_strings_in_scope  = require('./no-static-strings-in-scope')['no-static-strings-in-scope'];
const no_anonymous_handler  = require('./no-anonymous-handler')['no-anonymous-handler'];
const no_function_dependency = require('./no-function-dependency')['no-function-dependency'];

module.exports = {
    rules: {
        'no-function-dependency': no_function_dependency,
        'no-anonymous-handler': no_anonymous_handler,
        'no-static-strings-in-scope': no_static_strings_in_scope,
        'no-single-usage-variable': no_single_usage_variable
    }
};