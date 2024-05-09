module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true
	},
	extends: ['standard', 'plugin:react/recommended'],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	plugins: ['react'],
	rules: {
		semi: ['error', 'always'],
		camelcase: ['error', { properties: 'never', ignoreDestructuring: true }],
		quotes: ['error', 'single'],
		'no-unused-vars': 'error',
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
