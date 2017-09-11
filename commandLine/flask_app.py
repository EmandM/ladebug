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
parser.add_argument('description')
parser.add_argument('userId')
parser.add_argument('stats')
parser.add_argument('stars')
parser.add_argument('exerciseId')

client = MongoClient()
db = client.debuggerTest #TODO don't forget to change this for deployment

class ExercisesList(Resource):
    # get all exercises
    def get(self):
        response = db.exercisesCollection.find({})
        return { 'data': dumps(response) }

    # deletes all exercises
    def delete(self):
        result = db.exercisesCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)


class SavedExercise(Resource):
    # get single exercise by id
    def get(self, exercise_id):
        response = db.exercisesCollection.find_one({'_id': ObjectId(exercise_id)})
        return { 'data': dumps(response) }

    # update single exercise by id
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
                'description': args['description'],
                'last_updated': datetime.datetime.now().isoformat()
            }
        })
        return { 'updated': exercise_id, 'debugInfo': jsonOutput }

    # delete single exercise by id
    def delete(self, exercise_id):
        response = db.exercisesCollection.delete_one({'_id': ObjectId(exercise_id)})
        return "Deleted " + str(response.deleted_count)


class SaveExercise(Resource):
    # insert single exercise
    def put(self):
        args = parser.parse_args()
        jsonOutput = debug_output.pythonStringToJson(args['codeString'])
        result = db.exercisesCollection.insert_one({
            'name': args['name'],
            'bug_lines': args['errorLines'],
            'debug_info': jsonOutput,
            'description': args['description'],
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
        return { 'inserted': created_id, 'debugInfo': jsonOutput }, 201


class Sandbox(Resource):
    # convert single sandbox code to JSON information
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return {'data': response}


class Stats(Resource):
    # get all stats
    def get(self):
        response = db.statsCollection.find({})
        #TODO what to do if response is null
        return { 'data': dumps(response) }

    # insert single stat
    def put(self):
        args = parser.parse_args()
        result = db.statsCollection.insert_one({
            'userId': args['userId'],
            'exerciseId': args['exerciseId'],
            'stats': args['stats']
        })
        return { 'inserted': dumps(result.inserted_id) }, 201

    # delete all stats
    def delete(self):
        result = db.statsCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)

class SavedStats(Resource):
    def get(self, exercise_id):
        response = db.statsCollection.find({'exerciseId': exercise_id})
        return { 'data': dumps(response) }


class Scores(Resource):
    # get all scores
    def get(self):
        response = db.scoresCollection.find({})
        return { 'data': dumps(response) }

    # insert single score
    def put(self):
        args = parser.parse_args()
        result = db.scoresCollection.insert_one({
            'userId': args['userId'],
            'exerciseId': args['exerciseId'],
            'stars': args['stars']
        })
        return { 'inserted': dumps(result.inserted_id) }, 201

    # delete all scores
    def delete(self):
        result = db.scoresCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)

class SavedScores(Resource):
    def get(self, user_id, exercise_id):
        response = db.scoresCollection.find({'userId': user_id, 'exerciseId': exercise_id})
        return { 'data': dumps(response) }

api.add_resource(ExercisesList, '/exercises-list')
api.add_resource(SavedExercise, '/exercise/<string:exercise_id>')
api.add_resource(SaveExercise, '/exercise')
api.add_resource(Sandbox, '/get-output')
api.add_resource(Stats, '/stats')
api.add_resource(SavedStats, '/stats/<string:exercise_id>')
api.add_resource(Scores, '/scores')
api.add_resource(SavedScores, '/scores/<string:user_id>/<string:exercise_id>')

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
