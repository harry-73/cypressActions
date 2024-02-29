import assert from 'assert';
import Pets from '../../imports/api/collections/Pets';
import Notifications from '../../imports/api/collections/Notifications';
import '../../imports/api/methods/PetsShared';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

if (Meteor.isServer) {
  describe('PetsShared', function () {
    describe('methods', function () {
      let userId = '';
      let Id = '';

      beforeEach(async function () {
        await Notifications.removeAsync({});
        await Pets.removeAsync({});
        userId = await Meteor.users.insertAsync({
          createdAt: new Date('2021-01-03T21:58:07.579Z'),
          services: {
            password: {
              bcrypt:
                '$2b$10$wXUbSOaMm0uuPYDOaWpiOe.nLQU0wQO6hyNtc.bmJpC4CjI710P66'
            }
          },
          emails: [{ address: 'ste.monnnnnn@gmail.com', verified: false }],
          profile: { firstname: 'AAA', lastname: 'AAA' }
        });
        Id = await Pets.insertAsync({
          Owner: userId,
          Name: 'Phantom',
          Type: 'Chien',
          isShare: true,
          Birthday: '12/12/2020',
          Weight: 20,
          Height: 20
        });
      });

      it('InsertNotifSharedAnimal : peut insérer une notifications', async function () {
        // Find the internal implementation of the task method so we can

        // test it in isolation

        //	const deleteActivity = Meteor.server.method_handlers["activity.delete"];

        // Set up a fake method invocation that looks like what the method expects

        // Run the method with `this` set to the fake invocation
        //	let ActId = new Mongo.ObjectID(activityId);
        await Meteor.call('InsertNotifSharedAnimal', Id);

        // Verify that the method does what we expected
        const ResultPet = await Pets.findOneAsync(
          { _id: Id },
          { fields: { Update: 1 } }
        );
        assert.strictEqual(
          await Notifications.find({ Type: 'Animal:Shared' }).countAsync(),
          1
        );
        assert.strictEqual(
          await Notifications.find({
            Type: 'Animal:WaitingShared'
          }).countAsync(),
          1
        );
        assert.strictEqual(ResultPet.Update, 1);
      });
    });
  });
}
