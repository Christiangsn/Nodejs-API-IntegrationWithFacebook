module.exports = {
  collectCoverage: false, // Qualquer teste gera um coverage
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/index.ts'
  ], // Definir a partir de qual pasta gerar os testes
  coverageDirectory: 'coverage', // Gerar pasta separada de coverages
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@data/(.*)': '<rootDir>/src/data/$1',
    '@util/(.*)': '<rootDir>/src/util/$1',
    '@infra/(.*)': '<rootDir>/src/infra/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@main/(.*)': '<rootDir>/src/main/$1',
    '@app/(.*)': '<rootDir>/src/app/$1'
  },
  testMatch: ['**/**.spec.ts'],
  modulePaths: [
    '<rootDir>',
    '/home/some/other/path'
  ],
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ], // Onde fica o diretorio de testes
  transform: {
    '\\.ts$': 'ts-jest'
  }
}
