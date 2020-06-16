module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    'airbnb-base'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    parser: 'babel-eslint'
  },
  rules: {
    'comma-dangle': 'off',
    'max-len': 0,
    'space-before-function-paren': ['error', 'always'],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', {
      'props': true,
      'ignorePropertyModificationsFor': ['state']
    }],
    'no-shadow': ['error', {
      'builtinGlobals': false,
      'hoist': 'never',
      'allow': ['state']
    }],
    'object-shorthand': 'off',
    'no-console': 'off',
    'semi': ['warn', 'never']
  }
};
