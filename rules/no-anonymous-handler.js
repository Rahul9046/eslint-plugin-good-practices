/**
 * @fileoverview Rules to disallow the creation of anonymous handlers for events
 * @author Rahul Das
 */

"use strict";

module.exports = {
    "no-anonymous-handler": {
        meta: {
            type: "suggestion",   
            docs: {
                description: "disallow creation of anonymous handlers for events",
                category: "Functions",
                recommended: true,
                url: "https://github.com/Rahul9046/eslint-plugin-good-practices/blob/master/docs/no-anonymous-handler.md"
            }
        },
        create(context) {
            // function that checks if the node is a function expression. if false then skip
            // that node. else check if its name is given
            function checkAnonymousHandler(node){
                var isFunctionExpression = /FunctionExpression/ig.test(node.type);
                if (!isFunctionExpression){
                    return true;
                }
                return node.id !== null;
              }
            return {
                "CallExpression"(node) {
                    // it checks whether the callee of the call expression has a property value and the expression was called
                    // using two arguments. if both the conditions satisfy then check whether the property name is 'addEventListener'.
                    // If true then check whether the second argument (which is the handler) is an anonymous. if any of the given 
                    // conditions do not satisfy then skip that node. 
                    if (node.arguments.length !==2 || !node.callee.property || node.callee.property.name !== 'addEventListener' ||
                    checkAnonymousHandler(node.arguments[1])){
                      return;
                     }
                  context.report({
                  node: node.arguments[1],
                  message: 'Do not create anonymous handlers'
                  });
                  }
              };
        }
    }
}