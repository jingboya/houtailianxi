module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 自定义规则配置对象
    // key:规则代码
    // value:规则说明
    // "off" of 0 -关闭规则，什么都不做
    // "warn" or 1 -讲规则视为一个警告（不会影响退出码），警告并退出
    // "error" or 2 -将规则视为一个错误（退出码为1），报错并退出
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    // 'semi':['error', 'always']
    // 'semi':'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
