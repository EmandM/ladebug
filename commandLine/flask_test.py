from flask import Flask, request
from flask_restful import Resource, Api
import py_logger
import os

app = Flask(__name__)
api = Api(app)

programs = {}
#programs["program0"] = "hola"

class ExercisesGet(Resource):
    def get(self, program_id):
        return {program_id : programs[program_id]}

class ExercisesPut(Resource):
    def put(self, program_id, inputFile):
        #hardcoded for local files - will not work
        programs[program_id] = py_logger.pythonFileToJson(os.getcwd() + "/" + inputFile)
        return "Inserted"

#class Sandbox(Resource):
#    def post(self, inputString):
#        return sandBoxConvert(inputString)

api.add_resource(ExercisesGet, '/<string:program_id>')
api.add_resource(ExercisesPut, '/<string:program_id>/<string:inputFile>')

if __name__ == '__main__':
    app.run(debug=True)
