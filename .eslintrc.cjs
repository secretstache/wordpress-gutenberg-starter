module.exports = {
  root: true,
  extends: [
    '@roots/eslint-config/react',
  ],
  rules: {
    "indent": "off",
    "import/no-default-export": "warn",
    "no-console": "off",
    "no-plusplus": "off",
    "object-curly-newline": "off",
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "func-names": "off",
    "semi": [
      "error",
      "always",
      {
        "omitLastInOneLineBlock": true
      }
    ],
    "default-param-last": "off",
    "no-trailing-spaces": "off",
    "no-shadow": "off",
    "max-len": ["warn", { "code": 140 }],
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "radix": "off",
    "padding-line-between-statements": ["error", { "blankLine": "always", "prev": "*", "next": "return" }],
    "quote-props": ["error", "consistent"],
    "react/prop-types": 1,
    "react/jsx-indent": [
      "error",
      4
    ],
    "react/jsx-filename-extension": "off",
    "react/prefer-stateless-function": "off",
    "react/jsx-indent-props": [
      "warn",
      4
    ],
    "react/destructuring-assignment": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-danger": "off",
    "react/function-component-definition": [2, {
      "namedComponents": "arrow-function",
      "unnamedComponents": "arrow-function"
    }],
    "react/require-default-props": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-curly-newline": ["error", {
      "multiline": "consistent",
      "singleline": "consistent"
    }],
    "react/no-array-index-key": "warn",
    "jsx-quotes": ["warn", "prefer-double"],
  },
}
