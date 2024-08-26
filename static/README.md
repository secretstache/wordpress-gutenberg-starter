# SSM Static Boilerplate

Static boilerplate which contains a starting static development point for SSM projects.

## Uses

- [11ty](https://www.11ty.dev/) as static site generator.
- [Nunjucks](https://mozilla.github.io/nunjucks/) as template engine.
- [Eslint](https://eslint.org/), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/).
- [Webpack](https://webpack.js.org/).

## Requirements

- [NodeJS](https://nodejs.org/en/) (20.9.0 or higher)

## Getting Started

1. Install dependencies:

```
yarn install
```

2. Run in development mode:

```
yarn run start
```

3. Or build for production:

```
yarn run build
```

## Notes

- Update the URL prefix in the `package.json` file under `vars[prefix]`  if the site is located in a subdirectory.


- Set the project type to `blocks` in `package.json` file under `vars[project]` when developing for WordPress Gutenberg blocks.


- Run `yarn run lint` to lint the project.


- Run `yarn run prettier:fix` to beautify the files.

Install via Composer:

```bash
$ composer require ssm/static-boilerplate
```