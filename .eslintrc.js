module.exports = {
    extends: ['eslint-config-standard', 'plugin:react/recommended'],
    plugins: ['prettier', 'react'],
    parser: 'babel-eslint',
    rules: {
        curly: 'off',
        'space-before-function-paren': 'off',
        'prettier/prettier': 'error',
        // Prettier conflict
        'standard/computed-property-even-spacing': 'off',
        'promise/param-names': 'off',
        indent: 'off',
        // So we can use comma operator
        'no-sequences': 'off',
        'no-console': ['error', { allow: ['warn', 'error', 'debug'] }],
        'react/prop-types': 'off',
        'react/display-name': 'off'
    },
    overrides: [
        {
            // Cypress
            files: ['cypress/**/*.js'],

            globals: {
                context: true,
                cy: true
            }
        },
        {
            files: ['*.test.js', '*.spec.js', '*.test.ts', '*.spec.ts'],

            globals: {
                it: true,
                expect: true,
                beforeEach: true,
                describe: true
            }
        }
    ],

    settings: {
        react: {
            version: 'detect' // React version. "detect" automatically picks the version you have installed.
        }
    }
}
