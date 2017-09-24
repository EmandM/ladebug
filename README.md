# Ladebug

Ladebug is an online tool aimed at helping novice programmers improve their debugging skills.


### Run Instructions
Currently the AngularJS client points to a hosted server, so only the client needs to be run locally

Ensure you have the latest version of [NodeJS](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm)

```bash
# clone the repo
$ git clone https://github.com/EmandM/ladebug.git

# change directory to the project
$ cd ladebug

# install the dependencies with npm
$ npm install

# run the client
$ npm run dev
```

go to [http://localhost:8080](http://localhost:8080) in your browser for the student home page or [http://localhost:8080/admin](http://localhost:8080/admin) for the admin home page.



### Local Development
Follow these steps to run the server locally.

#### Flask Server
Install Python 3.x and the corresponding pip on your machine. https://www.python.org/downloads/.
Ensure both are added to your PATH. The python installer gives the option to do this automatically.




```bash
# Install the necessary python libraries
$ pip install Flask Flask-Cors Flask-RESTful Werkzeug pymongo oauth2client

```


#### MongoDB Database
Download and install [MongoDB](https://www.mongodb.com/download-center?jmp=tutorials&_ga=2.254687240.1618150711.1506248764-1727796482.1505700843)


#### AngularJS Client
Update line 8 of [app.config.js](https://github.com/EmandM/learnToDebug/blob/master/src/app/app.config.js) to point to the flask server.

```javascript
restangularProvider.setBaseUrl('http://127.0.0.1:5000');
```

#### Run local installation 

```bash
# In one command prompt run
$ npm run dev

# In another command prompt run
$ python ./commandLine/flask_app.py

# Or explicitly run pyton3 if another python version is installed
$ python3 ./commandLine/flask_app.py

```

