const deepmerge = require('deepmerge');

module.exports = function(...objects) {
	return deepmerge.all(objects);
};
