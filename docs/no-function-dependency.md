# disallow creating independent `functions` within another `function scope`

Creation of independent functions (`which has no dependency with its lexical scope`) within another function should not be allowed, because if the outer function is executed multiple times then each time the same independent function gets newly created, which eventually leads to unnecessary garbage collection. It also helps in writing smaller and readable codes.

```js
   function fn1() {
       var a = 20,
       b = function() {
           return 30; 
       }
   }
```

# Rule Details

This rules disallows the creation of independent functions.

Examples of **incorrect** code for this rule:

`Example 1:`
```js
    function fn1() {
       var a = 20,
       b = function() {
           return 30; 
       }
    }
```    
`Example 2:`
```js
    function fn1() {
       var a = 20,
       b = function() {
           var b = a + 20,
            c = function(){
                return a;
            }; 
       }
    }
```
`Example 3:`
```js
    function fn1() {
        var a = 20,
        b = [1, 2, 3];
        b.forEach(function(item){
            console.log(item);
        });
    }

```

Examples of **correct** code for this rule:

`For Example 1:`
```js
    function returnValue() {
        return 30; 
    }
    function fn1() {
       var a = 20,
       b = retrunValue;
    }
```

`For Example 2:`
```js
    function fn1() {
       var a = 20,
        c = function(){
            return a;
        },
        b = function() {
           var b = a + 20; 
        }
    }
```

`For Example 3:`
```js
    function logItem(item){
        console.log(item);
    }
    function fn1() {
        var a = 20,
        b = [1, 2, 3];
        b.forEach(logItem);
    }
```