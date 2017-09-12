import angular from 'angular';
import some from 'lodash/some';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import GuidHelper from '../../helpers/guid.helper';

import template from './exercises-list.template.html';
import './exercises-list.scss';

class exercisesListController {
  constructor(exerciseService, authService, scoresService, $state, $mdDialog) {
    this.exerciseService = exerciseService;
    this.authService = authService;
    this.scoresService = scoresService;
    this.$state = $state;
    this.$mdDialog = $mdDialog;

    this.averageStats = [];
    this.exercisesStars = [];
    this.stars = new Array(5);
  }

  $onInit() {
    if (!this.exerciseList) {
      this.loadExercises();
    }

    this.editState = (this.isAdmin) ? 'editexercise' : 'debugexisting';
  }

  $onChanges(changesObj) {
    if (changesObj.exerciseList) {
      this.checkExercisesExist();
    }
  }

  loadExercises() {
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
        // response always 'true' and an object even if empty (is not null)
        // therefore check to see if it contains exercises
        this.checkExercisesExist();
        return this.getStars();
      })
      .then((response) => {
        console.log(response);
        // response is the return getStars(); value where true means user logged in
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  getStars() {
    return this.authService.getCurrentUserId()
      .then((userId) => {
        if (userId === -1) {
          return false;
        }

        // TODO
        // remove this hard coded when auth loaded before page bug fixed
        userId = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwM2IyODU1YTkxNDM4NTcwY2E3Mjg1MDQ5MTc0MWU5NmJkOTllZjgifQeyJhenAiOiI3MjgwNDQxMTk5NTAtbXBjZWEwMTgzbDdjODdsZmx1dGRpZGUxdmZkbXZqcmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3MjgwNDQxMTk5NTAtbXBjZWEwMTgzbDdjODdsZmx1dGRpZGUxdmZkbXZqcmIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA4NjEwMDY1ODA5NzE5ODI4MjUiLCJoZCI6ImF1Y2tsYW5kdW5pLmFjLm56IiwiZW1haWwiOiJlc3RlNzc1QGF1Y2tsYW5kdW5pLmFjLm56IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJyemUtMzFtYzFKbVpoSTcyZGhROFF3IiwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImlhdCI6MTUwNTE4ODc3MywiZXhwIjoxNTA1MTkyMzczLCJuYW1lIjoiRWxpemFiZXRoIFN0ZXZlbnNvbiIsInBpY3R1cmUiOiJodHRwczovL2xoNC5nb29nbGV1c2VyY29udGVudC5jb20vLUxsU05IM0VSWG9RL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FQSnlwQTNfNEtOcEEwbmFuZzVVYWQ3Z2VFNXprX19vcEEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkVsaXphYmV0aCIsImZhbWlseV9uYW1lIjoiU3RldmVuc29uIiwibG9jYWxlIjoiZW4tR0IifQVdavwFByN3Hv88q2UDLLIBFrFgPKr9cOyXOgwEwdbjkavQRw8KQY8HLZkriNw5UY0c6wbTPg05boFYJI1OEI23EAXBkA7AdRo8z7KxgQoAwhyWLy7Us6PJFybgQvvXmAmuta1KXCVqwEhmNonGzRXvbxNcrTjGq9xx3cPNYwTxLiuYEetO6RQUgZRo7z3OUbeaMTGfQXh4VGm0PWw2dg9GYOU0ZqrQmSeUrxrLAzoRCC79vme1PTXcAZJhAE7JwLPIOIExmjhmf1cYOgiHvdJIOgTXMUpdC4iJKDDVIs6vcb8gqtRthcuKPV0GEAQKWAzMNDWhQ';
        const encodedUserId = GuidHelper.convertUserId(userId);
        return this.getScores(encodedUserId);
      });
  }

  getScores(userId) {
    this.scoresService.getAllScores(userId)
      .then((response) => {
        const exerciseScores = [];
        forEach(response, (exerciseScore) => {
          exerciseScores[exerciseScore.exerciseId] = parseInt(exerciseScore.stars, 10);
        });
        forEach(this.exerciseList, (exercise) => {
          exercise.stars = exerciseScores[exercise.id];
        });
      });
    return true;
  }

  getExerciseLink(exercise) {
    return `${this.editState}({ id: ${exercise.id} })`;
  }

  showInfo(exerciseId, exerciseName, $event) {
    this.$mdDialog.show({
      template: `<exercise-stats exercise-id="${exerciseId}" exercise-name="${exerciseName}"></exercise-stats>`,
      targetEvent: $event,
      clickOutsideToClose: true,
    });
  }

  delete(exercise) {
    this.exercisesLoaded = false;
    this.exerciseService.deleteExercise(exercise.id)
      .then(() => this.loadExercises());
  }

  checkExercisesExist() {
    this.exercisesExist = some(this.exerciseList);
  }

  starsArray(numStars) {
    const starsArray = map(this.stars, (value, key) => {
      const isTrue = (key + 1) <= numStars;
      return isTrue;
    });
    console.log(starsArray);
    return starsArray;
  }
}

exercisesListController.$inject = ['ExerciseService', 'AuthService',
  'ScoresService', '$state', '$mdDialog'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: exercisesListController,
    bindings: {
      isAdmin: '<',
      exercisesLoaded: '<',
      exerciseList: '<',
    },
  });
