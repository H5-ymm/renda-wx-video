module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true
    },
    extends: 'standard',
    // required to lint *.wpy files
    plugins: [
        'html'
    ],
    settings: {
        'html/html-extensions': ['.html', '.wpy']
    },
    'rules': {
        "no-constant-condition": 1,
        "no-extend-native": "off",
        "no-new": 'off',
        "no-fallthrough": 'off',
        "no-unreachable": 1,
        "no-unused-vars": 1,
        "key-spacing": 'off',
        "no-tabs": 'off',
        "smart-tabs": 'off',
        // 语句强制分号结尾
        "semi": 'off',
        'space-before-blocks': 'off',
        'space-before-function-paren': 'off',
        'indent': 'off',
        // allow paren-less arrow functions
        'arrow-parens': 0,
        'eol-last': 0,
        // allow async-await
        'generator-star-spacing': 'off',
        'vue/require-v-for-key': 'off',
        'no-undef': 'off',
    }
}
