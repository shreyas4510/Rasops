/**
 *  * For a detailed explanation regarding each configuration property, visit:
 *  * https://jestjs.io/docs/configuration
 *  */
/** @type {import('jest').Config} */
const config = {
    clearMocks: true,
    coverageProvider: 'v8',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/api/utils'],
    testEnvironment: 'node',
    testRegex: 'src/api/tests/modules/.*\\.test\\.js$',
    coverageReporters: ['lcov', 'text', 'html']
};
export default config;
