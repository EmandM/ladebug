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

class ExercisesList(Resource):
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
    def get(self, exercise_id):
        response = db.exercisesCollection.find({'_id': exercise_id})
        #TODO check if response is null
        return { 'data': response }


    def put(self):
        args = parser.parse_args()
        #result = db.exercisesCollection.insert_one({'name': args['name'], etc}) TODO
        resultA = db.exercisesCollection.insert_one({'name': 'exercise Awatermelondreableepblopbleepbadadoom', 'data': 'hello', 'bug_line': '1'})
        resultB = db.exercisesCollection.insert_one({'name': 'exercise B', 'data': 'helo', 'bug_line': '2'})
        resultC = db.exercisesCollection.insert_one({'name': 'exercise C', 'data': 'hi', 'bug_line': '3'})
        return "Inserted " + str(resultA.inserted_id) + ", " + str(resultB.inserted_id)  + ", " + str(resultC.inserted_id)



class Sandbox(Resource):
    def post(self):
        args = parser.parse_args()
        response = debug_output.pythonStringToJson(args['codeString'])
        return {'data': response}


api.add_resource(ExercisesList, '/exercises-list')
api.add_resource(SavedExercise, '/exercise/<string:exercise_id>')
api.add_resource(Sandbox, '/get-output')

if __name__ == '__main__':
    app.run(debug=True)
