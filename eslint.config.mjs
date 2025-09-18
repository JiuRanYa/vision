import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/dist/**/*',
      '**/public/**/*',
      '**/node_modules/**/*',
      '**/src/assets/**/*',
      '**/src/metronic/**/*',
      '**/deploy/**/*',
    ],
  },
  {
    rules: {
      'node/prefer-global/process': 'off',
      'ts/no-use-before-define': 'off',
      'vue/no-reserved-component-names': 'off',
      'no-template-curly-in-string': 'off',
      'vue/no-mutating-props': 'off',
      'vue/max-attributes-per-line': ['error', {
        singleline: 2,
        multiline: 1,
      }],
    },
  },
  {
    rules: {
      'style/no-tabs': 'off',
    },
    files: ['**/scripts/**/*'],
  },
)
