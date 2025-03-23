module.exports = {
  preset: 'react-native',
  transform: {'^.+\\.ts?$': 'ts-jest'},
  testEnvironment: 'node',
  testMatch: 
  [
    "**/test/**/*.test.ts", // Match any `.test.ts` files in a `test` directory
    "**/test/**/*.spec.ts", // Match any `.spec.ts` files in a `test` directory
  ],
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/saluhud/components/$1",
    "^@styles/(.*)$": "<rootDir>/saluhud/styles/$1",
    "^@screens/(.*)$": "<rootDir>/saluhud/screens/$1",
    "^@resources/(.*)$": "<rootDir>/saluhud/resources/$1",
    "^@src/(.*)$": "<rootDir>/saluhud/src/$1",
    "^@root/(.*)$": "<rootDir>/$1"
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
