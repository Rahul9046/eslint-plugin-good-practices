module.exports = {
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
    }
}