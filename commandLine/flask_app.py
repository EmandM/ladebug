from flask import Flask, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps
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
        response = db.exercisesCollection.find({})
        #TODO what to do if response is null
        #if (response) {
        return { 'data': dumps(response) }

class ExercisesGetOne(Resource):
    def get(self):
        args = parser.parse_args()
        response = db.exercisesCollection.find({'_id': args['exerciseId']})
        #TODO check if response is null
        #if (response) {
        return { 'data': response }

class ExercisesPut(Resource):
    def put(self):
        #args = parser.parse_args()
        #result = db.exercisesCollection.insert_one({'name': args['name'], etc}) TODO
        resultA = db.exercisesCollection.insert_one({'name': 'exercise A', 'code': 'print(hello A)', 'trace': '', 'bug_line': '1'})
        resultB = db.exercisesCollection.insert_one({'name': 'exercise B', 'code': 'print(helo B)', 'trace': '', 'bug_line': '2'})
        resultC = db.exercisesCollection.insert_one({'name': 'exercise C', 'code': 'print(hi C)', 'trace': '', 'bug_line': '3'})
        return "Inserted " + str(resultA.inserted_id) + ", " + str(resultB.inserted_id)  + ", " + str(resultC.inserted_id)

class ExercisesPost(Resource):
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return { 'data': response }

class ExercisesDeleteAll(Resource):
    def delete(self):
        result = db.exercisesCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)

api.add_resource(ExercisesGetAll, '/exercises-list')
api.add_resource(ExercisesGetOne, '/get-exercise')
api.add_resource(ExercisesPut, '/insert-exercise')
api.add_resource(ExercisesPost, '/get-output')
api.add_resource(ExercisesDeleteAll, '/delete-exercises')

if __name__ == '__main__':
    app.run(debug=True)
