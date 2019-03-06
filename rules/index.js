/**
 * @fileoverview Rules that helps developers in writing cleaner codes
 * @author Rahul Das
 */

"use strict";

module.exports = {
    rules: {
        "no-function-dependency": {
            create(context) {
                var functionScopes = [];
                // method that gets the name of the function depending on its type.
                function getParentFunctionName(scope) {
                    // if it is a function declaration
                     if(scope.block.id){
                        return scope.block.id.name;
                     } else if(scope.block.parent.key){ // if it is a method defination
                       return scope.block.parent.key.name;
                     } else { // it is a function expression
                       return scope.block.parent.id.name;
                     }
                  }
                // function to get all the reference of itself and its childs'
                function getAllReferences (scope, referenceArr){ 
                    scope.references.forEach(function(reference){
                      referenceArr.push(reference);
                    });
                    scope.childScopes.forEach(function(childScope){
                      referenceArr = getAllReferences(childScope, referenceArr);
                    });
                    return referenceArr;
                }
                function checkInGivenParentScope (references, parentScope,selfScopeVariables){
                    var parentScopevariables = parentScope.variables.filter((item)=>{
                        return (item.name !== 'arguments')
                        }).map(item => item.name),
                        dependent = false,
                        functionName =  getParentFunctionName(parentScope),
                        i;
                        for (i = 0; i < references.length; i++){
                            // check if the current function scope if referencing a variable of its parent scope.
                            // also check if the function is not creating a new variable of the same name as the
                            // one defining in its parent function's scope. also if the function is accessing the 
                            // reference of its parent function through its name then it is a dependent function. 
                              if ((references[i].identifier.name === functionName) || parentScopevariables.includes(references[i].identifier.name) &&
                                 (references[i].identifier.parent.type !== 'VariableDeclarator' ||
                                  (references[i].identifier.parent.type === 'VariableDeclarator' &&
                                  references[i].identifier.parent.init.name === references[i].identifier.name)) &&
                                  (!selfScopeVariables.includes(references[i].identifier.name))){
                                    dependent = true;
                                    break;
                              }
                          }
                return dependent;
                }
                function checkDependency(functionScopes){
                    var isDependent,
                        currParentScope,
                        scopeVariables,
                        level
                    functionScopes.forEach((functionScope) =>{
                      isDependent = false;
                      level = 0;
                      currParentScope = functionScope.scope.upper;
                      scopeVariables = functionScope.scope.variables.filter((item)=>{
                            return (item.name !== 'arguments')
                          }).map(item => item.name);
                      while(currParentScope && currParentScope.type !== 'module' && currParentScope.type !== 'class' && !isDependent){
                        isDependent = checkInGivenParentScope(functionScope.references, currParentScope, scopeVariables);
                        currParentScope = currParentScope.upper;
                        !isDependent && level++;
                      }
                      if(isDependent){
                          functionScope.isDependent = true;
                       }
                      functionScope.scopeShift = level;
                    });
                  }
                function getAllFunctionScopes(currScope){
                    var childScopes = currScope.childScopes;
                    childScopes.forEach((scope)=>{
                        if (scope.type === 'function'){
                        if (scope.upper.type === 'function'){
                            functionScopes.push({
                                node: scope.block,
                                references: getAllReferences(scope, []),
                                scope,
                                isDependent: false,
                                scopeShift: 0
                            }); 
                        } 
                        getAllFunctionScopes(scope);
                        }
                    });
                }
                return {
                    "Program:exit"(programNode) {
                        var globalScope = context.getScope().childScopes[0].childScopes;
                        globalScope.forEach((scope)=>{
                            if (scope.type === 'class' || scope.type === 'function'){
                                getAllFunctionScopes(scope);
                             }
                        });
                        checkDependency(functionScopes);
                        functionScopes.forEach((scope) =>{
                            if (scope.scopeShift){
                               context.report({
                                 node: scope.node,
                                 message: 'This function can be shifted ' + scope.scopeShift + ' scope(s) above'
                               });
                            }
                        });
                      }
                };
        
            }
        },
        "no-anonymous-handler": {
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
        },
        "no-static-strings-in-scope": {
            create(context) {
                // function that checks whether any static string is assigned to a variable
                // returns false if its gets such node denoting a valid node. else returns
                // true for all other invalid nodes.
                function checkForInvalidValidNode(node, type){
                    // first level check. checks whether its grandparent is a block scope.
                    if (node.parent.parent.type === "BlockStatement"){
                     // for variable declarations. eg: var a = 'abc'
                      if (type === 'variableDeclarator'){
                        if (!node.init || node.init.type !== 'Literal'){
                          return true;
                        }
                        // check whether the assigned value is of type string
                        return typeof node.init.value !== 'string'
                      }else{  // for assignment expessions. eg: a = 'abc'
                        if (node.right.type !== 'Literal'){
                          return true;
                        }
                        // check whether the assigned value is of type string
                        return typeof node.right.value !== 'string'
                      }
                    } else {
                      return true;
                    }
                  }
                return {
                  "VariableDeclarator"(node) {
                    if (checkForInvalidValidNode(node, 'variableDeclarator')){
                         return;
                     }
                    context.report({
                      node,
                      message: 'Do not declare variables with constant string inside a block scope'  
                    });
                    },
                  "AssignmentExpression"(node) {
                    if (checkForInvalidValidNode(node, 'assignmentExpression')){
                         return;
                     }
                    context.report({
                      node,
                      message: 'Do not assign variables with constant string inside a block scope'  
                    });
                    }
                  
                }
            }
        },
        "no-single-usage-variable": {
            create(context) {
                var functionScopes = [];
                // function that checks whether both the nodes are same
                function notSameNode(node1, node2){
                    return node1.name !== node2.name
                 }
                // function that counts the number of times a variable is referred in a function scope
                // and all its child block scopes
                function countNumberOfUsages(toCheckNode, allReferences){
                    for (var i = 0; i < allReferences.length; i++){
                        if (toCheckNode.node.name === allReferences[i].identifier.name){
                        toCheckNode.usageNumber++;
                        }
                    }
                }
                // function that checks the number of usages of a variable that is defined in a function scope.
                function checkUsages(){
                    var declaredVarNodes,
                        i;
                    functionScopes.forEach(function(scopeObj){
                        declaredVarNodes = scopeObj.declaredVarNodes;
                        if (scopeObj.referedInScope.length){
                            for (i = 0; i < declaredVarNodes.length; i++){
                                countNumberOfUsages(declaredVarNodes[i], scopeObj.referedInScope);
                            }
                        }
                    });
                }
                // function to get the nodes of all the variables declared in a function scope.
                function getDeclaredVariableNodes (){
                    var i,
                        scopeReferences;
                    functionScopes.forEach(function(scopeObj){
                        scopeObj.declaredVarNodes = [];
                        scopeReferences = scopeObj.scope.references;
                        for (i = 0; i < scopeReferences.length; i++){
                            if((scopeReferences[i].identifier.parent.type === 'VariableDeclarator' && 
                                scopeReferences[i].identifier.parent.init.type !== 'FunctionExpression' &&
                                notSameNode(scopeReferences[i].identifier, scopeReferences[i].identifier.parent.init)) ||
                                (scopeReferences[i].identifier.parent.type === 'AssignmentExpression' &&
                                scopeReferences[i].identifier.parent.right.type !== 'FunctionExpression' &&
                                notSameNode(scopeReferences[i].identifier, scopeReferences[i].identifier.parent.right))){
                                    scopeObj.declaredVarNodes.push({
                                    node: scopeReferences[i].identifier,
                                    usageNumber: 0
                                    });
                            }
                        }
                    });
                }
                // function to get all the function scopes present in the "Program"
                function getAllFunctionScopes(currScope){
                    var childScopes = currScope.childScopes;
                    childScopes.forEach((scope)=>{
                        if (scope.type === 'function'){
                        functionScopes.push({
                            node: scope.block,
                            referedInScope: getAllReferences(scope, []),
                            scope
                        });
                        }
                        if (scope.childScopes.length){
                            getAllFunctionScopes(scope); 
                        }
                    });
                }
                // function to get all the references inside a function scope as well as its child scopes.
                function getAllReferences (scope, referenceArr){ 
                    scope.references.forEach(function(reference){
                        if ((reference.identifier.parent.type !== 'VariableDeclarator' ||
                            (reference.identifier.parent.type === 'VariableDeclarator' &&
                            !notSameNode(reference.identifier, reference.identifier.parent.init))) && 
                            (reference.identifier.parent.type !== 'AssignmentExpression') ||
                            (reference.identifier.parent.type === 'AssignmentExpression' &&
                            !notSameNode(reference.identifier, reference.identifier.parent.right))){
                                referenceArr.push(reference);
                        }
                    });
                    scope.childScopes.forEach(function(childScope){
                        referenceArr = getAllReferences(childScope, referenceArr);
                    });
                    return referenceArr;
                }
                return {
                "Program:exit"(programNode) {
                    var globalScope = context.getScope().childScopes[0],
                        declaredNodesInScope,
                        i,
                        j;
                    // get all function scopes
                    getAllFunctionScopes(globalScope);
                    // get all the declared variable nodes in each of the function scopes.
                    getDeclaredVariableNodes();
                    // check the number of usages of each of the declared variable nodes.
                    checkUsages();
                    for(i = 0; i < functionScopes.length; i++){
                        declaredNodesInScope = functionScopes[i].declaredVarNodes;
                        for(j = 0; j < declaredNodesInScope.length; j++){
                            // if the number of usages is equal to one then report that node.
                            if (declaredNodesInScope[j].usageNumber === 1){
                                context.report({
                                    node: declaredNodesInScope[j].node,
                                    message: "Do not declare variables that are used only once"
                                });
                            }
                        }
                        }
                    }
                }  
            }
        }
    }
};