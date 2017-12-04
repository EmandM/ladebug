from flask import Flask, abort
import os
from flask_restful import reqparse, Api, Resource
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
import datetime

# Local files
import debug_output
import oauth
import tests

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
parser.add_argument('entryFunction')
parser.add_argument('testCases')

MONGO_URL = os.environ.get('MONGO_URL')
if not MONGO_URL:
    MONGO_URL = "mongodb://localhost:27017/heroku_ddnsv6wr"

client = MongoClient(MONGO_URL)
db = client.heroku_ddnsv6wr


# Add final newline to string
def add_newline(string):
    final_char = string[-1]
    if final_char != '\n':
        string += '\n'
    return string


class ExercisesList(Resource):
    # get all exercises
    def get(self):
        response = db.exercisesCollection.find({})
        return {'data': dumps(response)}

    # deletes all exercises
    def delete(self):
        result = db.exercisesCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)


class SavedExercise(Resource):
    # get single exercise by id
    def get(self, exercise_id):
        response = db.exercisesCollection.find_one({'_id': ObjectId(exercise_id)})
        return {'data': dumps(response)}

    # update single exercise by id
    def post(self, exercise_id):
        args = parser.parse_args()
        code_string = add_newline(args['codeString'])

        try:
            test_cases = tests.add_types(args['testCases'])
        except Exception as e:
            raise abort('400', type(e).__name__ + ': ' + str(e))

        json_output = debug_output.pythonStringToJson(code_string, args['entryFunction'], args['testCases'])
        db.exercisesCollection.update_one({
            '_id': ObjectId(exercise_id)
        }, {
            '$set': {
                'name': args['name'],
                'bug_lines': args['errorLines'],
                'code_string': code_string,
                'debug_info': json_output,
                'description': args['description'],
                'last_updated': datetime.datetime.now().isoformat(),
                'entry_function': args['entryFunction'],
                'test_cases': test_cases
            }
        })
        return {'updated': exercise_id, 'debugInfo': json_output}

    # delete single exercise by id
    def delete(self, exercise_id):
        response = db.exercisesCollection.delete_one({'_id': ObjectId(exercise_id)})
        return "Deleted " + str(response.deleted_count)


class SaveExercise(Resource):
    # insert single exercise
    def put(self):
        args = parser.parse_args()
        code_string = add_newline(args['codeString'])

        json_output = debug_output.pythonStringToJson(code_string, args['entryFunction'], args['testCases'])
        result = db.exercisesCollection.insert_one({
            'name': args['name'],
            'bug_lines': args['errorLines'],
            'debug_info': json_output,
            'description': args['description'],
            'created_on': datetime.datetime.now().isoformat(),
            'code_string': code_string,
            'last_updated': datetime.datetime.now().isoformat(),
            'entry_function': args['entryFunction'],
            'test_cases': tests.add_types(args['testCases'])
        })

        created_id = str(result.inserted_id)
        db.exercisesCollection.update_one({
            '_id': result.inserted_id
        }, {
            '$set': {
                'id': created_id
            }
        }, upsert=False)
        return {'inserted': created_id, 'debugInfo': json_output}, 201


class Sandbox(Resource):
    # convert single sandbox code to JSON information
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'], args['entryFunction'], args['testCases'])
        return {'data': response}

class Tests(Resource):
    # ensure test format is correct
    def post(self):
        args = parser.parse_args()

        try:
            test_cases = tests.add_types(args['testCases'])
        except Exception as e:
            return { 'valid': False, 'error': type(e).__name__ + ': ' + str(e) }

        return { 'valid': True, 'data': test_cases}


class Stats(Resource):
    # get all stats
    def get(self):
        response = db.statsCollection.find({})
        # TODO what to do if response is null
        return {'data': dumps(response)}

    # insert single stat
    def put(self):
        args = parser.parse_args()
        userId = oauth.validate_user_id(args['userId'])
        result = db.statsCollection.insert_one({
            'userId': userId,
            'exerciseId': args['exerciseId'],
            'stats': args['stats']
        })
        return {'inserted': dumps(result.inserted_id)}, 201

    # delete all stats
    def delete(self):
        result = db.statsCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)


class SavedStats(Resource):
    def get(self, exercise_id):
        response = db.statsCollection.find({'exerciseId': exercise_id})
        return {'data': dumps(response)}


class Scores(Resource):
    # get all scores
    def get(self):
        response = db.scoresCollection.find({})
        return {'data': dumps(response)}

    # delete all scores
    def delete(self):
        result = db.scoresCollection.delete_many({})
        return "Deleted " + str(result.deleted_count)


class SingleScore(Resource):
    def get(self, exercise_id):
        args = parser.parse_args()
        userId = oauth.validate_user_id(args['userId'])
        response = db.scoresCollection.find({'userId': userId, 'exerciseId': exercise_id})
        return {'data': dumps(response)}

    # insert single score
    def post(self, exercise_id):
        args = parser.parse_args()
        userId = oauth.validate_user_id(args['userId'])
        existing = db.scoresCollection.find_one({'userId': userId, 'exerciseId': exercise_id})
        if (existing and int(existing['stars']) >= int(args['stars'])):
            return {'updated': dumps(existing)}

        result = db.scoresCollection.update_one(
            {
                'userId': userId,
                'exerciseId': exercise_id
            },
            {
                '$set': {
                    'stars': args['stars']
                }
            }, upsert=True
        )
        return {'updated': dumps(result.upserted_id)}


class AllUserScores(Resource):
    def get(self):
        args = parser.parse_args()
        userId = oauth.validate_user_id(args['userId'])
        response = db.scoresCollection.find({'userId': userId})
        return {'data': dumps(response)}


api.add_resource(ExercisesList, '/exercises-list')
api.add_resource(SavedExercise, '/exercise/<string:exercise_id>')
api.add_resource(SaveExercise, '/exercise')
api.add_resource(Sandbox, '/get-output')
api.add_resource(Tests, '/validate-tests')
api.add_resource(Stats, '/stats')
api.add_resource(SavedStats, '/stats/<string:exercise_id>')
api.add_resource(Scores, '/debug-scores')

# Send userId in get body
api.add_resource(SingleScore, '/scores/<string:exercise_id>')
api.add_resource(AllUserScores, '/scores')

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
