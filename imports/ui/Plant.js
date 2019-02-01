import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// import { Plants } from '../api/plants.js';
 
// Plant component - represents a single plant item
export default class Plant extends Component {
    render() {
        // Give plants a different className when they are checked off,
        // so that we can style them nicely in CSS

        const plantClassName = classnames({
            checked: this.props.plant.checked,
            private: this.props.plant.private,
        });
        return (
            <li className={plantClassName}>
                {/* <button className="delete" onClick={this.deleteThisPlant.bind(this)}>
                &times;
                </button> */}
        
                <span className="text">
                    <strong>{this.props.plant.username}</strong>: {this.props.plant.name}
                </span>
                <span className="text">
                <i>{this.props.plant.description}</i>
                </span>
            </li>
        );
    }
}