import assert from 'assert';
import Pets from '../../imports/api/collections/Pets';
import Activities from '../../imports/api/collections/Activities';
import ActivitiesGPX from '../../imports/api/collections/ActivitiesGPX';
import PetsActivities from '../../imports/api/collections/PetsActivities';
import activityType from '../../imports/api/collections/activityType';
import {
  activityshare,
  activitymodify,
  activitycreate,
  activitydelete,
  activityaddimage,
  activitydeleteimage,
  activitycreatefromgps,
  activitygpxunshared,
  activitygpxlike,
  activitygpxdislike,
  activityanimaldeleteimage,
  activityanimaladdimage,
  activityshareaddimage,
  getPolylineCorrectGpsActivityGpxById,
  getActivityGpxById
} from '../../imports/api/methods/Activity';

import {
  animalactivitycreate,
  animalactivitycreatefromgps
} from '../../imports/api/methods/Animal';
import { expect } from 'chai';
import { Random } from 'meteor/random';

import '../../imports/api/methods/Activity';

import '../../imports/api/methods/Animal';
import '../../imports/api/methods/PetsShared';
import { Meteor } from 'meteor/meteor';
import log from 'loglevel';
import moment from 'moment';

//const MongoClient = require("mongodb").MongoClient;

if (Meteor.isServer) {
  describe('Activity', function () {
    describe('methods', function () {
      const userId = Random.id();
      let activityId;
      let Pet1Id;
      let Pet2Id;

      beforeEach(async function () {
        await Activities.removeAsync({});
        await ActivitiesGPX.removeAsync({});
        await PetsActivities.removeAsync({});
        await Pets.removeAsync({});

        activityId = await Activities.insertAsync({
          Owner: userId,
          Name: 'ZZZZ',
          description: 'description',
          Type: 'type',
          DateAct: 'DateAct',
          TimeFCtotal: 600,
          Distance: 5.6,
          Notes: [],
          checked: [],
          center: [],
          isShared: false,
          Id_GPX: null,
          Validated: true,
          images: []
        });

        Pet1Id = await Pets.insertAsync({
          Owner: userId,
          Name: 'Phantom',
          Type: 'Chien',
          isShare: true,
          Birthday: '12/11/2020',
          Weight: 10,
          Height: 12
        });
        Pet2Id = await Pets.insertAsync({
          Owner: userId,
          Name: 'Medoc',
          Type: 'Cheval',
          isShare: true,
          Birthday: '12/11/2010',
          Weight: 150,
          Height: 170
        });
      });

      /*
       *
       * Method : activity.delete : Vous devez être loggué.
       *
       */
      it('activity.delete : Vous devez être loggué.', function () {
        // expect(function () {
        activitydelete.call({ activityId, Type: 'Humaine' }, (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.activitydelete.notloggued'
          );
        });
        /*  }).to.throw(
          'Vous devez être loggué. [Activities.methods.activitydelete.notloggued]'
        ); */
      });

      /*
       *
       * Method : activity.delete : Humaine Vous n'êtes pas le propriétiare
       *
       */
      it("activity.delete : Humaine Vous n'êtes pas le propriétiare", async function () {
        const userId = Random.id();
        const context = { userId };
        const activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const activId = await activitycreate._execute(context, activity);
        const otherContext = { userId: Random.id() };
        //  expect(function () {
        activitydelete._execute(
          otherContext,
          {
            activityId: activId,
            Type: 'Humaine'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activitydelete.unauthorized'
            );
          }
        );
        /* }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activitydelete.unauthorized]"
        ); */
      });

      /*
       *
       * Method : activity.delete : Humaine
       *
       */
      it('activity.delete: peut effacer activité humaine', async function () {
        const userId = Random.id();
        const context = { userId };
        const activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const activId = await activitycreate._execute(context, activity);

        await activitydelete._execute(context, {
          activityId: activId,
          Type: 'Humaine'
        });
        assert.strictEqual(
          await Activities.find({ _id: activId }).countAsync(),
          0
        );
      });

      /*
       *
       * Method : activity.delete : Animal
       *
       */
      it('activity.delete: peut effacer activité animal', async function () {
        const userId = Random.id();
        const context = { userId };
        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        await activitydelete._execute(context, {
          activityId: id,
          Type: 'Animal'
        });
        assert.strictEqual(
          await PetsActivities.find({ _id: id }).countAsync(),
          0
        );
      });

      /*
       *
       * Method : activity.delete : Animal Vous n'êtes pas le propriétiare
       *
       */
      it("activity.delete: Animal Vous n'êtes pas le propriétiare", async function () {
        const userId = Random.id();
        const context = { userId };
        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        const otherContext = { userId: Random.id() };

        // expect(function () {
        activitydelete._execute(
          otherContext,
          {
            activityId: id,
            Type: 'Animal'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activitydelete.unauthorized'
            );
          }
        );
        /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activitydelete.unauthorized]"
        ); */
      });

      /*
       *
       * Method : activity.create : peut créer une activité humaine
       *
       */
      it('activity.create : peut créer une activité humaine', async function () {
        const Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const ActId = await activitycreate._execute(context, Activity);

        assert.strictEqual(
          await Activities.find({ _id: ActId }).countAsync(),
          1
        );

        const result = await Activities.findOneAsync({ _id: ActId });

        assert.strictEqual(
          moment(result.DateAct).utc().format(),
          '2020-12-12T19:01:02Z'
        );
        assert.strictEqual(await PetsActivities.find().countAsync(), 2);
        expect(result.Distance).to.equal(5.6);
        expect(result.Validated).to.equal(true);
        expect(result.isShared).to.equal(false);
        expect(result.Type).to.equal('type');
        expect(result.Name).to.equal('Test');
        expect(result.description).to.equal('description');

        // A faire : Ajout Animals
      });

      /*
       *
       * Method : activity.create : Vous devez être loggué.
       *
       * */
      it(
        'activity.create : Vous devez être loggué.',
        async function () {
          const Activity = {
            name: 'Test',
            type: 'type',
            time: '11:22:33',
            description: 'description',
            //	heure: "20:01:02",
            //	date: "12/12/2020",
            dateActivity: '2020-12-12T20:01:02+01:00',
            distance: 5.6,
            Notes: [],
            checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
          };

          const userId = Random.id();
          const context = { userId };

          //   expect(function () {
          activitycreate.call(Activity);
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.activitycreate.notloggued'
          );

          /*  }).to.throw(
          'Vous devez être loggué. [Activities.methods.activitycreate.notloggued]'
        ); */
        }
      );
      /*
       *
       * Method : activity.modify
       *
       */
      it('activity.modify : peut modifier une activité humaine', async function () {
        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const ActId = await activitycreate._execute(context, Activity);

        Activity = {
          id: ActId,
          center: [0, 0],
          Id_GPX: null,
          name: 'Test1',
          type: 'Course',
          time: '11:23:34',
          description: 'description1',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T22:01:02+02:00',
          distance: 5.8,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', undefined, Pet2Id + ',Medor,2']
        };

        await activitymodify._execute(context, Activity);
        assert.strictEqual(
          await Activities.find({ _id: ActId }).countAsync(),
          1
        );

        assert.strictEqual(
          moment((await Activities.findOneAsync({ _id: ActId })).DateAct)
            .utc()
            .format(),
          '2020-12-12T20:01:02Z'
        );
        assert.strictEqual(await PetsActivities.find().countAsync(), 2);

        const result = await Activities.findOneAsync({ _id: ActId });

        expect(result.Distance).to.equal(5.8);
        expect(result.Validated).to.equal(true);
        expect(result.isShared).to.equal(false);
        expect(result.Type).to.equal('Course');
        expect(result.Name).to.equal('Test1');
        expect(result.description).to.equal('description1');

        // A faire : Ajout Animals
      });

      /*
       *
       * Method : activity.modify : Vous devez être loggué.
       *
       */
      it('activity.modify : Vous devez être loggué.', async function () {
        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const ActId = await activitycreate._execute(context, Activity);

        Activity = {
          id: ActId,
          center: [0, 0],
          Id_GPX: null,
          name: 'Test1',
          type: 'Coruse',
          time: '11:23:34',
          description: 'description1',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T22:01:02+02:00',
          distance: 5.8,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', undefined, Pet2Id + ',Medor,2']
        };

        // expect(function () {
        activitymodify.call(Activity, (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.activitymodify.notloggued'
          );

          /*  }).to.throw(
          'Vous devez être loggué. [Activities.methods.activitymodify.notloggued]'
        ); */
        });

        /*
         *
         * Method : activity.modify : Vous n'êtes pas le propriétiare
         *
         */
        it("activity.modify : Vous n'êtes pas le propriétiare", async function () {
          let Activity = {
            name: 'Test',
            type: 'type',
            time: '11:22:33',
            description: 'description',
            //	heure: "20:01:02",
            //	date: "12/12/2020",
            dateActivity: '2020-12-12T20:01:02+01:00',
            distance: 5.6,
            Notes: [],
            checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
          };

          const userId = Random.id();
          const context = { userId };

          const ActId = await activitycreate._execute(context, Activity);

          Activity = {
            id: ActId,
            center: [0, 0],
            Id_GPX: null,
            name: 'Test1',
            type: 'Coruse',
            time: '11:23:34',
            description: 'description1',
            //	heure: "20:01:02",
            //	date: "12/12/2020",
            dateActivity: '2020-12-12T22:01:02+02:00',
            distance: 5.8,
            Notes: [],
            checked: [Pet1Id + ',Phantom,0', undefined, Pet2Id + ',Medor,2']
          };

          const otherContext = { userId: Random.id() };

          // expect(function () {
          activitymodify._execute(otherContext, Activity, (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activitymodify.unauthorized'
            );
          });

          /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activitymodify.unauthorized]"
        ); */

          /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activitymodify.unauthorized]"
        ); */
        });
      });

      /*
       *
       * Method : activity.createfromgps
       *
       */
      it('activitycreatefromgps : peut créer une activité humaine avec un enrigstrement GPS', async function () {
        const Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
          geojson: [
            {
              type: 'Feature',
              properties: {
                time: '',
                coordinateProperties: {
                  times: [],
                  heart: []
                }
              },
              geometry: {
                type: 'LineString',
                coordinates: [[49, 23]]
              }
            }
          ]
        };

        const userId = Random.id();
        const context = { userId };

        const ActId = await activitycreatefromgps._execute(context, Activity);

        assert.strictEqual(
          await Activities.find({ _id: ActId }).countAsync(),
          1
        );

        assert.strictEqual(
          moment((await Activities.findOneAsync({ _id: ActId })).DateAct)
            .utc()
            .format(),
          '2020-12-12T19:01:02Z'
        );
        assert.strictEqual(await PetsActivities.find().countAsync(), 2);

        let result = await Activities.findOneAsync({ _id: ActId });
        assert.strictEqual(
          await ActivitiesGPX.find({ _id: result.Id_GPX }).countAsync(),
          1
        );

        expect(result.Distance).to.equal(5.6);
        expect(result.Owner).to.equal(userId);
        expect(result.Validated).to.equal(true);
        expect(result.isShared).to.equal(false);
        expect(result.Type).to.equal('type');
        expect(result.Name).to.equal('Test');
        expect(result.description).to.equal('description');

        // Faire animaux
      });

      /*
       *
       * Method : activity.createfromgps : Vous devez être loggué.
       *
       */
      it('activitycreatefromgps : Vous devez être loggué.', function () {
        const Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
          geojson: [
            {
              type: 'Feature',
              properties: {
                time: '',
                coordinateProperties: {
                  times: [],
                  heart: []
                }
              },
              geometry: {
                type: 'LineString',
                coordinates: [[49, 23]]
              }
            }
          ]
        };

        //  expect(function () {
        activitycreatefromgps.call(Activity, (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.activitycreatefromgps.notloggued'
          );
        });
        /*  }).to.throw(
          'Vous devez être loggué. [Activities.methods.activitycreatefromgps.notloggued]'
        ); */
      });

      /*
       *
       * Method : get.activitygpxbyid
       *
       */
      it('getactivitygpxbyid : peut récupérer une activité humaine avec un enrigstrement GPS by Id', async function () {
        const Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
          geojson: [
            {
              type: 'Feature',
              properties: {
                time: '',
                coordinateProperties: {
                  times: [],
                  heart: []
                }
              },
              geometry: {
                type: 'LineString',
                coordinates: [[49, 23]]
              }
            }
          ]
        };

        const userId = Random.id();
        const context = { userId };

        const ActId = await activitycreatefromgps._execute(context, Activity);

        const resultA = await Activities.findOneAsync({ _id: ActId });

        const result = await getActivityGpxById._execute(context, {
          id: resultA.Id_GPX
        });

        console.log('result : ', result);
        // Add more tests
        expect(result.center[0]).to.equal(23);
        expect(result.center[1]).to.equal(49);
        expect(result.SelectLike[0]).to.equal(userId);
        expect(result.Owner).to.equal(userId);
        //expect(result.images).to.equal([]);
      });

      /*
       *
       * Method : get.activitygpxbyid : Vous devez être loggué.
       *
       */
      it('getactivitygpxbyid : Vous devez être loggué.', function () {
        // expect(function () {
        getActivityGpxById.call({ id: new Mongo.ObjectID() }, (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.getactivitygpxbyid.notloggued'
          );
        });
        /*  }).to.throw(
          'Vous devez être loggué. [ActivitiesGPX.methods.getactivitygpxbyid.notloggued]'
        ); */
      });

      /*
       *
       * Method : activity.addimage
       *
       */
      it('activityaddimage : peut ajouter une image à une activité humaine', async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const actId = await activitycreate._execute(context, Activity);

        await activityaddimage._execute(context, {
          IdActivity: actId,
          file: file
        });

        assert.strictEqual(
          await Activities.find({ 'images.asset_id': '123' }).countAsync(),
          1
        );
      });
      /*
       *
       * Method : activity.addimage : Vous devez être loggué.
       *
       */
      it('activityaddimage : Vous devez être loggué.', function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        //   expect(function () {
        activityaddimage.call(
          {
            IdActivity: activityId,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityaddimage.notloggued'
            );
          }
        );
        /*  }).to.throw(
          'Vous devez être loggué. [Activities.methods.activityaddimage.notloggued]'
        ); */
      });
      /*
       *
       * Method : activity.addimage : Vous n'êtes pas le propriétiare
       *
       */
      it("activityaddimage : Vous n'êtes pas le propriétiare", async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const actId = await activitycreate._execute(context, Activity);

        const otherContext = { userId: Random.id() };
        // expect(function () {
        activityaddimage._execute(
          otherContext,
          {
            IdActivity: actId,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityaddimage.unauthorized'
            );
          }
        );
        /*  .to.throw(
              "Vous n'êtes pas le propriétiare [Activities.methods.activityaddimage.unauthorized]"
            ); */
      });

      /*
       *
       * Method : activity.deleteimage : Vous devez être loggué.
       *
       */
      it('activitydeleteimage : Vous devez être loggué.', async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const actId = await activitycreate._execute(context, Activity);

        await activityaddimage._execute(context, {
          IdActivity: actId,
          file: file
        });

        // expect(function () {
        activitydeleteimage.call(
          {
            IdActivity: actId,
            Id: '123'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activitydeleteimage.notloggued'
            );
          }
        );
        /* }).to.throw(
          'Vous devez être loggué. [Activities.methods.activitydeleteimage.notloggued]'
        ); */
      });
      /*
       *
       * Method : activity.deleteimage : Vous n'êtes pas le propriétiare
       *
       */
      it("activitydeleteimage : Vous n'êtes pas le propriétiare", async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const actId = await activitycreate._execute(context, Activity);

        await activityaddimage._execute(context, {
          IdActivity: actId,
          file: file
        });

        const otherContext = { userId: Random.id() };

        //expect(function () {
        activitydeleteimage._execute(
          otherContext,
          {
            IdActivity: actId,
            Id: '123'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activitydeleteimage.unauthorized'
            );
          }
        );
        /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activitydeleteimage.unauthorized]"
        ); */
      });
      /*
       *
       * Method : activity.deleteimage : peut supprimer une image d'une activité humaine
       *
       */
      it("activitydeleteimage : peut supprimer une image d'une activité humaine", async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let Activity = {
          name: 'Test',
          type: 'type',
          time: '11:22:33',
          description: 'description',
          //	heure: "20:01:02",
          //	date: "12/12/2020",
          dateActivity: '2020-12-12T20:01:02+01:00',
          distance: 5.6,
          Notes: [],
          checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1']
        };

        const userId = Random.id();
        const context = { userId };

        const actId = await activitycreate._execute(context, Activity);

        await activityaddimage._execute(context, {
          IdActivity: actId,
          file: file
        });

        const file1 = {
          asset_id: '1234',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        await activityaddimage._execute(context, {
          IdActivity: actId,
          file: file1
        });

        await activitydeleteimage._execute(context, {
          IdActivity: actId,
          Id: '123'
        });

        assert.strictEqual(
          await Activities.find({ 'images.asset_id': '123' }).countAsync(),
          0
        );
        assert.strictEqual(
          await Activities.find({ 'images.asset_id': '1234' }).countAsync(),
          1
        );
      });

      /*
       *
       * Method : activity.animaladdimage
       *
       */

      it('activityanimaladdimage : Vous devez être loggué.', async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        // expect(function () {
        activityanimaladdimage.call(
          {
            IdActivity: id,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityanimaladdimage.notloggued'
            );
          }
        );
        /*  }).throw(
          'Vous devez être loggué. [Activities.methods.activityanimaladdimage.notloggued]'
        ); */
      });

      it("activityanimaladdimage : Vous n'êtes pas le propriétiare", async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });
        //   expect(function () {
        activityanimaladdimage._execute(
          { userId: Random.id() },
          {
            IdActivity: id,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityanimaladdimage.unauthorized'
            );
          }
        );
        /*   }).throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activityanimaladdimage.unauthorized]"
        ); */
      });

      it('activityanimaladdimage : peut ajouter une image à une activité animal', async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file
        });

        assert.strictEqual(
          await PetsActivities.find({ 'images.asset_id': '123' }).countAsync(),
          1
        );
      });

      /*
       *
       * Method : activity.animaldeleteimage
       *
       */
      it('activityanimaldeleteimage : Vous devez être loggué.', async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file
        });

        const file1 = {
          asset_id: '1234',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file1
        });

        //  expect(function () {
        activityanimaldeleteimage.call(
          {
            IdActivity: id,
            Id: '123'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityanimaldeleteimage.notloggued'
            );
          }
        );
        /*   }).to.throw(
          'Vous devez être loggué. [Activities.methods.activityanimaldeleteimage.notloggued]'
        ); */
      });

      it('activityanimaldeleteimage : Vous devez être loggué.', async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file
        });

        const file1 = {
          asset_id: '1234',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file1
        });

        //  expect(function () {
        activityanimaldeleteimage._execute(
          { userId: Random.id() },
          {
            IdActivity: id,
            Id: '123'
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Activities.methods.activityanimaldeleteimage.unauthorized'
            );
          }
        );
        /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Activities.methods.activityanimaldeleteimage.unauthorized]"
        ); */
      });

      it("activityanimaldeleteimage : peut supprimer une image d'une activité animal", async function () {
        let userId = Random.id();
        let context = { userId };
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let id = await animalactivitycreate._execute(context, {
          Id: Pet1Id,
          time: '00:10:00',
          name: 'Essai',
          description: 'Description',
          //heure: "08:10:00",
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file
        });

        const file1 = {
          asset_id: '1234',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        await activityanimaladdimage._execute(context, {
          IdActivity: id,
          file: file1
        });

        await activityanimaldeleteimage._execute(context, {
          IdActivity: id,
          Id: '123'
        });
        assert.strictEqual(
          await PetsActivities.find({ 'images.asset_id': '123' }).countAsync(),
          0
        );
        assert.strictEqual(
          await PetsActivities.find({ 'images.asset_id': '1234' }).countAsync(),
          1
        );
      });

      /*
       *
       * Method : activity.share (Pas connecté)
       *
       */
      it('activityshare : peut créer un parcours (Pas connecté)', async function () {
        const file = [
          {
            asset_id: '123',
            public_id: 'id_Public',
            version: 1,
            version_id: 'DEsf54fk',
            signature: 'Sign1',
            width: 1024,
            height: 800,
            format: 'png',
            resource_type: 'image',
            created_at: '2020-01-03T01:03:00',
            tags: ['Essai', 'Re'],
            bytes: 434455,
            type: 'image',
            etag: 'Test',
            placeholder: true,
            url: 'http://placeholder.com',
            secure_url: 'https://placeholder.com',
            original_filename: 'IMG_3435',
            original_extension: 'png',
            folder: 'folder'
          }
        ];

        let idGPX = await ActivitiesGPX.insertAsync({
          Owner: 'Desdde',
          GPX: {}
        });
        //  expect(function () {
        activityshare.call(
          {
            id: activityId,
            name: 'Essai',
            type: [1, 2],
            description: 'Description',
            time: '30:00:01',
            distance: 4.3,
            center: [1, 4],
            Id_GPX: idGPX,
            images: file,
            comingFrom: '1',
            dogFeatures: {
              available: false,
              free: false,
              onLeash: false,
              roadCrossing: false,
              animalCrossbreeding: false,
              animalCrossbreedingType: [],
              difficulty: 0.0
            }
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'ActivitiesGPX.methods.activityshare.notloggued'
            );
          }
        );
        /*  }).to.throw(
          'Vous devez être loggué. [ActivitiesGPX.methods.activityshare.notloggued]'
        ); */

        /* assert.strictEqual(
					Activities.find({ _id: activityId, isShared: true }).count(),
					1
				); */
        /* assert.strictEqual(
					PetsActivities.find({ "image.asset_id": "1234" }).count(),
					1
				); */
      });

      /*
       *
       * Method : activityshare.addimage
       *
       */
      it('activityshareaddimage : Vous devez être loggué.', async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let idGPX = await ActivitiesGPX.insertAsync({
          Owner: 'Desdde',
          GPX: {}
        });
        //  expect(function () {
        activityshareaddimage.call(
          {
            IdActivity: idGPX,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'ActivitiesGPX.methods.activityshareaddimage.notloggued'
            );
          }
        );
        /*  }).to.throw(
          'Vous devez être loggué. [ActivitiesGPX.methods.activityshareaddimage.notloggued]'
        ); */
      });
      it("activityshareaddimage : Vous n'êtes pas le propriétiare", async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let idGPX = await ActivitiesGPX.insertAsync({
          Owner: 'Desdde',
          GPX: {}
        });
        // expect(function () {
        activityshareaddimage._execute(
          { userId: Random.id() },
          {
            IdActivity: idGPX,
            file: file
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'ActivitiesGPX.methods.activityshareaddimage.unauthorized'
            );
          }
        );
        /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [ActivitiesGPX.methods.activityshareaddimage.unauthorized]"
        ); */
      });
      it('activityshareaddimage : peut ajouter une image à une activité partagée', async function () {
        const file = {
          asset_id: '123',
          public_id: 'id_Public',
          version: 1,
          version_id: 'DEsf54fk',
          signature: 'Sign1',
          width: 1024,
          height: 800,
          format: 'png',
          resource_type: 'image',
          created_at: '2020-01-03T01:03:00',
          tags: ['Essai', 'Re'],
          bytes: 434455,
          type: 'image',
          etag: 'Test',
          placeholder: true,
          url: 'http://placeholder.com',
          secure_url: 'https://placeholder.com',
          original_filename: 'IMG_3435',
          original_extension: 'png',
          folder: 'folder'
        };

        let userId = Random.id();
        let context = { userId };

        let idGPX = await ActivitiesGPX.insertAsync({ Owner: userId, GPX: {} });
        await activityshareaddimage._execute(context, {
          IdActivity: idGPX,
          file: file
        });

        assert.strictEqual(
          await ActivitiesGPX.find({ _id: idGPX }).countAsync(),
          1
        );
        /* assert.strictEqual(
					PetsActivities.find({ "image.asset_id": "1234" }).count(),
					1
				); */
      });

      /*
       *
       * Method : activitytype
       *
       */
      it("activitytype : récupère les types d'activité", async function () {
        /* 	const dbName = "GPX";

				//	log.info("MONGO : " + Meteor.settings.private.MONGOURL);
				// Use connect method to connect to the server
				const client = await MongoClient.connect("mongodb://localhost:3001", {
					useUnifiedTopology: true,
				});

				log.info("Connected successfully to server");
				const db = client.db(dbName);

				const collection = db.collection("activityType"); */

        await activityType.insertAsync({
          activityType: [
            'Balade',
            'Cani-cross',
            'Cani-VTT',
            'Course à pied',
            'Equitation - Dressage',
            'Equitation - Balade',
            'Vélo',
            'Randonnée',
            'EEEEEEE'
          ]
        });

        let resultat;
        log.info('AVANT CALL');
        await Meteor.call('activitytype', (error, result) => {
          if (error) {
            log.info(error);
          } else {
            log.info('DANS CALL');
            resultat = result;
          }
        });
        log.info('APRES CALL');
        /* 	log.info(resultat[0].activityType.length);
				log.info(resultat[0].activityType);

				assert.strictEqual(resultat[0].activityType.length, 6);
				assert.strictEqual(resultat[0].activityType, [
					"Balade",
					"Cani-cross",
					"Cani-VTT",
					"Course à pied",
					"Equitation - Dressage",
					"Equitation - Balade",
					"Vélo",
					"Randonnée",
					"EEEEEEE",
				]); */

        //assert.equal(null, err);
      });
    });
  });
}

