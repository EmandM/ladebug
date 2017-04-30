// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

import 'angular';
import 'angular-mocks/angular-mocks';
import forEach from 'lodash/forEach';

const context = require.context('./app', true, /\.js$/);

forEach(context.keys(), context);
