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
        return (
            <div className="plantItem"  onClick={this.toggleView.bind(this)}>
                <div className="plant-hero" ></div>
                <div className={this.state.active ? 'plant-info expanded': 'plant-info'}>
                    <div className="plant-title">
                        <div className="plant-name">
                            <strong>{this.props.plant.name}</strong>
                        </div>
                        <div className="water-status"></div>
                    </div>
                    <div className="text plant-description">
                        <i>{this.props.plant.description}</i>
                    </div>
                    <div className="text plant-creator">
                        <i>Added by {this.props.plant.username} on {this.props.plant.purchase}</i>
                    </div>
                </div>
            </div>
        );
    }
}