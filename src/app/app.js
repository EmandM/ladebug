// Import styles that are needed
import 'angular-material/angular-material.css';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import 'font-awesome/css/font-awesome.css';
import 'highlight.js/styles/googlecode.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python.js';

// Always import app.module first -> it sets up the angular app
import './app.module';

// Config js files
import './app.config';
import './app.routing';

// All other files
import './common';
import './components';
import './services';
import './styles';
