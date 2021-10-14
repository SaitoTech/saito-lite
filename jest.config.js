module.exports = {
    verbose: true,
    moduleFileExtensions: [
        'js',
        'node',
    ],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/test/unit/coverage',
    collectCoverageFrom: [
        'tests/**/*.{js}',
    ],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/mods/"
    ],
    coverageReporters: [
        'json',
        'lcov',
        'text-summary'
    ],
}
  