import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.js';
import '../imports/startup/accounts-config.js';
import dotenv from 'dotenv';

dotenv.config();
 
Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});