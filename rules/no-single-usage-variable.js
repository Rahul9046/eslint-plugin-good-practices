/**
 * @fileoverview Rules to disallow the declaration of variables that are used only once within a function scope
 * @author Rahul Das
 */

"use strict";

module.exports = {
    "no-single-usage-variable" : {
        meta: {
            type: "suggestion",   
            docs: {
                description: "disallow declaration of variables that are used only once within a function scope",
                category: "Variables",
                recommended: true,
                url: "https://github.com/Rahul9046/eslint-plugin-good-practices/blob/master/docs/no-single-usage-variable.md"
            },
            messages: {
                unexpected: "Do not declare variables that are used only once"
            }
        },
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
                                messageId: 'unexpected'
                            });
                       }
                    }
                    }
                }
            }  
        }
    }
}