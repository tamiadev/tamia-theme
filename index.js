const path = require('path');

const THEME_FILE = 'theme';

const modulePath = path.join(process.cwd(), THEME_FILE);

try {
	module.exports = require(modulePath);
} catch (err) {
	throw Error(`Theme not found at ${modulePath}`);
}
