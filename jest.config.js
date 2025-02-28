module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 10000, // MongoDB operations might need more time
};
