const merge = require('../merge');

test('merge objects', () => {
	const result = merge({ a: 1, b: 2 }, { c: 3 }, { a: 42 });
	expect(result).toMatchSnapshot();
});
