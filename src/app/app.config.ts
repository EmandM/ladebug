import { IProvider } from "restangular";
import { material } from "angular";

function theming($mdThemingProvider: material.IThemingProvider, restangularProvider: IProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('light-blue')
    .accentPalette('red');

  // restangularProvider.setBaseUrl('http://127.0.0.1:5000');
  restangularProvider.setBaseUrl('https://ladebug-server.herokuapp.com/');
}

theming.$inject = ['$mdThemingProvider', 'RestangularProvider'];

export default theming;
