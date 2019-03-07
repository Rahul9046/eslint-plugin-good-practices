/**
 * @fileoverview Tests for no-static-string-in-scope rule.
 * @author Rahul Das
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../rules/no-static-strings-in-scope')['no-static-strings-in-scope'];
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-static-strings-in-scope", rule, {
    valid: [
        { code: 'var strValue = "dummyString";function fn(){var strVar = strValue}', parserOptions: { sourceType: "module" } },
        { code: 'const strValue = "dummyString";class abc{ fn(){ let strVar = strValue} }', parserOptions: { sourceType: "module" } }
    ],
    invalid: [
        {
            code: 'function fn(){var strVar = "dummyString"}', parserOptions: { sourceType: "module" }, 
            errors: [{ messageId: "unexpected-declaration" }] 
        },
        {
            code: 'class abc{ fn(){ let strVar, numVar = 20; strVar = "dummyString"} }', parserOptions: { sourceType: "module" }, 
            errors: [{ messageId: "unexpected-assignment" }] 
        }
    ]
});