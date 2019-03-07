# eslint-plugin-good-practices
An eslint plugin that contains custom rules which helps developers to write better JavaScript codes.

# Install from npm
```js
   npm install --save-dev eslint-plugin-good-practices
```

#Usage

Follow the given steps to use this plugin: 
  - Install the plugin
  - Open `.eslintrc.js` file
  - Add `good-practices` inside plugins array if present, else create one and then add in it.
  - Inside rules object mention the rules you want to use from the plugin. For eg: If you want to use `no-anonymous-handler` rule, then add the given below line in the rules object. This will show a warning if you use anonymous handler in your code.:
  ```js
        "good-practices/no-anonymous-handler" : "warn"
  ```

  # Guideline for contribution

  Follow the given steps to contribute.

  If you want to add a new rule: 
  - Fork the repository.
  - Add the new rule inside the `rules` directory and import the rule inside the index file of the same directory.
  - Add a doc for that rule inside `docs` directory.
  - Send PR!

  If you want to make changes in existing rules:
  - Fork the repository.
  - Make changes in the rule file.
  - Update its corresponding doc file present inside the `docs` directory, if needed.
  - Send PR!