const path = require('path');

const indexPath = '../index';
const cwd = process.cwd();

afterEach(() => {
	process.chdir(cwd);
	jest.resetModules();
});

test('load theme', () => {
	process.chdir(path.resolve(__dirname, 'fixtures'));
	const result = require(indexPath);
	expect(result).toMatchSnapshot();
});

test('throw when theme file not found', () => {
	process.chdir(__dirname);
	const fn = () => require(indexPath);
	expect(fn).toThrow('Theme not found');
});
