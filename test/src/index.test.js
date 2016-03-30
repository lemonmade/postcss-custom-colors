import postcss from 'postcss';
import plugin from '../../src';

describe('plugin', () => {
  const colors = {
    red: '#CA3534',
    blue: {
      base: '#4174CA',
      dark: '#315798',
    },
    green: 10,
  };

  function runPlugin(input, options = {}) {
    return postcss([plugin(colors, options)]).process(input);
  }

  context('when no color exists', () => {
    it('throws an error', () => (
      runPlugin('.foo {color: color(purple);}')
        .then(() => {
          throw new Error('Expected plugin to throw an error, but it did not.');
        }, (error) => {
          expect(error.message).to.contain(`Available colors: ${Object.keys(colors).map((color) => `'${color}'`).join(', ')}`);
        })
    ));
  });

  context('when there are no nested colors', () => {
    it('replaces the color function with the passed color', async () => {
      const {css} = await runPlugin('.foo {color: color(red)}');
      expect(css).to.equal(`.foo {color: ${colors.red}}`);
    });

    it('throws an error when a shade is passed', () => (
      runPlugin('.foo {color: color(red, shade: dark);}')
        .then(() => {
          throw new Error('Expected plugin to throw an error, but it did not.');
        }, (error) => {
          expect(error.message).to.contain('You asked for a shade of \'red\'');
        })
    ));
  });

  context('when there is an issue with the color', () => {
    it('throws an error', () => (
      runPlugin('.foo {color: color(green);}')
        .then(() => {
          throw new Error('Expected plugin to throw an error, but it did not.');
        }, (error) => {
          expect(error.message).to.contain('something went wrong');
        })
    ));
  });

  context('when there are nested colors', () => {
    it('uses the base color when no shade is passed', async () => {
      const {css} = await runPlugin('.foo {color: color(blue)}');
      expect(css).to.equal(`.foo {color: ${colors.blue.base}}`);
    });

    it('replaces the color with the passed hue', async () => {
      const {css} = await runPlugin('.foo {color: color(blue, shade: dark)}');
      expect(css).to.equal(`.foo {color: ${colors.blue.dark}}`);
    });

    it('replaces multiple color functions', async () => {
      const {css} = await runPlugin('.foo {background: linear-gradient(to left, color(red), color(blue, shade: dark))}');
      expect(css).to.equal(`.foo {background: linear-gradient(to left, ${colors.red}, ${colors.blue.dark})}`);
    });

    it('throws an error when a non-existant shade is passed', () => (
      runPlugin('.foo {color: color(blue, shade: light);}')
        .then(() => {
          throw new Error('Expected plugin to throw an error, but it did not.');
        }, (error) => {
          expect(error.message).to.contain(`Available shades: ${Object.keys(colors.blue).map((color) => `'${color}'`).join(', ')}`);
        })
    ));
  });

  context('when options are passed', () => {
    it('uses the functionName in place of the default color function name', async () => {
      const {css} = await runPlugin('.foo {color: colour(red)}', {functionName: 'colour'});
      expect(css).to.equal(`.foo {color: ${colors.red}}`);
    });

    it('uses the baseName for the default base color key', async () => {
      const {css} = await runPlugin('.foo {color: color(blue)}', {baseName: 'dark'});
      expect(css).to.equal(`.foo {color: ${colors.blue.dark}}`);
    });

    it('uses the shadeName in place of the shade identifier', async () => {
      const {css} = await runPlugin('.foo {color: color(blue, darkness: dark)}', {
        shadeName: 'darkness',
      });
      expect(css).to.equal(`.foo {color: ${colors.blue.dark}}`);
    });
  });
});
