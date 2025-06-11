module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Môi trường giả lập DOM cho React components
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // File setup cho Jest
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Ánh xạ alias `@` thành `src`
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/pages/api/**', // Bỏ qua API routes nếu không muốn coverage
      '!src/server/config/**', // Bỏ qua file cấu hình
    ],
  };