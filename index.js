const fs = require('fs');
const path = require('path');

const THEME_FILE = 'theme.js';
const DIRS = ['src', 'lib'];

const currentDir = process.cwd();
const filesToTry = DIRS.map(dir => path.join(currentDir, dir, THEME_FILE));
const modulePath = filesToTry.find(fs.existsSync);

if (!modulePath) {
	throw Error(`Theme not found at ${currentDir}/<src|lib>/theme.js`);
}

try {
	module.exports = require(modulePath);
} catch (err) {
	throw Error(`Cannot load theme at ${modulePath}: ${err.message}`);
}
