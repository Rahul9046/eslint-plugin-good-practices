
/**
 * @fileoverview Tests for no-function-dependency rule.
 * @author Rahul Das
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require('../rules/no-function-dependency')['no-function-dependency'];
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester(),
scope = {};

ruleTester.run("no-function-dependency'", rule, {
    valid: [
        { code: 'function fn(){var a = 20, b = function(){ return a};}', parserOptions: { sourceType: "module" } },
        { code: 'function fn(){var a = 20, b = function(){ return fn};}', parserOptions: { sourceType: "module" } },
        { code: 'function fn(){var str = "dummy Str",arr = [1,2,3];arr.forEach(function(item){console.log(item + str);});}', parserOptions: { sourceType: "module" } },
        { code: 'class abc{ fn(){ let comp = this.config, prop1 = config.prop1, fn2 = ()=>{return prop1};} }', parserOptions: { sourceType: "module" } },
        { code: 'class ABC {dummyFunc(){let comp = this,config = comp.config,flag = comp.flag,dataInfo = config.dataInfo;dataInfo.forEach((items)=>{comp.addGraphicalElement();});}}', parserOptions: { sourceType: "module" } },
    ],
    invalid: [
        {
            code: 'function fn(){var a = 20, b = function(){ return 20};}', parserOptions: { sourceType: "module" },
            errors: [{}] 
        },
        { 
            code: 'class abc{ fn(){ let comp = this.config, prop1 = config.prop1, fn2 = ()=>{return 30};} }', parserOptions: { sourceType: "module" },
            errors: [{}]  
        },
        { 
            code: 'function fn(){var str = "dummy Str",arr = [1,2,3];arr.forEach(function(item){console.log(item);});}', parserOptions: { sourceType: "module" },
            errors: [{}]  
        },
        { 
            code: 'class ABC {dummyFunc(){let comp = this,config = comp.config,flag = comp.flag,dataInfo = config.dataInfo;dataInfo.forEach((items)=>{items.forEach((item, index)=>{comp.addGraphicalElement();});});}}', parserOptions: { sourceType: "module" },
            errors: [{}]  
        }
    ]
});