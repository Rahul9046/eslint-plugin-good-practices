/**
 * @fileoverview Tests for no-anonymous-handler rule.
 * @author Rahul Das
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require('../rules/no-anonymous-handler')['no-anonymous-handler'];
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-anonymous-handler", rule, {
    valid: [
        'function logMsg(){console.log("hovered");};document.addEventListener("mouseover", logMsg);',
        'function logMsg(){console.log("clicked");};document.attachEvent("onclick", logMsg);'
    ],
    invalid: [
        {
            code: 'document.addEventListener("mouseover", function (){console.log("hovered");});',
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: 'document.attachEvent("onlcick", function (){console.log("clicked");});',
            errors: [{ messageId: "unexpected" }]
        }
    ]
});