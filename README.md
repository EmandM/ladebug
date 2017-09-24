# Ladebug

Ladebug is an online tool aimed at helping novice programmers improve their debugging skills.

[![Dependency Status](https://david-dm.org/EmandM/learnToDebug/status.svg)](https://david-dm.org/EmandM/learnToDebug#info=dependencies) [![devDependency Status](https://david-dm.org/EmandM/learnToDebug/dev-status.svg)](https://david-dm.org/EmandM/learnToDebug#info=devDependencies)

This is set up with [AngularJs](https://angularjs.org/), [Angular Material](https://material.angularjs.org/latest/), [Ui Router](https://ui-router.github.io/), [Restangular](https://github.com/mgonto/restangular), [Lodash](https://lodash.com/), [MomentJs](https://momentjs.com/), and [Font Awesome](http://fontawesome.io/).

>Warning: Make sure you're using the latest version of Node.js and NPM

### Installation
#### Ladebug
```bash
# clone the repo
$ git clone https://github.com/EmandM/learnToDebug.git web-app

# change directory to the project
$ cd web-app

# install the dependencies with npm
$ npm install
```

#### Flask
Follow the instructions at http://flask.pocoo.org/docs/0.12/installation/

#### MongoDB
Follow the instructions at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

### Run Instructions
```bash
# change directory to where the project is
$ cd web-app

# start the server
$ npm run dev

# change directory to commandLine within the project
$ cd commandLine/

# start the Flask server
$ python flask_app.py

# start MongoDB
$ C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe

# connect to MongoDB
$ C:\Program Files\MongoDB\Server\3.4\bin\mongo.exe
```

go to [http://localhost:8080](http://localhost:8080) in your browser.
