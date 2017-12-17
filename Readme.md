# tamia-theme

Simple theming for static sites. Works well with [Emotion](https://emotion.sh/).

## Installation

```bash
npm install tamia-theme
```

## Usage

### Set up a component library

Create a `theme.js` file in the root folder:

```js
const space = 8;
module.exports = {
  font: {
    heading: '"Avenir Next", "Helvetica Neue", sans-serif',
    body: '"Lora", "Merriweather", "Georgia", serif',
  },
  space: {
    xxs: `${space / 4}px`,
    xs: `${space / 2}px`,
    s: `${space}px`,
    m: `${space * 2}px`,
    l: `${space * 4}px`,
    xl: `${space * 8}px`,
    xxl: `${space * 16}px`,
  },
};
```

And use it like this in your components:

```jsx
import React from "react";
import styled from "react-emotion";
import theme from "tamia-theme";

const Container = styled.div`
  display: flex;
  margin-bottom: ${theme.space.xl};
`;
```

### Set up a component library

Create a `theme.js` file in the root folder:

```js
const merge = require('tamia-theme/merge');
const theme = require('@unicorn/component-library/theme');
module.exports = merge(theme, {
  font: {
    heading: '"Avenir Next", "Helvetica Neue", sans-serif',
    body: '"Lora", "Merriweather", "Georgia", serif',
  },
});
```

And use it in your components the same way as described above.

## Babel plugin

The Babel plugin will inline theme variables inside template literals, so [babel-plugin-emotion](https://github.com/emotion-js/emotion/blob/master/docs/install.md) could extract those styles.

Add the plugin to your `.babelrc`:

```json
{
  "plugins": [
    "tamia-theme/babel",
    [
      "emotion", {
        "extractStatic": true
      }
    ]
  ]
}
```

## Change log

The change log can be found on the [Releases page](https://github.com/sapegin/tamia-theme/releases).

## Contributing

Everyone is welcome to contribute. Please take a moment to review the [contributing guidelines](Contributing.md).

## Authors and license

[Artem Sapegin](http://sapegin.me) and [contributors](https://github.com/sapegin/tamia-theme/graphs/contributors).

MIT License, see the included [License.md](License.md) file.
