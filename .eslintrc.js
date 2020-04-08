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
        parser: 'babel-eslint',
        ecmaVersion: 2018,
        sourceType: 'module'
    },

    plugins: ['vue'],

    rules: {
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn'
    },

    'extends': [
      'eslint:recommended',
      'plugin:vue/essential'
    ]
}
