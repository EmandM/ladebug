from flask import Flask
from flask_restful import Resource, Api
import py_logger
import os

app = Flask(__name__)
api = Api(app)

class OutputJSON(Resource):
    def get(self):
        return py_logger.call_me(os.getcwd() + "/test.py")
        #return "Hello World"

api.add_resource(OutputJSON, '/')

if __name__ == '__main__':
    app.run(debug=True)
