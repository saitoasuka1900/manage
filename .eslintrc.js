module.exports = {
    env: {
        browser: true,
        es6: true,
        amd: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:vue/essential'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        parser: 'babel-eslint', // 待调，新建vue init webpack 把原项目移到新项目下，删除旧的即可
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['vue'],
    rules: {}
}