if (Meteor.isServer) {
  /*
   *
   * Method : activity.share (Pas propriétaire)
   *
   */
  describe('Activity: Method client', () => {
    it('activityshare : peut partager une activité comingFrom: 1', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      const result = await Activities.findOneAsync({ _id: ActId });

      const otherUserContext = { userId: Random.id() };
      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [1.3],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '1',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });
      const result1 = await ActivitiesGPX.findOneAsync({
        _id: result.Id_GPX
      });

      assert.strictEqual(result1.Shared, true);
      assert.strictEqual(
        (
          await Activities.findOneAsync({
            Id_GPX: result.Id_GPX
          })
        ).isShared,
        true
      );
    });

    it('activityshare : peut partager une activité (comingFrom: 2', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        Id: Pet1Id,
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: 'Toto',

        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };

      const ActId = await animalactivitycreatefromgps._execute(
        context,
        Activity
      );

      const result = await PetsActivities.findOneAsync({ _id: ActId });

      const otherUserContext = { userId: Random.id() };
      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [1, 3],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '2',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });

      assert.strictEqual(
        (
          await ActivitiesGPX.findOneAsync({
            _id: result.Id_GPX
          })
        ).Shared,
        true
      );
      assert.strictEqual(
        (
          await PetsActivities.findOneAsync({
            Id_GPX: result.Id_GPX
          })
        ).isShared,
        true
      );
    });

    it('activityshare : peut partager une activité (Pas propriétaire)', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      const result = await Activities.findOneAsync({ _id: ActId });

      const otherUserContext = { userId: Random.id() };

      // expect(function () {
      activityshare._execute(
        otherUserContext,
        {
          id: ActId,
          name: 'Essai',
          type: [1, 3],
          description: 'Description',
          time: '30:00:01',
          distance: 4.3,
          center: [1, 4],
          Id_GPX: result.Id_GPX,
          images: [],
          comingFrom: '1',
          dogFeatures: {
            available: false,
            free: false,
            onLeash: false,
            roadCrossing: false,
            animalCrossbreeding: false,
            animalCrossbreedingType: [],
            difficulty: 0.0
          }
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.activityshare.unauthorized'
          );
        }
      );
      /*  }).to.throw(
        "Vous n'êtes pas le propriétiare [ActivitiesGPX.methods.activityshare.unauthorized]"
      ); */

      //);
    });
  });

  describe('Activity: Method unshare', () => {
    //
    // activityunshare : peut efface un parcours 'départager' une activité
    //

    it("activityunshare : peut efface un parcours 'départager' une activité", async function () {
      log.info('activityunshare : peut efface un parcours');
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      log.info('Pet1Id : ' + Pet1Id);

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      log.info('ActId : ' + ActId);
      const result = await Activities.findOneAsync({ _id: ActId });

      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [2, 3],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '1',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });

      //);

      // expect(function () {
      activitygpxunshared.call(
        {
          id: result.Id_GPX
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.activitygpxunshared.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [ActivitiesGPX.methods.activitygpxunshared.notloggued]'
      );
 */
      //   expect(function () {
      activitygpxunshared._execute(
        { userId: Random.id() },
        {
          id: result.Id_GPX
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.activitygpxunshared.unauthorized'
          );
        }
      );
      /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [ActivitiesGPX.methods.activitygpxunshared.unauthorized]"
        ); */

      await activitygpxunshared._execute(context, {
        id: result.Id_GPX
      });

      const resultGPX = await ActivitiesGPX.findOneAsync({
        _id: result.Id_GPX
      });

      assert.strictEqual(resultGPX.Shared, false);
    });

    //
    // activityshare : Le parcours est déjà créé à partir de cette activité
    //

    it('activitnshare : Le parcours est déjà créé à partir de cette activité', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      const result = await Activities.findOneAsync({ _id: ActId });

      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [2, 3],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '1',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });

      // expect(function () {
      activityshare._execute(
        context,
        {
          id: ActId,
          name: 'Essai',
          type: [2, 3],
          description: 'Description',
          time: '30:00:01',
          distance: 4.3,
          center: [1, 4],
          Id_GPX: result.Id_GPX,
          images: [],
          comingFrom: '1',
          dogFeatures: {
            available: false,
            free: false,
            onLeash: false,
            roadCrossing: false,
            animalCrossbreeding: false,
            animalCrossbreedingType: [],
            difficulty: 0.0
          }
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.activityshare.alreadyshared'
          );
        }
      );
      /*  }).to.throw(
        'Le parcours est déjà créé à partir de cette activité [ActivitiesGPX.methods.activityshare.alreadyshared]'
      ); */
    });

    //
    // activitygpxlike : Like un parcours
    //

    it('activitygpxlike : Like un parcours', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      const result = await Activities.findOneAsync({ _id: ActId });

      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [1, 2],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '1',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });

      //  expect(function () {
      activitygpxlike.call(
        {
          Id: result.Id_GPX,
          like: 4,
          dislike: 2
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.activitygpxlike.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [ActivitiesGPX.methods.activitygpxlike.notloggued]'
      ); */

      await activitygpxlike._execute(context, {
        Id: result.Id_GPX,
        like: 4,
        dislike: 2
      });

      const resultGPX = await ActivitiesGPX.findOneAsync({
        _id: result.Id_GPX
      });

      assert.strictEqual(resultGPX.like, 4);
      assert.strictEqual(resultGPX.dislike, 2);

      expect(resultGPX.SelectLike.includes(userId)).to.be.true;
      expect(resultGPX.SelectDislike.includes(userId)).to.be.false;
    });

    //
    // activitygpsdislike : Dislike un parcours
    //

    it('activitygpsdislike : Dislike un parcours', async function () {
      const userId = Random.id();

      const Pet1Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Phantom',
        Type: 'Chien',
        isShare: true,
        Birthday: '12/11/2020',
        Weight: 10,
        Height: 12
      });

      const Pet2Id = await Pets.insertAsync({
        Owner: userId,
        Name: 'Medoc',
        Type: 'Cheval',
        isShare: true,
        Birthday: '12/11/2010',
        Weight: 150,
        Height: 170
      });

      const Activity = {
        name: 'Test',
        type: 'type',
        time: '11:22:33',
        description: 'description',
        //	heure: "20:01:02",
        //	date: "12/12/2020",
        dateActivity: '2020-12-12T20:01:02+01:00',
        distance: 5.6,
        Notes: [],
        checked: [Pet1Id + ',Phantom,0', Pet2Id + ',Medor,1'],
        geojson: [
          {
            type: 'Feature',
            properties: {
              time: '',
              coordinateProperties: {
                times: [],
                heart: []
              }
            },
            geometry: {
              type: 'LineString',
              coordinates: [[49, 23]]
            }
          }
        ]
      };

      const context = { userId };
      const ActId = await activitycreatefromgps._execute(context, Activity);

      const result = await Activities.findOneAsync({ _id: ActId });
      await activityshare._execute(context, {
        id: ActId,
        name: 'Essai',
        type: [1, 2],
        description: 'Description',
        time: '30:00:01',
        distance: 4.3,
        center: [1, 4],
        Id_GPX: result.Id_GPX,
        images: [],
        comingFrom: '1',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      });

      //   expect(function () {
      activitygpxdislike.call(
        {
          Id: result.Id_GPX,
          like: 2,
          dislike: 9
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'ActivitiesGPX.methods.activitygpxdislike.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [ActivitiesGPX.methods.activitygpxdislike.notloggued]'
      ); */

      await activitygpxdislike._execute(context, {
        Id: result.Id_GPX,
        like: 2,
        dislike: 9
      });

      const resultGPX = await ActivitiesGPX.findOneAsync({
        _id: result.Id_GPX
      });

      assert.strictEqual(resultGPX.like, 2);
      assert.strictEqual(resultGPX.dislike, 9);

      expect(resultGPX.SelectLike.includes(userId)).to.be.false;
      expect(resultGPX.SelectDislike.includes(userId)).to.be.true;
    });
  });
}

