from flask import Flask, request
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
import debug_output
import datetime
import os

app = Flask(__name__)
CORS(app)
api = Api(app)
parser = reqparse.RequestParser()
parser.add_argument('codeString')
parser.add_argument('name')
parser.add_argument('errorLines')
parser.add_argument('userEmail')
parser.add_argument('userStats')
parser.add_argument('exerciseName')

client = MongoClient()
db = client.debuggerTest #TODO don't forget to change this for deployment

class ExercisesList(Resource):
    # get all exercises
    def get(self):
        response = db.exercisesCollection.find({})
        #TODO what to do if response is null
        #if (response) {
        return { 'data': dumps(response) }

    # DELETES ALL
    def delete(self):
        result = db.exercisesCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)


class SavedExercise(Resource):
    # get single exercise by id
    def get(self, exercise_id):
        response = db.exercisesCollection.find_one({'_id': ObjectId(exercise_id)})
        #TODO check if response is null
        return { 'data': dumps(response) }

    # update single exercise by id
    # DOESN'T CHECK IF ARGUMENTS EXIST
    def post(self, exercise_id):
        args = parser.parse_args()
        jsonOutput = debug_output.pythonStringToJson(args['codeString'])
        db.exercisesCollection.update_one({
            '_id': ObjectId(exercise_id)
        }, {
            '$set': {
                'name': args['name'],
                'bug_lines': args['errorLines'],
                'debug_info': jsonOutput,
                'last_updated': datetime.datetime.now().isoformat()
            }
        })
        return { 'updated': exercise_id}

    # delete single exercise by id
    def delete(self, exercise_id):
        response = db.exercisesCollection.delete_one({'_id': ObjectId(exercise_id)})
        return "Deleted " + str(response.deleted_count)


class SaveExercise(Resource):
    def put(self):
        args = parser.parse_args()
        jsonOutput = debug_output.pythonStringToJson(args['codeString'])
        result = db.exercisesCollection.insert_one({
            'name': args['name'],
            'bug_lines': args['errorLines'],
            'debug_info': jsonOutput,
            'created_on': datetime.datetime.now().isoformat(),
            'last_updated': datetime.datetime.now().isoformat()
        })

        created_id = str(result.inserted_id)
        db.exercisesCollection.update_one({
            '_id': result.inserted_id
        }, {
            '$set': {
                'id': created_id
            }
        }, upsert=False)
        return { 'inserted': created_id }, 201

class Sandbox(Resource):
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return {'data': response}

class Stats(Resource):
    # insert one new stat
    def put(self):
        args = parser.parse_args()
        result = db.statsCollection.insert_one({
            'userEmail': args['userEmail'],
            'exerciseName': args['exerciseName'],
            'userStats': args['userStats']
        })
        return { 'inserted': dumps(result.inserted_id) }, 201

    # get all stats
    def get(self):
        response = db.statsCollection.find({})
        #TODO what to do if response is null
        return { 'data': dumps(response) }

    # delete all stats
    def delete(self):
        result = db.statsCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)

api.add_resource(ExercisesList, '/exercises-list')
api.add_resource(SavedExercise, '/exercise/<string:exercise_id>')
api.add_resource(SaveExercise, '/exercise')
api.add_resource(Sandbox, '/get-output')
api.add_resource(Stats, '/stats')

if __name__ == '__main__':
    app.run(debug=True)
