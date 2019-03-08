
/**
 * @fileoverview Tests for no-single-usage-variable rule.
 * @author Rahul Das
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require('../rules/no-single-usage-variable')['no-single-usage-variable'];
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-single-usage-variable", rule, {
    valid: [
        { code: 'function fn(){var a = 20,b = a / 20, c = Math.pow(a, 2);}', parserOptions: { sourceType: "module" } },
        { code: 'class abc{ fn(){ let config = this.config, prop1 = config.prop1, prop2 = config.prop2;} }', parserOptions: { sourceType: "module" } }
    ],
    invalid: [
        {
            code: 'function fn(){var a = 20,b = a * 2;}', parserOptions: { sourceType: "module" }, 
            errors: [{ messageId: "unexpected" }] 
        },
        {
            code: 'class abc{ fn(){ let config = this.config, prop1 = config.prop1;} }', parserOptions: { sourceType: "module" }, 
            errors: [{ messageId: "unexpected" }] 
        },
        {
            code: '(function(){var a = 4,b = a;})()', parserOptions: { sourceType: "module" }, 
            errors: [{ messageId: "unexpected" }] 
        }
    ]
});