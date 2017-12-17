// @ts-check

const { dirname, resolve } = require('path');
const dlv = require('dlv');

const VAR_NAME = 'theme';

let values = {};

/**
 * @param {object} node
 * @param {object} state
 * @return {string}
 */
function getNodeSource(node, state) {
	return state.file.code.substring(node.start, node.end);
}

/**
 * @param {object} node
 * @param {object} state
 * @return {string}
 */
function getAddress(node, state) {
	return getNodeSource(node, state).substring(VAR_NAME.length + 1);
}

/**
 * @param {object} path
 * @param {object} state
 * @return {object[]}
 */
function getThemeExpressions(path, state) {
	return path.node.expressions.filter(x => getNodeSource(x, state).startsWith(`${VAR_NAME}.`));
}

/**
 * @param {object} node
 * @param {string} addr
 * @param {object} state
 * @return {any}
 */
function getValue(node, addr, state) {
	const value = dlv(values, addr);
	if (value === undefined) {
		throw state.file.buildCodeFrameError(
			node,
			`Value of theme.${addr} is undefined`,
			ReferenceError
		);
	}
	return value.toString();
}

/**
 * @param {object} path
 * @param {object[]} themeExpressions
 * @param {object} state
 * @param {object} t
 * @return {object}
 */
function buildTemplateElement(path, themeExpressions, state, t) {
	const quasis = path.node.quasis;

	for (const expr of themeExpressions) {
		for (let idx = 0; idx < quasis.length; idx++) {
			const quasi = quasis[idx];
			const next = quasis[idx + 1];
			if (next && (expr.start > quasi.end, expr.end < next.start)) {
				// Inline expression between two quasis:
				// quasi + expression value + next quasi
				const addr = getAddress(expr, state);
				const value = getValue(expr, addr, state);
				quasi.value.raw += value + next.value.raw;
				quasi.value.cooked += value + next.value.cooked;
				quasi.end = next.end;

				// Remove the next quasi
				quasis.splice(idx + 1, 1);
				break;
			}
		}
	}

	const expressions = path.node.expressions;
	const newExpressions = expressions.filter(x => !themeExpressions.includes(x));

	return t.templateLiteral(quasis, newExpressions);
}

/**
 * @param {object} path
 * @param {string} sourceDir
 * @return {object}
 */
function loadValues(path, sourceDir) {
	const relativePath = path.node.source.value;
	const absolutePath = resolve(sourceDir, relativePath);
	return require(absolutePath);
}

/**
 * @param {object} babel
 * @return {object}
 */
function plugin(babel) {
	const t = babel.types;

	return {
		name: 'theme',
		visitor: {
			Program(programPath, state) {
				const sourceDir = dirname(state.file.opts.filename);
				programPath.traverse({
					ImportDeclaration(path) {
						if (
							t.isImportDefaultSpecifier(path.node.specifiers[0]) &&
							path.node.specifiers[0].local.name === VAR_NAME
						) {
							values = loadValues(path, sourceDir);
						}
					},
					TemplateLiteral(path) {
						const themeExpressions = getThemeExpressions(path, state);
						if (themeExpressions.length > 0) {
							path.replaceWith(buildTemplateElement(path, themeExpressions, state, t));
						}
					},
				});
			},
		},
	};
}

module.exports = plugin;