if (Meteor.isServer) {
  describe('Activities Methods', function () {
    let userId;
    let idActivityGPX;
    let context;

    beforeEach(async function () {
      userId = Random.id();
      await ActivitiesGPX.removeAsync({});
      idActivityGPX = await ActivitiesGPX.insertAsync({
        Owner: userId,
        GPX: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                time: '',
                coordTimes: [
                  '2021-03-26T17:22:08Z',
                  '2021-03-26T17:22:10Z',
                  '2021-03-26T17:22:11Z',
                  '2021-03-26T17:22:14Z',
                  '2021-03-26T17:22:21Z',
                  '2021-03-26T17:22:23Z',
                  '2021-03-26T17:22:26Z',
                  '2021-03-26T17:22:31Z',
                  '2021-03-26T17:22:34Z',
                  '2021-03-26T17:22:37Z',
                  '2021-03-26T17:22:40Z',
                  '2021-03-26T17:22:42Z',
                  '2021-03-26T17:22:46Z',
                  '2021-03-26T17:22:52Z',
                  '2021-03-26T17:23:14Z',
                  '2021-03-26T17:23:14Z',
                  '2021-03-26T17:23:17Z',
                  '2021-03-26T17:23:19Z',
                  '2021-03-26T17:23:21Z',
                  '2021-03-26T17:23:23Z',
                  '2021-03-26T17:23:25Z',
                  '2021-03-26T17:23:27Z',
                  '2021-03-26T17:23:29Z',
                  '2021-03-26T17:23:31Z',
                  '2021-03-26T17:23:33Z',
                  '2021-03-26T17:23:35Z',
                  '2021-03-26T17:23:37Z',
                  '2021-03-26T17:23:39Z',
                  '2021-03-26T17:23:41Z',
                  '2021-03-26T17:23:43Z',
                  '2021-03-26T17:23:45Z',
                  '2021-03-26T17:23:47Z',
                  '2021-03-26T17:23:53Z',
                  '2021-03-26T17:23:55Z',
                  '2021-03-26T17:23:57Z',
                  '2021-03-26T17:23:59Z',
                  '2021-03-26T17:24:01Z',
                  '2021-03-26T17:24:03Z',
                  '2021-03-26T17:24:05Z',
                  '2021-03-26T17:24:07Z',
                  '2021-03-26T17:24:09Z',
                  '2021-03-26T17:24:11Z',
                  '2021-03-26T17:24:15Z',
                  '2021-03-26T17:24:18Z',
                  '2021-03-26T17:24:18Z',
                  '2021-03-26T17:24:20Z',
                  '2021-03-26T17:24:22Z',
                  '2021-03-26T17:24:24Z',
                  '2021-03-26T17:24:26Z',
                  '2021-03-26T17:24:28Z',
                  '2021-03-26T17:24:30Z',
                  '2021-03-26T17:24:33Z',
                  '2021-03-26T17:24:44Z',
                  '2021-03-26T17:24:46Z',
                  '2021-03-26T17:24:48Z',
                  '2021-03-26T17:24:50Z',
                  '2021-03-26T17:24:53Z',
                  '2021-03-26T17:24:55Z',
                  '2021-03-26T17:24:57Z',
                  '2021-03-26T17:24:59Z',
                  '2021-03-26T17:25:01Z',
                  '2021-03-26T17:25:03Z',
                  '2021-03-26T17:25:05Z',
                  '2021-03-26T17:25:07Z',
                  '2021-03-26T17:25:09Z',
                  '2021-03-26T17:25:11Z',
                  '2021-03-26T17:25:13Z',
                  '2021-03-26T17:25:15Z',
                  '2021-03-26T17:25:17Z',
                  '2021-03-26T17:25:19Z',
                  '2021-03-26T17:25:21Z',
                  '2021-03-26T17:25:23Z',
                  '2021-03-26T17:25:25Z',
                  '2021-03-26T17:25:27Z',
                  '2021-03-26T17:25:29Z',
                  '2021-03-26T17:25:31Z',
                  '2021-03-26T17:25:34Z',
                  '2021-03-26T17:25:36Z',
                  '2021-03-26T17:25:38Z',
                  '2021-03-26T17:25:40Z',
                  '2021-03-26T17:25:42Z',
                  '2021-03-26T17:25:44Z',
                  '2021-03-26T17:25:46Z',
                  '2021-03-26T17:25:48Z',
                  '2021-03-26T17:25:50Z',
                  '2021-03-26T17:25:52Z',
                  '2021-03-26T17:25:54Z',
                  '2021-03-26T17:25:56Z',
                  '2021-03-26T17:25:59Z',
                  '2021-03-26T17:26:02Z',
                  '2021-03-26T17:26:08Z',
                  '2021-03-26T17:27:40Z',
                  '2021-03-26T17:28:27Z',
                  '2021-03-26T17:29:12Z',
                  '2021-03-26T17:29:47Z',
                  '2021-03-26T17:29:58Z',
                  '2021-03-26T17:30:01Z',
                  '2021-03-26T17:31:24Z',
                  '2021-03-26T17:36:04Z',
                  '2021-03-26T17:36:10Z',
                  '2021-03-26T17:36:13Z',
                  '2021-03-26T17:36:17Z',
                  '2021-03-26T17:36:22Z',
                  '2021-03-26T17:36:27Z',
                  '2021-03-26T17:36:29Z',
                  '2021-03-26T17:36:31Z',
                  '2021-03-26T17:36:33Z',
                  '2021-03-26T17:36:35Z',
                  '2021-03-26T17:36:37Z',
                  '2021-03-26T17:36:39Z',
                  '2021-03-26T17:36:42Z',
                  '2021-03-26T17:36:44Z',
                  '2021-03-26T17:36:46Z',
                  '2021-03-26T17:36:48Z',
                  '2021-03-26T17:36:50Z',
                  '2021-03-26T17:36:52Z',
                  '2021-03-26T17:36:55Z',
                  '2021-03-26T17:37:24Z',
                  '2021-03-26T17:37:26Z',
                  '2021-03-26T17:37:28Z',
                  '2021-03-26T17:37:30Z',
                  '2021-03-26T17:37:32Z',
                  '2021-03-26T17:37:34Z',
                  '2021-03-26T17:37:36Z',
                  '2021-03-26T17:37:38Z',
                  '2021-03-26T17:37:40Z',
                  '2021-03-26T17:37:42Z',
                  '2021-03-26T17:37:44Z',
                  '2021-03-26T17:37:46Z',
                  '2021-03-26T17:37:48Z',
                  '2021-03-26T17:37:52Z',
                  '2021-03-26T17:37:55Z',
                  '2021-03-26T17:37:57Z',
                  '2021-03-26T17:37:59Z',
                  '2021-03-26T17:38:01Z',
                  '2021-03-26T17:38:03Z',
                  '2021-03-26T17:38:05Z',
                  '2021-03-26T17:38:07Z',
                  '2021-03-26T17:38:09Z',
                  '2021-03-26T17:38:12Z',
                  '2021-03-26T17:38:15Z',
                  '2021-03-26T17:38:17Z',
                  '2021-03-26T17:38:19Z',
                  '2021-03-26T17:38:21Z',
                  '2021-03-26T17:38:23Z',
                  '2021-03-26T17:38:26Z',
                  '2021-03-26T17:38:28Z',
                  '2021-03-26T17:38:30Z',
                  '2021-03-26T17:38:32Z',
                  '2021-03-26T17:38:34Z',
                  '2021-03-26T17:38:36Z',
                  '2021-03-26T17:38:40Z',
                  '2021-03-26T17:38:40Z',
                  '2021-03-26T17:38:53Z',
                  '2021-03-26T17:38:56Z',
                  '2021-03-26T17:38:59Z',
                  '2021-03-26T17:39:02Z',
                  '2021-03-26T17:39:44Z',
                  '2021-03-26T17:39:51Z',
                  '2021-03-26T17:39:55Z',
                  '2021-03-26T17:39:59Z',
                  '2021-03-26T17:40:13Z',
                  '2021-03-26T17:40:40Z',
                  '2021-03-26T17:40:41Z',
                  '2021-03-26T17:40:43Z',
                  '2021-03-26T17:40:45Z',
                  '2021-03-26T17:40:47Z',
                  '2021-03-26T17:40:49Z',
                  '2021-03-26T17:40:53Z',
                  '2021-03-26T17:40:55Z',
                  '2021-03-26T17:40:57Z',
                  '2021-03-26T17:40:59Z',
                  '2021-03-26T17:41:01Z',
                  '2021-03-26T17:41:03Z',
                  '2021-03-26T17:41:05Z',
                  '2021-03-26T17:41:07Z',
                  '2021-03-26T17:41:09Z',
                  '2021-03-26T17:41:11Z',
                  '2021-03-26T17:41:13Z',
                  '2021-03-26T17:41:15Z',
                  '2021-03-26T17:41:17Z',
                  '2021-03-26T17:41:19Z',
                  '2021-03-26T17:41:21Z',
                  '2021-03-26T17:41:24Z',
                  '2021-03-26T17:41:27Z',
                  '2021-03-26T17:41:50Z',
                  '2021-03-26T17:41:52Z',
                  '2021-03-26T17:41:54Z',
                  '2021-03-26T17:41:56Z',
                  '2021-03-26T17:41:58Z',
                  '2021-03-26T17:42:00Z',
                  '2021-03-26T17:42:02Z',
                  '2021-03-26T17:42:04Z',
                  '2021-03-26T17:42:06Z',
                  '2021-03-26T17:42:09Z',
                  '2021-03-26T17:42:13Z',
                  '2021-03-26T17:42:16Z',
                  '2021-03-26T17:42:39Z',
                  '2021-03-26T17:42:50Z',
                  '2021-03-26T17:43:08Z',
                  '2021-03-26T17:43:19Z',
                  '2021-03-26T17:43:31Z',
                  '2021-03-26T17:43:35Z',
                  '2021-03-26T17:43:42Z',
                  '2021-03-26T17:43:54Z',
                  '2021-03-26T17:44:38Z',
                  '2021-03-26T17:45:05Z',
                  '2021-03-26T17:45:15Z',
                  '2021-03-26T17:45:19Z',
                  '2021-03-26T17:45:23Z',
                  '2021-03-26T17:45:27Z',
                  '2021-03-26T17:45:31Z',
                  '2021-03-26T17:45:39Z',
                  '2021-03-26T17:45:43Z',
                  '2021-03-26T17:45:45Z',
                  '2021-03-26T17:46:18Z',
                  '2021-03-26T17:46:29Z',
                  '2021-03-26T17:46:45Z',
                  '2021-03-26T17:46:49Z',
                  '2021-03-26T17:48:28Z',
                  '2021-03-26T17:48:32Z',
                  '2021-03-26T17:48:33Z',
                  '2021-03-26T17:48:35Z',
                  '2021-03-26T17:48:36Z',
                  '2021-03-26T17:49:13Z',
                  '2021-03-26T17:49:20Z',
                  '2021-03-26T17:49:22Z',
                  '2021-03-26T17:49:26Z',
                  '2021-03-26T17:49:42Z',
                  '2021-03-26T17:49:51Z',
                  '2021-03-26T17:50:08Z'
                ],
                heartRates: []
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [2.5850383, 49.2034361],
                  [2.5849947, 49.2033989],
                  [2.5849013, 49.2033595],
                  [2.5848447, 49.2033307],
                  [2.5847524, 49.2032611],
                  [2.584688, 49.2032268],
                  [2.5846406, 49.2031939],
                  [2.5845797, 49.2031519],
                  [2.5845202, 49.2031166],
                  [2.584465, 49.2030852],
                  [2.5844106, 49.2030384],
                  [2.5843751, 49.202998],
                  [2.5843474, 49.2029525],
                  [2.5842745, 49.2029509],
                  [2.5843922, 49.2030228],
                  [2.5846841, 49.2032072],
                  [2.5848834, 49.203349],
                  [2.5851149, 49.2034886],
                  [2.5853738, 49.2036311],
                  [2.5856217, 49.2037736],
                  [2.5858497, 49.2039036],
                  [2.5860598, 49.204048],
                  [2.5862561, 49.204183],
                  [2.586453, 49.2043379],
                  [2.5866579, 49.2044549],
                  [2.586836, 49.2045516],
                  [2.5870328, 49.2046626],
                  [2.5872469, 49.2047793],
                  [2.5874514, 49.2049011],
                  [2.5876586, 49.2050291],
                  [2.5878729, 49.2051618],
                  [2.5880319, 49.2052663],
                  [2.5881399, 49.2053435],
                  [2.5882533, 49.2054138],
                  [2.5883851, 49.2055013],
                  [2.5885505, 49.2056087],
                  [2.5887084, 49.2057235],
                  [2.5888673, 49.205832],
                  [2.5890504, 49.2059528],
                  [2.5892401, 49.2060699],
                  [2.5894074, 49.2061779],
                  [2.58952, 49.2062644],
                  [2.5895912, 49.206354],
                  [2.5896803, 49.2064967],
                  [2.5896803, 49.2064967],
                  [2.5897537, 49.2066731],
                  [2.5898833, 49.2068701],
                  [2.5900454, 49.2070625],
                  [2.59019, 49.2072434],
                  [2.590319, 49.2073987],
                  [2.5904269, 49.2075299],
                  [2.590502, 49.207639],
                  [2.590561, 49.2077287],
                  [2.5906214, 49.2078207],
                  [2.5906793, 49.2079096],
                  [2.5907317, 49.2079951],
                  [2.5909076, 49.2080334],
                  [2.5910665, 49.2079667],
                  [2.5912721, 49.2078919],
                  [2.5915026, 49.2078099],
                  [2.5917523, 49.2077236],
                  [2.5920198, 49.207632],
                  [2.592313, 49.2075608],
                  [2.5926198, 49.2075855],
                  [2.592979, 49.207645],
                  [2.5933761, 49.2076885],
                  [2.5937887, 49.2077416],
                  [2.5942196, 49.2077953],
                  [2.5946573, 49.2078323],
                  [2.5950537, 49.2078581],
                  [2.5954388, 49.2078882],
                  [2.5958121, 49.2079147],
                  [2.5961885, 49.2079482],
                  [2.596557, 49.2079797],
                  [2.5968892, 49.2080149],
                  [2.5971457, 49.2080466],
                  [2.5974154, 49.2080302],
                  [2.5975912, 49.2078923],
                  [2.5977837, 49.2077373],
                  [2.5979882, 49.2075893],
                  [2.5981405, 49.2074701],
                  [2.5982329, 49.2073832],
                  [2.5982894, 49.2072985],
                  [2.5984339, 49.2072877],
                  [2.5985743, 49.2073775],
                  [2.5987546, 49.2074978],
                  [2.5989857, 49.2076015],
                  [2.5991925, 49.2076889],
                  [2.5994314, 49.2077979],
                  [2.5995702, 49.2078565],
                  [2.5996814, 49.207783],
                  [2.5997514, 49.2077486],
                  [2.5998357, 49.2077336],
                  [2.599873, 49.2077858],
                  [2.599938, 49.2078446],
                  [2.5999976, 49.2078822],
                  [2.6001107, 49.2079336],
                  [2.6002127, 49.2079939],
                  [2.6001729, 49.207957],
                  [2.6000947, 49.207941],
                  [2.5999671, 49.2078728],
                  [2.5998199, 49.2078304],
                  [2.5997651, 49.2078662],
                  [2.5996499, 49.2078879],
                  [2.599514, 49.2078617],
                  [2.5993537, 49.2078054],
                  [2.5991532, 49.207716],
                  [2.5989339, 49.2076188],
                  [2.59872, 49.2075255],
                  [2.5985222, 49.207431],
                  [2.598289, 49.2073253],
                  [2.5981562, 49.2073487],
                  [2.5980408, 49.2074589],
                  [2.5978862, 49.2075987],
                  [2.5977265, 49.2077528],
                  [2.5975678, 49.2078806],
                  [2.5974149, 49.2080096],
                  [2.5973279, 49.208099],
                  [2.5971631, 49.2081063],
                  [2.5969375, 49.2080747],
                  [2.5966553, 49.2080392],
                  [2.596348, 49.2080056],
                  [2.5960325, 49.20797],
                  [2.5957293, 49.2079309],
                  [2.5954365, 49.2078992],
                  [2.5951454, 49.2078698],
                  [2.5948321, 49.2078385],
                  [2.5945073, 49.2078049],
                  [2.5942035, 49.2077734],
                  [2.5939676, 49.2077494],
                  [2.5937303, 49.2077288],
                  [2.5935074, 49.207713],
                  [2.5932402, 49.2076882],
                  [2.5929634, 49.2076597],
                  [2.5926995, 49.2076268],
                  [2.5924469, 49.2075944],
                  [2.592213, 49.2075815],
                  [2.5920116, 49.2076149],
                  [2.5918614, 49.2076663],
                  [2.5917445, 49.2077244],
                  [2.5916113, 49.2077847],
                  [2.5914916, 49.207835],
                  [2.5913316, 49.2078975],
                  [2.5911422, 49.2079695],
                  [2.590937, 49.2080434],
                  [2.5906823, 49.2080955],
                  [2.5905295, 49.2080077],
                  [2.5904225, 49.2078756],
                  [2.5903097, 49.2077358],
                  [2.5902106, 49.2076171],
                  [2.5901246, 49.2075297],
                  [2.5900564, 49.207451],
                  [2.5900609, 49.2074548],
                  [2.5900394, 49.207402],
                  [2.5900058, 49.2073561],
                  [2.5899487, 49.2073206],
                  [2.5898976, 49.2072873],
                  [2.5899731, 49.2072702],
                  [2.5900513, 49.2072776],
                  [2.5900903, 49.2073158],
                  [2.5901027, 49.2073605],
                  [2.5901371, 49.2074048],
                  [2.5899987, 49.2073256],
                  [2.5899088, 49.2072212],
                  [2.5897978, 49.2070606],
                  [2.5896965, 49.2069048],
                  [2.58959, 49.2067478],
                  [2.5894975, 49.2066242],
                  [2.5894279, 49.2065449],
                  [2.5893724, 49.2064522],
                  [2.5893154, 49.206313],
                  [2.589214, 49.2061441],
                  [2.5890238, 49.2059956],
                  [2.588804, 49.2058612],
                  [2.5885901, 49.2057294],
                  [2.5883669, 49.2055945],
                  [2.5881412, 49.2054603],
                  [2.5879168, 49.2053285],
                  [2.5876969, 49.2052004],
                  [2.5874776, 49.2050752],
                  [2.5872732, 49.2049502],
                  [2.587101, 49.2048447],
                  [2.586987, 49.2047847],
                  [2.5868374, 49.2046857],
                  [2.5867298, 49.2046126],
                  [2.5866702, 49.2045889],
                  [2.586576, 49.2045179],
                  [2.5864536, 49.2044299],
                  [2.5862998, 49.2043339],
                  [2.5861099, 49.2042156],
                  [2.5859172, 49.2040992],
                  [2.5856983, 49.2039886],
                  [2.5854849, 49.2038726],
                  [2.5853145, 49.2037639],
                  [2.5851409, 49.2036622],
                  [2.5850571, 49.2035792],
                  [2.5849869, 49.2035365],
                  [2.5849154, 49.2035401],
                  [2.5848625, 49.2035719],
                  [2.5849515, 49.2035696],
                  [2.5850295, 49.2035628],
                  [2.5849384, 49.2035867],
                  [2.5848655, 49.203615],
                  [2.5847906, 49.203615],
                  [2.5848721, 49.2036277],
                  [2.5848957, 49.2035854],
                  [2.5849625, 49.2035706],
                  [2.5848877, 49.2035871],
                  [2.5848289, 49.2036178],
                  [2.5847611, 49.2036509],
                  [2.5847079, 49.2036809],
                  [2.5848146, 49.2036374],
                  [2.584867, 49.2036078],
                  [2.5849169, 49.2035734],
                  [2.5848029, 49.2036246],
                  [2.5848539, 49.2035931],
                  [2.5849226, 49.2035966],
                  [2.5849618, 49.2035574],
                  [2.5849983, 49.2035487],
                  [2.5844296, 49.2032234],
                  [2.5848415, 49.2033493],
                  [2.5848918, 49.2035201],
                  [2.5849374, 49.2033433],
                  [2.5849713, 49.2032683],
                  [2.5849383, 49.2033582],
                  [2.5849734, 49.2034111],
                  [2.584993, 49.2034601],
                  [2.5850186, 49.2035217],
                  [2.5850502, 49.2035623],
                  [2.584979, 49.2035768],
                  [2.5849019, 49.2035891]
                ]
              }
            }
          ]
        },
        Shared: true,
        SelectDislike: [],
        SelectLike: [],
        dislike: 0,
        like: 1,
        center: [49.205528599999994, 2.5922435999999998],
        geoFences: [
          [49.2034361, 2.5850383],
          [49.2043379, 2.586453],
          [49.2062644, 2.58952],
          [49.207632, 2.5920198],
          [49.2079482, 2.5961885],
          [49.2078565, 2.5995702],
          [49.2078806, 2.5975678],
          [49.207713, 2.5935074],
          [49.207451, 2.5900564],
          [49.2054603, 2.5881412],
          [49.2035792, 2.5850571],
          [49.2035623, 2.5850502]
        ],
        description: '',
        distance: 3.42,
        images: [],
        name: 'Aak',
        time: '00:28:01',
        type: 'Equitation - Dressage',
        bounds: [
          [49.2029509, 2.5842745],
          [49.2081063, 2.6002127]
        ],
        polyline:
          'sfjkFzzyv@@ADCBCBAHERGJEd@UVSDO@EJST[L?F???D?D?F?NDT@JCRCB?BDFLDNDLDHHFHH@DBHHRLLLTBPAJAD?HDJ@BFVD@DBLNBDDPBD@DHJFFHJHFJJDJF^QLDBD@D?BATQFEBCBEt@SBI@KBEHMFE@CD@H?HCFCFCBA^OBA^ADAPOJIDALWGQ?IGIEWFQBGDEFO@Q?EBQ?Q@C@[?GCEGMAM?U@M@E?EAYIe@CMAW?GDo@LY@EJUBMDKFQ@CJWDMBMH_@HQFEHKDs@@CJKDAF@D@@BBD@@HDDCJED?FCDA\\?PCRAJCRILEJAB@HF?@?BBDFHFLFJ?@@HFFFDHL@@?D@@@DDHBF@DBH@HFTHJFJBL@BJFB@FBADJJDBNJF@@GFCF@D@LAJA@GJGKM@CBEFGBCHELIBCFI@CBMFY?E@K@MJi@BG@EHKHI@CBEDKFIFOBCDIFGFGDGBCLGH?BEHKD?FIHM@EDI@APOFIB]TWJIGMBEPUFGBM@C?ANCLIFENILAB?D?PBFDJFDDPL@BFBB@BBRJFDFCD@LBPAJCJCJCNGJAF@DATGZSDEVUN]DEFY@?D@BABA@?@@@@BH?DBHBD@H@BBFCP????B?B?F?JAD@LDJ@FGZFDBNDF@BAN?JBN@J@P@?C??EAIKQAC?C?IBC@?@@@H@D@T@F?HBB?VDT@DAD?D@TMBI@EAECm@?ECQC?Y?W?CAE?O?ABGDA@A@E?G?K@I@C?M@M@??@??C@C?O?I@IRKNCHCBEBI@E@C?OAEA]CECGCCCQ@?JIFGRGB?BCJCHAXCD?N@B@HDHDD@H@H@B?J@HBBBB?@E?I?W?QAGG_@Js@?GAEFGRID@JBRDZAD@J?B@J?\\EHAR@RWF?DABAF@NQXAP?J@H@R@F?PCL@`@AB?J?N@D@VAF?B?LCD?XCDAJ?^CJAHAD@DAJMH?@ALAD?L?D?B?TDB@B@@AAJCJCD?D?D@FBNDL@DBDJJBBDN?F@???BE?@??@@HA@@HL?FBGJSLGJCZGB?R@H?LD@@B??AFEDCNQFINWDCVKTIDAVM\\[La@@ED[?EA]?O?CCE?E?A????AC?AEICEIYAKCMCKESIi@AGE[I_@?EE[Ie@Ge@C[GQGa@ESCMGi@CME[Ig@Gg@GYAKIg@AMGYG[AECAG?]RGJOPCB?@?DCB?DUVOJYLYHE@e@LIBUCg@S]YEGCGGWIc@ACCCK@@JOL]NC@]BUFKBOBIDGAAEIa@?ICOCCAYC_@?O?AEEDG?AA?CEI[EUGQI[Oa@CQ?WIa@KUCCAGKCC?I@A@CBOHC?CCCCEEGIIO@EFEJU?GDWFIBEBS@CHUDIDODI@EBKEOCM?W?U@G?OAA??KI?A?E?C@?EAAKKICAAACGBC?IAEAEAEGUBUBI?KCYCICEAEBQEKACAE@GHq@@EBUBQ?GBKD]AE?SAQAO?E?E?EB]?E@QDK?O@GEY?MCE?GDSBEHCFB@A@GAa@ACGOSYQICAOIOMKEGEIGIQCCKKKQOQGECAWCOJMEOEG@IIKMEKM[CQCKW_@CEGKECMUCCCA@CES?E@i@?Q?E@A?C?ECAEIACACCG??@A?I?@A?GAGCGAEBCAICACA?G?CECC?AACA?CD?@GACCCECCGIACAEEKEIGG@e@ICC@OHGB?@CAEGEQIa@?GG[AMAKAG?GGWAIEU@GWUMUQOO]EIQ[UYCGO[O[MSQUCEQUGIKOMSGUEGGGKSA@GBABC@CDEBA@GFABC@I@E@CB?DC?CCQMGKACCGSWMAI?EAO?GBMHAFADGT@HGFGFA@ABEHC?IMCGQQOEAAA?C?A@?@?@@BBN?D@B@R?F?J?D?DGF?BABETADA@ABIPAFEV?D?J@PBRBDBHP^DLBPBHJL@L?DBHRRDHHJ@FDH@DFPHHDI@IAIAY@KAGFEBAH@N@D@BBJBJBHBHBBBPP@BHTDHFNBBLHB@DBZLJ@LHXND?B@JNFHJRBB@DHPBFBNAD?B?PDVDX?D?NCDGFMFOFCBC@OFWJCBQBA@MBGBC@GFC@SNC@A@G@GFC?IFC??@EBA?CBGACDC@C?ULC?M@C@UJE@I@QDG@QHC@OFEBKFC@C@OJGHABAFAB?BKDBHBD?DA@?F@N@H?J?J?R?BBHABBF@BAJCFIHC@K?C@I@SFQDMLDf@MJUGQG]CE?QAUEE?a@IMEWM]MCA_@IMCIGYEK?MGQIUCE?W@K?Q?OC[CMASAGCE?M?E@EBWCQ@?D?NIDKFEHIPCFADJVADAB@LETGNEHCFAHAF?X?L@DJ\\@F?D@DHJBBRNBHAZ@F?L@J@NFNB@HFFJLR@B@DJZFP?D?H@F?@A@?@FD?ADKBI@EBG???????????@?A@EBAJUFIBEFIBEFQBK?EBM@OBKDM@SBS@G?C?QDMLAFA@APAVFFBFDHJBJB@?D?FABEFGFCBKDEBKDIJCHCDAJ?D?LDT?D@DDNDHFJBBFJHN@DBDBHBDDHHLDHDHHR@BDPBJBDBBBDBDDCBE@EPURUDENYPSLIRO@?@?PXLRNHTBHAF?B?@HFb@BJBBFPB@AF@^?VADOZMZGJSj@ABGDGJCBIFEH@F?F@FAHFHBDB?DJLJ@D@@@FBDJHJLPLBBBBHJZRF?TBTHF@ZPVJDDDBX`@BBLJHPVVB@TVARCDGVAr@Gn@YRUAWMKGWIUGICOC?A@@jBjATHXBD@\\@LLDBDD?@@ACE?????A??A?A???A?AAA?HBDDFHBJGLO\\EDO\\@F@NARE`@Hj@BJ@H@NHb@FRCHCFEHGFMVG@@LJp@BLBNFRLj@DLFNJh@@F\\HF?BHEHGFS^GHMTYf@CBUNID?ZGH?BILKJCBSLWPCBMPCBU\\_@TKJCBABMNCDOPC@WRKFA@EHOTYJE@CBa@XCBSRMZABQREBKB?DABAFe@HKJCBIJWLCBKXA@ABGDEBe@TC@KFKD?LADIDA@EFOPADEBIHSJMFE@A?EFGNADID[R[@E@C?Mv@CB[BE@QHWTCBGFSNCBC@KLIFADCFIFGDGBK@GFCHQHCBABEPIBCLMBWLA@]Pg@HAN?@EDA?KJGP@BCDEJc@LC@GDCBC?KLCBGLCRw@XGHCBE@IDUTC?IHA@AJABCDA?ELCFSHEDC?C@UFGBEBKHEJEDMJGDE@ONa@?DVEFEBC@GDC@?@KJQNKHEDGFMDEFIDMHEDMB',
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0
        },
        gpsModified: false,
        initialGpx: null,
        isCorrectGpx: false
      });

      context = { userId };
      console.log('context', context);
    });

    /*
     *
     * Method : activity.delete : Vous devez être loggué.
     *
     */
    it('getPolylineCorrectGpsActivityGpxById : Vous devez être loggué.', function () {
      //  expect(function () {
      getPolylineCorrectGpsActivityGpxById.call(
        {
          id: new Mongo.ObjectID(),
          minPts: 1
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Activities.methods.getPolylineCorrectGpsActivityGpxById.notloggued'
          );
        }
      );
      /* }).to.throw(
        'Vous devez être loggué. [Activities.methods.getPolylineCorrectGpsActivityGpxById.notloggued]'
      ); */
    });

    it('getPolylineCorrectGpsActivityGpxById : return polyline', async function () {
      console.log('idActivityGPX', idActivityGPX);
      let result = await getPolylineCorrectGpsActivityGpxById._execute(
        context,
        {
          id: idActivityGPX,
          minPts: 1
        }
      );

      assert.strictEqual(
        result,
        'o`ikHo{wNFHFPDJLPDJFHFJDJDJHHFDHD?NMWe@y@[g@[m@[s@[q@Ym@]i@Yg@_@e@Ui@Sc@Ue@Wk@Wg@Yi@Yi@U_@MUMUQ[U_@U_@U_@Wc@We@Ua@OUQM]Q??a@Mg@Ye@a@c@[_@YYUUMQKQKQKQIEc@J_@Ng@Nm@Pq@Pu@Ly@E}@KgA{@aSEiAEaAGs@Bu@Za@\\e@\\i@V]PQNK@[Q[Wc@So@Qg@Uo@K[NUDMBQKEIMGKIUKSDFBNLVF\\GHCVDZH^Pf@Rj@Ph@Rf@Rl@CXUV[\\]^Y^Y^QNA`@Fj@Dv@D|@F~@Fz@Dx@Dx@D~@F~@D|@Bl@Bn@Bj@Bt@Dv@Dr@Fp@@n@Ef@K\\IVKXKVK^Md@Mf@Kr@P\\XTZTVRPPNJ??HBFDFJDHBMAOGGGAGGLZTP^T^R\\TXPNLPJZH`@TZd@Zj@Xh@Zj@Xl@Xj@Xj@Vj@Xh@T`@JTP\\NTBJLPPXR\\Td@Vd@Tj@Vj@T`@R`@NNFL?LEJ?Q@OEPEL?NAOFEBKCLEJELEHFSDKFIIVDIAMFG@Gf@^a@Ib@ILEQDIEICKEGECLAN'
      );
    });
  });
}
