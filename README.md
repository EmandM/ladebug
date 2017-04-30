# angularjs-seed

[![Dependency Status](https://david-dm.org/EmandM/learnToDebug/status.svg)](https://david-dm.org/EmandM/learnToDebug#info=dependencies) [![devDependency Status](https://david-dm.org/EmandM/learnToDebug/dev-status.svg)](https://david-dm.org/EmandM/learnToDebug#info=devDependencies)

This is set up with [AngularJs](https://angularjs.org/), [Angular Material](https://material.angularjs.org/latest/), [Ui Router](https://ui-router.github.io/), [Restangular](https://github.com/mgonto/restangular), [Lodash](https://lodash.com/), [MomentJs](https://momentjs.com/), and [Font Awesome](http://fontawesome.io/).

>Warning: Make sure you're using the latest version of Node.js and NPM

### Quick start

> Clone/Download the repo then add components inside [`/src/app/components`](/src/app/components)
> Access these components from `app.routing.js` inside [`/src/app/app.routing.js`](/src/app/app.routing.js)

```bash
# clone the repo
$ git clone https://github.com/EmandM/learnToDebug.git web-app

# change directory to your app
$ cd web-app

# install the dependencies with npm
$ npm install

# start the server
$ npm run dev
```

go to [http://localhost:8080](http://localhost:8080) in your browser.

## Developing

### Build files

* single run: `npm run build`
* build files and watch: `npm run dev`

### Linter

This project has Javascript linting built in. The webpack server will not start if there are linting errors.
Most code editors will show lint errors inside the editor with some setup.
* Run linter: `npm run lint`
* Fix common errors: `npm run lint-fix`

## Testing

#### 1. Unit Tests

* single run: `npm run test`
* live mode (TDD style): `npm run test-watch`

# License

[MIT](/LICENSE)
