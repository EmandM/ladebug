from flask import Flask, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
import debug_output
import os

app = Flask(__name__)
CORS(app)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('codeString')

programs = {}

class ExercisesGet(Resource):
    def get(self, program_id):
        return {program_id : programs[program_id]}

class ExercisesPut(Resource):
    def put(self, program_id, inputFile):
        #hardcoded for local files - will not work
        programs[program_id] = debug_output.pythonFileToJson(os.getcwd() + "/" + inputFile)
        return "Inserted"

class ExercisesPost(Resource):
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return { 'data': response }

#class Sandbox(Resource):
#    def post(self, inputString):
#        return sandBoxConvert(inputString)

api.add_resource(ExercisesGet, '/<string:program_id>')
api.add_resource(ExercisesPut, '/<string:program_id>/<string:inputFile>')
api.add_resource(ExercisesPost, '/get-output')

if __name__ == '__main__':
    app.run(debug=True)
