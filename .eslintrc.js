module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 末尾分号
    semi: ['warn', 'always'],
    // 双引号
    // quotes: ["warn", "double"],
    // 函数前空格，不检测
    'space-before-function-paren': 0,
    // 最后面需要换行符
    'eol-last': 0,
    'no-tabs': 0,
    'no-proto': 0,
    'no-undef': 0,
    'no-useless-call': 0,
    'no-caller': 0,
    'no-unused-vars': 1,
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    camelcase: 0,
    eqeqeq: 0,
    'no-useless-escape': 0,
    'prefer-const': 0
  }
};
