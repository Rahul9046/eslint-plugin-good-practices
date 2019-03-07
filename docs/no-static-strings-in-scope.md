# disallow assigning `variables` with static strings within a `function scope`

Assigning variables with static strings within a function may lead to major garbage collection, because if the function is executed more than one time, then for each time, new memory is allocated for that same string.  

```js
   class ABC {
       fn(){
           let a = 20,
           b = 'someString';
       }
   }
```

# Rule Details

This rules disallows assigning variables with static strings within a function scope.

Examples of **incorrect** code for this rule:

`Example 1:`
```js
    class ABC {
       fn(){
           let a = 20,
           b = 'someString';
       }
   }
```    
`Example 2:`
```js
    class ABC {
       fn(){
           let comp = this,
           a = 20,
           b;
           if (this.flag){
             b = 'someString';
           }
       }
   }
```

Examples of **correct** code for this rule:

`For Example 1:`
```js
     const someString = 'someString';
     class ABC {
       fn(){
           let a = 20,
           b = someString;
       }
   }
```

`For Example 2:`
```js
    const someString = 'someString';
    class ABC {
       fn(){
           let comp = this,
           a = 20,
           b;
           if (this.flag){
             b = someString;
           }
       }
   }
```