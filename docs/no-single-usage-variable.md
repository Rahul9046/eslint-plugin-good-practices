# disallow creation of `variables` that are used only once within a `function scope`

Variables that are used only once throughout the scope of the function should not be created, as there is
no need for creation of such variables and assigning memory for it. The values can be used directly.

```js
   function fn() {
       var a = 20;
       return a;
   }
```

# Rule Details

This rules disallows the creation of independent functions.

Examples of **incorrect** code for this rule:

`Example 1:`
```js
    function fn(value) {
       var a = Math.pow(value, 2);
       return a;
    }
```    
`Example 2:`
```js
    class ABC {
        fn(){
            let comp = this,
            key = comp.key,
            value = comp.value,
            log = ()=>{
                console.log(key + ':' + value);
            };
        }
    }
```

Examples of **correct** code for this rule:

`For Example 1:`
```js
    function fn(value) {
       return Math.pow(value, 2);
    }
```

`For Example 2:`
```js
    class ABC {
        fn(){
            let comp = this,
            log = ()=>{
                console.log(comp.key + ':' + comp.value);
            };
        }
    }
```