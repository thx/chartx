module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-extra-semi": 0,
        "no-extra-boolean-cast":0,
        "no-console":0,
        "no-inner-declarations":0,
        "no-unreachable":0,
        "no-unused-vars":0
    },
    "overrides": [
        {
            "files": ["./gulpfile.js"],
            "rules": {
                "require-jsdoc": "off"
            }
        }
    ]
};