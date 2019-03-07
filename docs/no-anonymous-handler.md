# disallow creating `anonymous handlers` for `events`

Creating anonymous handlers for events causes two problems: 
   - If the function that attaches the handler is executed more than one time then the same handler is executed multiple times for just one firing of that particular event.
   - If any requirement comes to remove that handler for that event then one can’t do that as anonymous functions cannot be referred.


```js
   document.addEventListener('mouseover', function(e){
     console.log(e.target);
   });
```

# Rule Details

This rules disallows the creation of anonymous handlers for events.

Examples of **incorrect** code for this rule:

`Example 1:`
```js
    function attachEvents() {
       var displayStr = 'hovered on';
       document.addEventListener('mouseover', function (e){
           console.log(displayStr + e.target);
       });
    }
```    
`Example 2:`
```js
    class XYZ{
        attachEvents(){
            let comp = this,
            comp.mouseoutCount = 0;
            document.addeventListener('mouseout', ()=>{
                comp.mouseoutCount++;
            });
        }
    }
```

Examples of **correct** code for this rule:

`For Example 1:`
```js
     function handleMouseOver(e){
        var displayStr = 'hovered on';
        console.log(displayStr + e.target);
     }
     function attachEvents() {
       document.addEventListener('mouseover', handleMouseOver);
    }
```

`For Example 2:`
```js
    class XYZ {
        constructor(){
            let comp = this;
            comp.mouseoutCount = 0;
            comp.handleMouseOut = ()=>{
                comp.mouseoutCount++;
            }
        }
        attachEvents(){
            let comp = this,
            comp.mouseoutCount = 0;
            document.addEventListener('mouseout', comp.handleMouseOut);
        }
    }
```