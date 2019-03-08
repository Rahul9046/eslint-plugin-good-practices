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
        'function logMsg(){console.log("clicked");};document.attachEvent("onclick", logMsg);',
        'document.attachEvent("onclick", function fn(){console.log("clicked");});',
        'document.attachEvent("onclick", function fn(){console.log("clicked");});'
    ],
    invalid: [
        {
            code: 'document.addEventListener("mouseover", function (){console.log("hovered");});',
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: 'document.attachEvent("onclick", function (){console.log("clicked");});',
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: 'function fn(){document.addEventListener("mouseover", function(){console.log("hovered");});}',
            errors: [{ messageId: "unexpected" }]
        },
        {
            code: 'function fn(){document.attachEvent("onmouseout", function(){console.log("hovered out");});}',
            errors: [{ messageId: "unexpected" }]
        }
    ]
});