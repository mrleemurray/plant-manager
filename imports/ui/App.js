import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Plants } from '../api/plants.js';
import Plant from './Plant.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
 
// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
     
        this.state = {
            hideCompleted: false,
        };
    }
    handleSubmit(event) {
        console.log('?');
        event.preventDefault();
     
        const plantData = {
            name: ReactDOM.findDOMNode(this.refs.plantName).value.trim(),
            description: ReactDOM.findDOMNode(this.refs.plantDescription).value.trim(),
        };
        // console.log(plantData);
        // Find the text field via the React ref
        const plantName = ReactDOM.findDOMNode(this.refs.plantName).value.trim();
        // const plantDescription = ReactDOM.findDOMNode(this.refs.plantDescription).value.trim();
        if(plantName != ""){
            // Meteor.call('plants.insert', plantName);
            Meteor.call('plants.insertMultiple', plantData);
        }
        // Meteor.call('plants.insert', plantDescription);
     
        // Clear form
        ReactDOM.findDOMNode(this.refs.plantName).value = '';
        ReactDOM.findDOMNode(this.refs.plantDescription).value = '';
    }
    
    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderPlants() {
        let filteredPlants = this.props.plants;
        if (this.state.hideCompleted) {
            filteredPlants = filteredPlants.filter(plant => !plant.checked);
        }
        return filteredPlants.map((plant) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = plant.owner === currentUserId;
       
            return (
              <Plant
                key={plant._id}
                plant={plant}
                showPrivateButton={showPrivateButton}
              />
            );
          });
    }
 
    render() {
        return (
            <div className="container">
            <header>
            <h1>Plant Manager</h1>

            <AccountsUIWrapper />
            { this.props.currentUser ?
                <div className="new-plant-container">
                <h2>Create new plant</h2>
                <form className="new-plant">
                    <input
                        type="text"
                        ref="plantName"
                        placeholder="Plant Name"
                    />
                    <input
                        type="text"
                        ref="plantDescription"
                        placeholder="Description"
                    />
                    <button className="form-Submit" onClick={this.handleSubmit.bind(this)}>ADD PLANT</button>
                </form></div> : ''
            }
        </header>
 
        <ul>
            {this.renderPlants()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
    Meteor.subscribe('plants');

    return {
        plants: Plants.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Plants.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
    };
})(App);