This is a basic task runner setup that:
- converts SCSS to CSS
- bundles ES6 modules using Webpack(v1) and Babel
- optionally minifies images
- watches for changes and syncs the browser

# Setup

1.  Clone or download zip
2.  `npm install`
3.  Update paths if necessary

# Running

```
gulp
```

Generate production-ready assets

```
gulp --production
```

# Notes

## Javascript

`main.js` is the main entry point to your js. You can include other libraries or modules by referencing them inside `main.js` using [`require`](http://requirejs.org/docs/commonjs.html) or [`import`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/import)

For example:
```js
window.$ = window.jQuery = require('jquery'); // includes jquery from your `node_modules` folder
require('./navigation'); // includes navigation.js from the `js` directory
```

## Scope

This is a minimal setup that works well for small projects. For large scale applications / websites you might want to check out <https://github.com/vigetlabs/blendid>