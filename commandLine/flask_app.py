from flask import Flask, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from pymongo import MongoClient
import debug_output
import os

app = Flask(__name__)
CORS(app)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('codeString')

client = MongoClient()
db = client.debuggerTest #TODO don't forget to change this for deployment

class ExercisesGetAll(Resource):
    def get(self):
        output = ''
        exercises = db.exercisesCollection.find()
        for exercise in exercises:
            output += exercise.get('exercise_id')
            output += ', '
            output += exercise.get('data')
            output += '; '
        return output

class ExercisesPut(Resource):
    def put(self):
        result = db.exercisesCollection.insert_one({"exercise_name": "1", "data": "hello", "bug_line": "3"})
        return "Insert"

class ExercisesPost(Resource):
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return { 'data': response }

api.add_resource(ExercisesGetAll, '/get-exercises')
api.add_resource(ExercisesPut, '/insert-exercise')
api.add_resource(ExercisesPost, '/get-output')

if __name__ == '__main__':
    app.run(debug=True)
