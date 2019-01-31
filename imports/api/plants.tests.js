/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'chai';
 
import { Plants } from './plants.js';
 
if (Meteor.isServer) {
    describe('Plants', () => {
        describe('methods', () => {
            const userId = Random.id();
            let plantId;
    
            beforeEach(() => {
                Plants.remove({});
                plantId = Plants.insert({
                text: 'test plant',
                createdAt: new Date(),
                owner: userId,
                username: 'tmeasday',
                });
            });
        
            it('can delete owned plant', () => {
                // Find the internal implementation of the task method so we can
                // test it in isolation
                const deletePlant = Meteor.server.method_handlers['plants.remove'];
        
                // Set up a fake method invocation that looks like what the method expects
                const invocation = { userId };
        
                // Run the method with `this` set to the fake invocation
                deletePlant.apply(invocation, [plantId]);
        
                // Verify that the method does what we expected
                assert.equal(Plants.find().count(), 0);
            });
        });
    });
}