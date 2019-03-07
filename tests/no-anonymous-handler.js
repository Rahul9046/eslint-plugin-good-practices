const rule = require('../rules/no-anonymous-handler')['no-anonymous-handler'];
const RuleTester = require("eslint").RuleTester;

const ERROR_MSG = 'Do not create anonymous handlers.';

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