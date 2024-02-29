import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import {
  pushAnimalWeight,
  setWeightTrackingRight
} from '../../imports/api/methods/tracking';
import { animalcreate } from '../../imports/api/methods/Animal';
import Pets from '../../imports/api/collections/Pets';
import log from 'loglevel';

if (Meteor.isServer) {
  describe('pushAnimalWeight', function () {
    let userId, context, idAnimal, userOtherId;
    beforeEach(async function () {
      userId = Random.id();
      userOtherId = Random.id();

      context = { userId };
      await Meteor.users.insertAsync({ _id: userId }, (error, resul) => {
        if (error) log.info('ERROR ', error);
      });

      await Meteor.users.insertAsync(
        {
          _id: userOtherId
        },
        (error, resul) => {
          if (error) log.info('ERROR ', error);
        }
      );

      idAnimal = await animalcreate._execute(context, {
        Name: 'Essai',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/21/3022',
        Weight: 20,
        Height: 30
      });

      await Pets.updateAsync(
        { _id: idAnimal },
        { $set: { Shared: [{ _id: userOtherId, weightTrackingRight: '' }] } }
      );

      //	InsertNotifSharedAnimal;
    });

    /*
     *
     * Method : tracking.pushAnimalWeight : Vous devez être loggué.
     *
     */
    it('tracking.pushAnimalWeight : Vous devez être loggué.', function () {
      //expect(function () {
      pushAnimalWeight.call(
        {
          id: idAnimal,
          date: '12/12/2020T00:00:00Z',
          weight: 4
        },
        (err) => {
          expect(err.error).to.equal(
            'Tracking.methods.pushAnimalWeight.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [Tracking.methods.pushAnimalWeight.notloggued]'
      ); */
    });

    /*
     *
     * Method : tracking.pushAnimalWeight : Vous devez être loggué.
     *
     */
    it("tracking.pushAnimalWeight :  Vous n'êtes pas le propriétiare.", function () {
      //expect(function () {
      pushAnimalWeight._execute(
        { userId: userOtherId },
        {
          id: idAnimal,
          date: '12/12/2020T00:00:00Z',
          weight: 4
        },
        (err) => {
          expect(err.error).to.equal(
            'Tracking.methods.pushAnimalWeight.unauthorized'
          );
        }
      );
      /* }).to.throw(
        "Vous n'êtes pas authorisés [Tracking.methods.pushAnimalWeight.unauthorized]"
      ); */
    });

    /*
     *
     * Method : tracking.pushAnimalWeight : Envoi versions
     *
     */
    it('tracking.pushAnimalWeight : Envoi versions', async function () {
      //	let userId = Random.id();

      await pushAnimalWeight._execute(context, {
        id: idAnimal,
        date: '2020-12-12T00:00:00Z',
        weight: 4
      });

      const result = await Pets.findOneAsync({ _id: idAnimal });

      expect(
        result.weightTracking[result.weightTracking.length - 1].weight
      ).to.equal(4);
      expect(
        result.weightTracking[
          result.weightTracking.length - 1
        ].date.getUTCDate()
      ).to.equal(12);
    });
  });

  describe('setWeightTrackingRight', function () {
    let userId, context, idAnimal, userOtherId;
    beforeEach(async function () {
      userId = Random.id();
      userOtherId = Random.id();

      context = { userId };
      await Meteor.users.insertAsync({ _id: userId }, (error, resul) => {
        if (error) log.info('ERROR ', error);
      });

      await Meteor.users.insertAsync(
        {
          _id: userOtherId
        },
        (error, resul) => {
          if (error) log.info('ERROR ', error);
        }
      );

      idAnimal = await animalcreate._execute(context, {
        Name: 'Essai',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/21/3022',
        Weight: 20,
        Height: 30
      });

      await Pets.updateAsync(
        { _id: idAnimal },
        { $set: { Shared: [{ _id: userOtherId, weightTrackingRight: '' }] } }
      );

      //	InsertNotifSharedAnimal;
    });

    /*
     *
     * Method : tracking.setweighttrackingright : Vous devez être loggué.
     *
     */
    it('tracking.setweighttrackingright : Vous devez être loggué.', function () {
      // expect(function () {
      setWeightTrackingRight.call(
        {
          userId,
          idAnimal,
          right: ''
        },
        (err) => {
          expect(err.error).to.equal(
            'Tracking.methods.setweighttrackingright.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [Tracking.methods.setweighttrackingright.notloggued]'
      ); */
    });

    /*
     *
     * Method : tracking.setweighttrackingright : Vous n'êtes pas le propriétaire.
     *
     */
    it("tracking.setweighttrackingright :  Vous n'êtes pas le propriétaire.", function () {
      // expect(function () {
      setWeightTrackingRight._execute(
        { userId: userOtherId },
        {
          userId,
          idAnimal,
          right: 'rw'
        },
        (err) => {
          expect(err.error).to.equal(
            'Tracking.methods.setweighttrackingright.unauthorized'
          );
        }
      );
      /*   }).to.throw(
        "Vous n'êtes pas le propriétaire [Tracking.methods.setweighttrackingright.unauthorized]"
      ); */
    });

    /*
     *
     * Method : tracking.setweighttrackingright : Set Right
     *
     */
    it('tracking.setweighttrackingright : Set Right', async function () {
      //	let userId = Random.id();

      await setWeightTrackingRight._execute(context, {
        userId: userOtherId,
        idAnimal,
        right: 'rw'
      });

      const result = await Pets.findOneAsync({ _id: idAnimal });

      expect(result.Shared[0].weightTrackingRight).to.equal('rw');
    });
  });
}
