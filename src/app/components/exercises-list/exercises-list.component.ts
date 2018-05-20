import { StateService } from '@uirouter/angularjs';
import * as angular from 'angular';
import { forEach, some } from 'lodash';
import { AuthService, ExerciseService, ScoresService } from '../../services';
import { IExercise } from './../../../types/ladebug.types';

import './exercises-list.scss';
import template from './exercises-list.template.html';

class ExercisesListController {
  private signedIn: boolean;
  private authServiceKey: string;
  private exerciseList: IExercise[];
  private editState: string;
  private isAdmin: boolean;
  private scoresLoaded: boolean;
  private exercisesLoaded: boolean;
  private exercisesExist: boolean;

  constructor(private exerciseService: ExerciseService, private authService: AuthService,
    private scoresService: ScoresService, private $state: StateService,
    private $mdDialog: angular.material.IDialogService, private $scope: angular.IScope) {

    this.checkSignedIn();

    this.authServiceKey = 'exercise-list';
    this.authService.addOnSignIn(this.authServiceKey, this.onSignIn.bind(this));
  }

  public $onInit() {
    if (!this.exerciseList) {
      this.loadExercises();
    }
    this.editState = (this.isAdmin) ? 'editexercise' : 'debugexisting';
  }

  public $onChanges(changesObj: angular.IOnChangesObject) {
    if (changesObj.exerciseList) {
      this.checkExercisesExist();
    }
  }

  public $onDestroy() {
    this.authService.removeOnSignIn(this.authServiceKey);
  }

  public async checkSignedIn() {
    try {
      this.signedIn = await this.authService.checkSignedIn();
    } catch (err) {
      this.signedIn = false;
    }
  }

  public onSignIn(isSignIn) {
    this.signedIn = isSignIn;
    if (!isSignIn || this.isAdmin) {
      this.scoresLoaded = true;
      this.$scope.$apply();
      return;
    }
    this.getUserScores();
  }

  public loadExercises() {
    this.exerciseService.getAllExercises()
      .then((response) => {
        this.exercisesLoaded = true;
        this.exerciseList = response;
        // response always 'true' and an object even if empty (is not null)
        // therefore check to see if it contains exercises
        this.checkExercisesExist();
        if (this.exercisesExist && !this.isAdmin) {
          this.getUserScores();
        }
      })
      .catch(() => {
        this.exercisesLoaded = true;
      });
  }

  public async getUserScores() {
    this.scoresLoaded = false;
    const userId = await this.authService.getCurrentUserId();
    const allScores = await this.scoresService.getAllScores(userId);
    const exerciseScores = {};
    forEach(allScores, (exerciseScore) => {
      exerciseScores[exerciseScore.exerciseId] = parseInt(exerciseScore.stars, 10);
    });
    forEach(this.exerciseList, (exercise) => {
      exercise.score = exerciseScores[exercise.id] || 0;
    });
    this.scoresLoaded = true;
  }

  public getExerciseLink(exercise): string {
    return `${this.editState}({ id: ${exercise.id} })`;
  }

  public showInfo(exerciseId: string, exerciseName: string, $event: MouseEvent) {
    this.$mdDialog.show({
      template: `<exercise-stats exercise-id="${exerciseId}" exercise-name="${exerciseName}"></exercise-stats>`,
      targetEvent: $event,
      clickOutsideToClose: true,
    });
  }

  public async delete(exercise: IExercise, $event: MouseEvent) {
    await this.$mdDialog.show(
      this.$mdDialog.confirm()
        .title('Are you sure you want to delete this exercise?')
        .textContent('This cannot be undone.')
        .ariaLabel('Delete the exercise?')
        .targetEvent($event)
        .ok('Yes')
        .cancel('Cancel'),
    );
    this.exercisesLoaded = false;
    await this.exerciseService.deleteExercise(exercise.id);
    this.loadExercises();
  }

  public checkExercisesExist() {
    this.exercisesExist = some(this.exerciseList);
  }
}

ExercisesListController.$inject = ['ExerciseService', 'AuthService',
  'ScoresService', '$state', '$mdDialog', '$scope'];

angular.module('debugapp')
  .component('exercisesList', {
    template,
    controller: ExercisesListController,
    bindings: {
      isAdmin: '<',
      exercisesLoaded: '<',
      exerciseList: '<',
    },
  });
