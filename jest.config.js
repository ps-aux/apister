module.exports = {
    moduleDirectories: ['node_modules', '.'],
    transform: {
        '^.*': 'babel-jest'
    },
    testEnvironment: 'node',
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ['jest-extended', './setupJest.js']
}
