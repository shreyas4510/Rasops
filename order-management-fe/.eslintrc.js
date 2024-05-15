module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    extends: ['standard', 'plugin:react/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react'],
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        camelcase: ['error', { properties: 'always' }],
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
        'eol-last': ['error', 'always'],
        quotes: ['error', 'single', { allowTemplateLiterals: true }],
        'linebreak-style': ['error', 'unix'],
        'space-before-function-paren': 'off',
        'generator-star-spacing': 'off',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'external',
                        position: 'before'
                    }
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true
                }
            }
        ]
    }
};
