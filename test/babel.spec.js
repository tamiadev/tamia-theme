const babel = require('babel-core');
const plugin = require('../babel');

const compile = source => babel.transform(source, { plugins: [plugin] }).code;

test('do not touch unrelated code', () => {
	const result = compile(`
import styled from "react-emotion";
import theme from "./test/fixtures/theme";
const a = theme.space.xl;
const Container = styled("div")\`
  color: deepskyblue;
  margin-bottom: \${a};
\`;
	`);
	expect(result).toMatchSnapshot();
});

test('inline theme variables', () => {
	const result = compile(`
import styled from "react-emotion";
import theme from "./test/fixtures/theme";
const Container = styled("div")\`
  color: deepskyblue;
  margin-bottom: \${theme.space.xl};
\`;
	`);
	expect(result).toMatchSnapshot();
});

test('inline multiple theme variables', () => {
	const result = compile(`
import styled from "react-emotion";
import theme from "./test/fixtures/theme";
const Container = styled("div")\`
  color: deepskyblue;
  margin-top: \${theme.space.s};
  margin-bottom: \${theme.space.m};
  margin-left: \${theme.space.l};
  margin-right: \${theme.space.xl};
\`;
	`);
	expect(result).toMatchSnapshot();
});

test('works with any level of nesting', () => {
	const result = compile(`
import styled from "react-emotion";
import theme from "./test/fixtures/theme";
const Container = styled("div")\`
  color: deepskyblue;
  font-family: \${theme.font};
  margin: \${theme.space.l};
  padding: \${theme.foo.bar.baz};
\`;
	`);
	expect(result).toMatchSnapshot();
});

test('throw when theme file not found', () => {
	const fn = () =>
		compile(`
import styled from "react-emotion";
import theme from "./pizza";
const Container = styled("div")\`
  margin: \${theme.pizza.salami};
\`;
	`);
	expect(fn).toThrowError('Cannot find module');
});

test('throw when value not found', () => {
	const fn = () =>
		compile(`
import styled from "react-emotion";
import theme from "./test/fixtures/theme";
const Container = styled("div")\`
  margin: \${theme.pizza.salami};
\`;
	`);
	expect(fn).toThrowError('Value of theme.pizza.salami is undefined');
});
