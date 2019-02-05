import React, { Component } from 'react';
import classnames from 'classnames';
 
// Plant component - represents a single plant item
export default class Plant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
    }

    toggleView() {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    }

    render() {
        // Give plants a different className when they are checked off,
        // so that we can style them nicely in CSS
        const plantClassName = classnames({
            plantItem: true,
            expanded: this.props.plant.expanded,
          });

        return (
            <div className={this.state.active ? 'plantItem expanded': 'plantItem'}  onClick={this.toggleView.bind(this)}>
                <img className="plant-hero" ></img>
                <div className="plant-info">
                    <span className="text">
                        <strong>{this.props.plant.username}</strong>: {this.props.plant.name}
                    </span>
                    <span className="text">
                        <i>{this.props.plant.description}</i>
                    </span>
                </div>
            </div>
        );
    }
}