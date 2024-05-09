module.exports = {
	env: {
		es2021: true,
		browser: true,
		node: true,
		jest: true
	},
	extends: 'standard',
	overrides: [
		{
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module'
	},
	rules: {
		semi: ['error', 'always'],
		camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
		quotes: ['error', 'single'],
		'no-unused-vars': 'error',
		'no-console': 'warn',
		'no-extra-semi': 'error',
		eqeqeq: 'error',
		'no-undef': 'error',
		'comma-dangle': ['error', 'never'],
		'arrow-spacing': 'error',
		'prefer-const': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'object-curly-spacing': ['error', 'always'],
		'no-trailing-spaces': 'error',
		'eol-last': ['error', 'always']
	}
};
