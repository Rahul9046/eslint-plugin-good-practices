module.exports =  {
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
    }
}