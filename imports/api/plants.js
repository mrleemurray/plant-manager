import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Plants = new Mongo.Collection('plants');

if (Meteor.isServer) {
    // This code only runs on the server
    // Only publish plants that are public or belong to the current user
    Meteor.publish('plants', function plantsPublication() {
        return Plants.find({
            $or: [
              { private: { $ne: true } },
              { owner: this.userId },
            ],
          });
    });
  }

Meteor.methods({
    'plants.insert'(text) {
      check(text, String);
   
      // Make sure the user is logged in before inserting a plant
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
   
      Plants.insert({
        text,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
      });
    },
    'plants.insertMultiple'(object) {
      check(object, Object);
   
      // Make sure the user is logged in before inserting a plant
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
   
      Plants.insert({
        name: object.name,
        description: object.description,
        purchase: object.purchase,
        createdAt: new Date(),
        owner: this.userId,
        username: Meteor.users.findOne(this.userId).username,
        expanded: false,
      });
    },
    'plants.remove'(plantId) {
        check(plantId, String);

        const plant = Plants.findOne(plantId);
            if (plant.private && plant.owner !== this.userId) {
            // If the plant is private, make sure only the owner can delete it
            throw new Meteor.Error('not-authorized');
            }
    
        Plants.remove(plantId);
    },
    'plants.setChecked'(plantId, setChecked) {
        check(plantId, String);
        check(setChecked, Boolean);

        const plant = Plants.findOne(plantId);
        if (plant.private && plant.owner !== this.userId) {
            // If the plant is private, make sure only the owner can check it off
            throw new Meteor.Error('not-authorized');
        }
   
        Plants.update(plantId, { $set: { checked: setChecked } });
    },
    'plants.setPrivate'(plantId, setToPrivate) {
        check(plantId, String);
        check(setToPrivate, Boolean);
     
        const plant = Plants.findOne(plantId);
     
        // Make sure only the plant owner can make a plant private
        if (plant.owner !== this.userId) {
          throw new Meteor.Error('not-authorized');
        }
     
        Plants.update(plantId, { $set: { private: setToPrivate } });
      },
      // 'plants.toggleView'(plantId) {
      //   check(plantId, String);
      //   const plant = Plants.findOne(plantId);
      //   Plants.update(plantId, {
      //     $set: { expanded: !plant.expanded},
      //   });
      // },
  });