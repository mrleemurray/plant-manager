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
            hideNewPlant: true,
        };
    }

    toggleNewPlant() {
        const currentState = this.state.hideNewPlant;
        this.setState({ hideNewPlant: !currentState });
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(ReactDOM.findDOMNode(this.refs.purchaseDate).value.trim(),);
        const plantData = {
            name: ReactDOM.findDOMNode(this.refs.plantName).value.trim(),
            description: ReactDOM.findDOMNode(this.refs.plantDescription).value.trim(),
        };
        // Find the text field via the React ref
        const plantName = ReactDOM.findDOMNode(this.refs.plantName).value.trim();
        // const plantDescription = ReactDOM.findDOMNode(this.refs.plantDescription).value.trim();
        if(plantName != ""){
            Meteor.call('plants.insertMultiple', plantData);
        }
     
        // Clear form
        ReactDOM.findDOMNode(this.refs.plantName).value = '';
        ReactDOM.findDOMNode(this.refs.plantDescription).value = '';
    }
    
    // toggleHideCompleted() {
    //     this.setState({
    //         hideCompleted: !this.state.hideCompleted,
    //     });
    // }

    renderPlants() {
        let filteredPlants = this.props.plants;
        // if (this.state.hideCompleted) {
        //     filteredPlants = filteredPlants.filter(plant => !plant.checked);
        // }
        return filteredPlants.map((plant) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            const showPrivateButton = plant.owner === currentUserId;
       
            return (
              <Plant
                key={plant._id}
                plant={plant}
                // showPrivateButton={showPrivateButton}
              />
            );
          });
    }
 
    render() {
        return (
            <div className="container">
            <header>
            <div className="app-title">
            <h1><i>Plants, Plants, Plants</i></h1>
            <AccountsUIWrapper />
            </div>
            
            { this.props.currentUser ?
                <div className={this.state.hideNewPlant ? 'new-plant-container hide': 'new-plant-container'} >
                <h2 onClick={this.toggleNewPlant.bind(this)}><b>+</b> Create new plant</h2>
                <form className="new-plant">
                    <input
                        type="text"
                        ref="plantName"
                        placeholder="Plant Name (required)"
                    />
                    <input
                        type="text"
                        ref="plantDescription"
                        placeholder="Description"
                    />
                    Date of purchase:
                    <input type="date" id="purchase" ref="purchaseDate" placeholder="Purchase Date"></input>
                    <button className="form-Submit" onClick={this.handleSubmit.bind(this)}>ADD PLANT</button>
                </form></div> : ''
            }
        </header>
        
        <div className="plant-list">
            {this.renderPlants()}
        </div>
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