import postcss from 'postcss';

const name = 'postcss-color-function';

module.exports = postcss.plugin(name, (
  colors = {},
  {functionName = 'color', baseName = 'base', shadeName = 'shade'} = {}
) => {
  const colorSource = createColorSource(colors, {baseName, shadeName});
  const colorFunctionRegex = new RegExp(`${functionName}\\(([^\\)]*)\\)`, 'g');
  const colorAndShadeRegex = new RegExp(`(\\w+)(?:\\s*,\\s*${shadeName}\\s*:\\s*(\\w+))?`);

  function replaceNamedColor(match, color) {
    const [, hue, shade] = color.match(colorAndShadeRegex);
    return colorSource.get(hue, shade);
  }

  return function(css) {
    css.walkDecls((declaration) => {
      try {
        declaration.value = declaration.value.replace(colorFunctionRegex, replaceNamedColor);
      } catch (error) {
        throw declaration.error(error.message, {plugin: name});
      }
    });
  };
});

function listAllKeys(object) {
  return Object.keys(object).map((key) => `'${key}'`).join(', ');
}

function createColorSource(colors, {shadeName, baseName}) {
  return {
    get(hue, shade) {
      const hueFromColors = colors[hue];

      if (hueFromColors == null) {
        throw new Error(`Could not find color '${hue}'. Available colors: ${listAllKeys(colors)}`);
      }

      // istanbul ignore next: weird Istanbul issue
      const typeOfHue = typeof hueFromColors;

      if (typeOfHue === 'object') {
        const fetchedColor = hueFromColors[shade || baseName];

        if (fetchedColor == null) {
          throw new Error(`Could not find ${shadeName} '${shade}' of '${hue}'. Available shades: ${listAllKeys(hueFromColors)}.`);
        }

        return fetchedColor;
      } else if (typeOfHue === 'string') {
        if (shade != null) {
          throw new Error(`You asked for a ${shadeName} of '${hue}', but none were set in your color object.`);
        }

        return hueFromColors;
      } else {
        throw new Error('Sorry, something went wrong.');
      }
    },
  };
}
