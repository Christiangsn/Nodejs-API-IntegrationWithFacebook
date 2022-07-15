module.exports = {
  collectCoverage: false, // Qualquer teste gera um coverage
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'], // Definir a partir de qual pasta gerar os testes
  coverageDirectory: 'coverage', // Gerar pasta separada de coverages
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1'
  },
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ], // Onde fica o diretorio de testes
  transform: {
    '\\.ts$': 'ts-jest'
  }
}
