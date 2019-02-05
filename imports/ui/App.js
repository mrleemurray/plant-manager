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
        if(currentState){
            this.setTodaysDate();
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log(ReactDOM.findDOMNode(this.refs.purchaseDate).value.trim(),);
        const plantData = {
            name: ReactDOM.findDOMNode(this.refs.plantName).value.trim(),
            description: ReactDOM.findDOMNode(this.refs.plantDescription).value.trim(),
            purchase: ReactDOM.findDOMNode(this.refs.purchaseDate).value.trim(),
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

    renderPlants() {
        let filteredPlants = this.props.plants;
        // if (this.state.hideCompleted) {
        //     filteredPlants = filteredPlants.filter(plant => !plant.checked);
        // }
        return filteredPlants.map((plant) => {
            const currentUserId = this.props.currentUser && this.props.currentUser._id;
            // const showPrivateButton = plant.owner === currentUserId;
       
            return (
              <Plant
                key={plant._id}
                plant={plant}
                // showPrivateButton={showPrivateButton}
              />
            );
          });
    }

    setTodaysDate(){
        // const today = new Date();
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
        {
            dd='0'+dd;
        } 

        if(mm<10) 
        {
            mm='0'+mm;
        } 
        ReactDOM.findDOMNode(this.refs.purchaseDate).value = yyyy+'-'+mm+'-'+dd;
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
                <h2 onClick={this.toggleNewPlant.bind(this)}><b>+</b> Add a plant</h2>
                <form className="new-plant">
                    <input
                        className="text-input"
                        type="text"
                        ref="plantName"
                        placeholder="Plant Name (required)"
                    />
                    <input
                        className="text-input"
                        type="text"
                        ref="plantDescription"
                        placeholder="Description"
                    />
                    <div className="datePicker">
                        <span>Date of purchase:</span>
                        <input type="date" ref="purchaseDate"></input>
                    </div>
                    <div class="slidecontainer">
                        How thirsty?
                        <input type="range" min="1" max="5" value="3" class="slider" ref="waterRange"></input>
                        How sunny?
                        <input type="range" min="1" max="5" value="3" class="slider" ref="sunlightRange"></input>
                    </div>
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