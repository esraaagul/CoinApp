module.exports = {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom", // Jest'in jsdom test ortamını kullanmasını sağlar
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
