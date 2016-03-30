# `postcss-custom-colors`

A [PostCSS](https://github.com/postcss/postcss) plugin to add color functions that reference hues and shades of your color palette.

[![Build status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Maintained][maintained-image]][maintained-url] [![NPM version][npm-image]][npm-url] [![Dependency Status][dependency-image]][dependency-url] [![Dev Dependency Status][devDependency-image]][devDependency-url] [![Code Climate][climate-image]][climate-url]

## Installation

```
npm install postcss-custom-colors
```

## Usage

In JavaScript, simply pass your named colors to this plugin when declaring it for use with PostCSS. Your colors can be simple strings, or can have nested colors beneath them (this is useful for declaring shades/ tints).

```js
// dependencies
import fs from 'fs';
import postcss from 'postcss';
import customColors from 'postcss-custom-colors';

// css to be processed
const css = fs.readFileSync('input.css', 'utf8');

// your colors
const colors = {
  white: '#F2F5FF',
  blue: {
    light: '#A2CEFF',
    base: '#5898FF',
  },
};

// process css
var output = postcss()
  .use(customColors(colors))
  .process(css)
  .css
```

And, in CSS, used the `color` function to reference your color palette. You can use the `shade` option to reference the nested shades, if provided (omitting a shade will default to using the `base` key of a nested color):

```css
.foo {
  background: color(white);
  border: 1px solid color(blue, shade: light);
  color: color(blue); /* equivalent to color(blue, shade: base) */
}
```

Which will generate:

```css
.foo {
  background: #F2F5FF;
  border: 1px solid #A2CEFF;
  color: #5898FF;
}
```

### Options

In addition to the color palette passed to `custom-colors`, you can pass an options object that lets you customize the names of the function, modifier key, and default value key:

```js
postcss().use(
  customColors(colors, {
    // the actual function to look for; here, `colour(white)` becomes valid.
    functionName: 'colour',

    // the modifier key to use; here, `color(blue, value: light)` becomes valid.
    shadeName: 'value',

    // the base key name; here, `color(blue)` will refer to the light blue.
    baseName: 'light',
  })
)
```

[travis-url]: https://travis-ci.org/lemonmade/blueprint-package
[travis-image]: https://travis-ci.org/lemonmade/blueprint-package.svg?branch=master

[coveralls-url]: https://coveralls.io/github/lemonmade/blueprint-package?branch=master
[coveralls-image]: https://coveralls.io/repos/lemonmade/blueprint-package/badge.svg?branch=master&service=github

[dependency-url]: https://david-dm.org/lemonmade/blueprint-package
[dependency-image]: https://david-dm.org/lemonmade/blueprint-package.svg

[devDependency-url]: https://david-dm.org/lemonmade/blueprint-package#info=devDependencies
[devDependency-image]: https://david-dm.org/lemonmade/blueprint-package/dev-status.svg

[npm-url]: https://npmjs.org/package/blueprint-package
[npm-image]: http://img.shields.io/npm/v/blueprint-package.svg?style=flat-square

[climate-url]: https://codeclimate.com/github/lemonmade/blueprint-package
[climate-image]: http://img.shields.io/codeclimate/github/lemonmade/blueprint-package.svg?style=flat-square

[maintained-url]: https://github.com/lemonmade/blueprint-package/pulse
[maintained-image]: http://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat-square
