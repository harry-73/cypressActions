import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import Traces from '../../imports/api/collections/traces';
import ActivitiesGPX from '../../imports/api/collections/ActivitiesGPX';
import { tracecreate, tracedelete } from '../../imports/api/methods/traces';
import { expect, assert } from 'chai';
import { trace } from 'console';

if (Meteor.isServer) {
  let mongoGpxId;
  let userId = Random.id();
  let context = { userId };
  let ActId;
  describe('Traces', function () {
    describe('methods', function () {
      beforeEach(async function () {
        (async () => {
          await ActivitiesGPX.removeAsync({});
        })();
        (async () => {
          await Traces.removeAsync({});
        })();

        mongoGpxId = await ActivitiesGPX.insertAsync({
          name: 'Testing',
          time: '01:02:02',
          distance: 34.5,
          type: 'Course à Pied'
        });
      });

      it('trace.create : Vous devez être loggué.', function () {
        tracecreate.call({ Id: mongoGpxId }, (err) => {
          assert.strictEqual(
            err.error,
            'Traces.methods.tracecreate.notloggued'
          );
        });
      });

      it('trace.create : peut créer un parcours', async function () {
        mongoGpxId = await ActivitiesGPX.insertAsync({
          name: 'Testing',
          Owner: userId,
          time: '01:02:02',
          distance: 34.5,
          type: 'Course à Pied'
        });
        await tracecreate._execute(context, { Id: mongoGpxId });

        assert.strictEqual(
          await Traces.find({ idGpx: mongoGpxId }).countAsync(),
          1
        );
      });

      it('trace.create : parcours déjà sauvegardé', async function () {
        mongoGpxId = await ActivitiesGPX.insertAsync({
          name: 'Testing',
          Owner: userId,
          description: 'Desc',
          images: [],
          time: '01:02:02',
          distance: 34.5,
          type: 'Course à Pied'
        });
        await tracecreate._execute(context, { Id: mongoGpxId });

        tracecreate._execute(context, { Id: mongoGpxId }, (err) => {
          assert.strictEqual(
            err.error,
            'Traces.methods.tracecreate.alreadySaved'
          );
        });

        /*  expect(async function () {
          await tracecreate._execute(context, { Id: mongoGpxId });
        }).to.throw(
          'Le parcours a déjà été sauvegardé. [Traces.methods.tracecreate.alreadySaved]'
        ); */
      });
    });

    it('trace.delete : Vous devez être loggué.', async function () {
      mongoGpxId = await ActivitiesGPX.insertAsync({
        name: 'Testing',
        description: 'Desc',
        images: [],
        time: '01:02:02',
        distance: 34.5,
        type: 'Course à Pied'
      });
      let idTrace = await tracecreate._execute(context, {
        Id: mongoGpxId
      });

      tracedelete.call({ idTrace: idTrace }, (err) => {
        assert.strictEqual(err.error, 'Traces.methods.tracedelete.notloggued');
      });
      /*   console.log(
        'TEST',
        assert.throw(
          fn,
          'Vous devez être loggué. [Traces.methods.tracedelete.notloggued]'
        )
      );
      assert.throw(
        fn,
        'Vous devez être loggué. [Traces.methods.tracedelete.notloggued]'
      ); */
      /*   expect(async function () {
        await tracedelete.callAsync({ idTrace: idTrace });
      }).to.throw(
        'Vous devez être loggué. [Traces.methods.tracedelete.notloggued]'
      ); */
    });
    it('trace.delete : Vous n êtes pas le propriétiare.', async function () {
      mongoGpxId = await ActivitiesGPX.insertAsync({
        name: 'Testing',
        description: 'Desc',
        images: [],
        time: '01:02:02',
        distance: 34.5,
        type: 'Course à Pied'
      });
      let idTrace = await tracecreate._execute(context, { Id: mongoGpxId });

      //  expect(function () {
      tracedelete._execute(
        { userId: Random.id },
        { idTrace: idTrace },
        (err) => {
          assert.strictEqual(
            err.error,
            'Traces.methods.tracedelete.unauthorized'
          );
        }
      );
    });
    /*    }).to.throw(
        "Vous n'êtes pas le propriétiare [Traces.methods.tracedelete.unauthorized]"
      ); */

    it('trace.delete : Effacement', async function () {
      mongoGpxId = await ActivitiesGPX.insertAsync({
        name: 'Testing',
        description: 'Desc',
        images: [],
        time: '01:02:02',
        distance: 34.5,
        type: 'Course à Pied'
      });
      let idTrace = tracecreate._execute(context, { Id: mongoGpxId });

      tracedelete._execute(context, {
        idTrace
      });

      expect(await Traces.find({ idTrace }).countAsync()).to.equal(0);
    });
  });
}
