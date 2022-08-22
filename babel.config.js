module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14.19.13'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@domain': './src/domain',
        '@infra': './src/infra',
        '@presentation': './src/presentation',
        '@util': './src/util',
        '@data': './src/data',
        '@damin': './src/main',
        '@main': './src/main',
        '@app': './src/app'
      }
    }],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ],
  ignore: [
    '**/*.spec.ts',
    '**/*.test.ts',
    'test/**/*.spec.ts'
  ]
}
