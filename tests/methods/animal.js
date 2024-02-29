import assert from 'assert';
import Pets from '../../imports/api/collections/Pets';
import PetsActivities from '../../imports/api/collections/PetsActivities';
import { expect } from 'chai';
import '../../imports/api/methods/Animal';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import {
  animalactivitycreate,
  animalactivitycreatefromgps,
  animalactivitymodifiy,
  animaladdavatar,
  animaladdimage,
  animalcreate,
  animalmodify,
  likeAnimalActivity,
  searchAnimal,
  unLikeAnimalActivity,
  getMyOverallAnimals,
  getAnimalActivitiesPerPage
} from '../../imports/api/methods/Animal';

import log from 'loglevel';
import moment from 'moment';

if (Meteor.isServer) {
  describe('Animal', () => {
    describe('methods', async () => {
      const userId = Random.id();
      await Meteor.users.insertAsync({ _id: userId }, (error, resul) => {
        if (error) log.info('ERROR ', error);
      });
      const context = { userId };
      let idPet;
      let idPetActivity;

      await Pets.removeAsync({});

      beforeEach(() => {
        /* Id = Pets.insert({
					Owner: userId,
					Name: "Phantom",
					Type: "Chien",
					isShare: true,
					Birthday: "12/12/2020",
					Weight: 20,
					Height: 20,
				}); */
      });
      /*
       *
       * Method : animalcreate : Vous devez être loggué.
       *
       */
      it('animalcreate : Vous devez être loggué.', () => {
        expect(function () {
          animalcreate.call({
            Name: 'Phantom',
            Type: 'Chien',
            isShare: true,
            Birthday: '2010-12-04',
            Weight: 15.5,
            Height: 60
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animalcreate.notloggued]'
        );
      });

      it('animalcreate : peut créer un animal', async () => {
        idPet = animalcreate._execute(context, {
          Name: 'Phantom',
          Type: 'Chien',
          isShare: true,
          Birthday: '2010-12-04',
          Weight: 15.5,
          Height: 60
        });

        let result = await Pets.findOneAsync({ _id: idPet });

        assert.strictEqual(result.Name, 'Phantom');
        assert.strictEqual(result.Type, 'Chien');
        assert.strictEqual(result.isShare, true);
        assert.strictEqual(result.Birthday, '2010-12-04');
        assert.strictEqual(result.Weight, 15.5);
        assert.strictEqual(result.Height, 60);
      });

      /**
       *
       * Method: animal.modify
       *
       */

      it('animalmodify : Vous devez être loggué.', () => {
        expect(function () {
          animalmodify.call({
            id: idPet,
            Name: 'Phantom',
            Type: 'Chien',
            isShare: true,
            Birthday: '2010-12-04',
            Weight: 15.5,
            Height: 60
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animalmodify.notloggued]'
        );
      });

      it("animalmodify : Vous n'êtes pas le propriétiare", () => {
        expect(function () {
          animalmodify._execute(
            { userId: Random.id() },
            {
              id: idPet,
              Name: 'Phantom',
              Type: 'Chien',
              isShare: true,
              Birthday: '2010-12-04',
              Weight: 15.5,
              Height: 60
            }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.animalmodify.unauthorized]"
        );
      });

      it('animalmodify : peut modifier un animal', async () => {
        animalmodify._execute(context, {
          id: idPet,
          Name: 'Medoc',
          Type: 'Cheval',
          isShare: false,
          Birthday: '2010-11-04',
          Weight: 10.5,
          Height: 90,
          images: []
        });

        let result = await Pets.findOneAsync({ _id: idPet });

        assert.strictEqual(result.Name, 'Medoc');
        assert.strictEqual(result.Type, 'Cheval');
        assert.strictEqual(result.isShare, false);
        assert.strictEqual(result.Birthday, '2010-11-04');
        assert.strictEqual(result.Weight, 10.5);
        assert.strictEqual(result.Height, 90);

        // Faire les images
      });

      /**
       *
       * Method: animal.activitycreate
       *
       */

      it('animalactivitycreate : Vous devez être loggué.', () => {
        expect(function () {
          animalactivitycreate.call({
            Id: idPet,
            time: '01:10',
            name: 'Essai',
            description: 'Description',
            dateActivity: '2020-03-01T08:10:00+01:00',
            type: 'Cani-cross',
            distance: 10,
            Notes: 'Notes'
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animalactivitycreate.notloggued]'
        );
      });

      it('animal.activitycreate : peut créer activité animal', async () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        let result = await PetsActivities.findOneAsync({ _id: idPetActivity });
        assert.strictEqual(result.IDActivity, '-1');
        assert.strictEqual(result.description, 'Description');
        assert.strictEqual(result.ActivityName, 'Essai');
        assert.strictEqual(result.AnimalName, 'Medoc');
        //	assert.strictEqual(result.AnimalOwner, userId);
        assert.strictEqual(result.ActivityType, 'Cani-cross');
        assert.strictEqual(
          moment(result.DateAct).utc().format(),
          '2020-03-01T07:10:00Z'
        );
        assert.strictEqual(result.TimeFCtotal, 4200);
        assert.strictEqual(result.Distance, 10);
        assert.strictEqual(result.Notes, 'Notes');
        assert.strictEqual(result.Id_GPX, null);
      });

      /**
       *
       * Method: animal.getAnimalActivitiesPerPage
       *
       */

      it('animal.getAnimalActivitiesPerPage : Vous devez être loggué.', () => {
        expect(function () {
          getAnimalActivitiesPerPage.call({ page: 1 });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.getanimalactivitiesperpage.notloggued]'
        );
      });

      it('animal.getAnimalActivitiesPerPage : peut retirer la liste', () => {
        for (let i = 0; i < 9; i++) {
          idPetActivity = animalactivitycreate._execute(context, {
            Id: idPet,
            time: '01:10',
            name: 'Essai',
            description: 'Description',
            dateActivity: '2020-03-01T08:10:00+01:00',
            type: 'Cani-cross',
            distance: 10,
            Notes: 'Notes'
          });
        }
        animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai1',
          description: 'Description1',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes1'
        });
        let idPet1 = animalcreate._execute(context, {
          Name: 'Phantom',
          Type: 'Chien',
          isShare: true,
          Birthday: '2010-12-04',
          Weight: 15.5,
          Height: 60
        });

        Pets.update(
          { _id: idPet1 },
          {
            $push: {
              Shared: {
                _id: userId
              }
            }
          }
        );
        animalactivitycreate._execute(context, {
          Id: idPet1,
          time: '01:12',
          name: 'Essai2',
          description: 'Description2',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes2'
        });

        let result = getAnimalActivitiesPerPage._execute(context, { page: 2 });

        assert.strictEqual(result.length, 2);
        assert.strictEqual(result[0].description, 'Description1');
        assert.strictEqual(result[0].ActivityName, 'Essai1');
        assert.strictEqual(result[0].AnimalName, 'Medoc');
        //	assert.strictEqual(result.AnimalOwner, userId);
        assert.strictEqual(result[0].ActivityType, 'Cani-cross');
        assert.strictEqual(
          moment(result[0].DateAct).utc().format(),
          '2020-03-01T07:10:00Z'
        );
        assert.strictEqual(result[0].TimeFCtotal, 4200);
        assert.strictEqual(result[0].Distance, 10);
        assert.strictEqual(result[0].Notes, 'Notes1');
        assert.strictEqual(result[0].Id_GPX, null);
      });

      /**
       *
       * Method: animal.likeactivity
       *
       */

      it('animal.likeactivity : Vous devez être loggué.', () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          likeAnimalActivity.call({ idActivity: idPetActivity });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.likeAnimalActivity.notloggued]'
        );
      });

      it("animal.likeactivity : Vous n'êtes pas le propriétiare", () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          likeAnimalActivity._execute(
            { userId: Random.id() },
            { idActivity: idPetActivity }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.likeAnimalActivity.unauthorized]"
        );
      });

      it('animal.likeactivity : Vous êtes le propriétaire', () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          likeAnimalActivity._execute(context, { idActivity: idPetActivity });
        }).to.throw(
          'Vous êtes le propriétaire [Animals.methods.likeAnimalActivity.unauthorized]'
        );
      });

      it('animal.likeactivity : peut aimer une activité animale', async () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });
        const otherUserId = Random.id();
        await Pets.updateAsync(
          { _id: idPet },
          {
            $push: {
              Shared: {
                _id: otherUserId,
                weightTrackingRight: ''
              }
            }
          }
        );

        likeAnimalActivity._execute(
          { userId: otherUserId },
          { idActivity: idPetActivity }
        );

        expect(PetsActivities.findOne({ _id: idPetActivity }).like).to.equal(1);
        expect(
          PetsActivities.findOne({ _id: idPetActivity }).likeMember[0]
        ).to.equal(otherUserId);
      });

      /**
       *
       * Method: animal.unlikeactivity
       *
       */

      it('animal.likeactivity : Vous devez être loggué.', () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          unLikeAnimalActivity.call({ idActivity: idPetActivity });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.unLikeAnimalActivity.notloggued]'
        );
      });

      it("animal.unLikeAnimalActivity : Vous n'êtes pas le propriétiare", () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          unLikeAnimalActivity._execute(
            { userId: Random.id() },
            { idActivity: idPetActivity }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.unLikeAnimalActivity.unauthorized]"
        );
      });

      it('animal.unLikeAnimalActivity : Vous êtes le propriétaire', () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });

        expect(function () {
          unLikeAnimalActivity._execute(context, { idActivity: idPetActivity });
        }).to.throw(
          'Vous êtes le propriétaire [Animals.methods.unLikeAnimalActivity.unauthorized]'
        );
      });

      it('animal.unLikeAnimalActivity : ne plus aimer une activité animale', async () => {
        idPetActivity = animalactivitycreate._execute(context, {
          Id: idPet,
          time: '01:10',
          name: 'Essai',
          description: 'Description',
          dateActivity: '2020-03-01T08:10:00+01:00',
          type: 'Cani-cross',
          distance: 10,
          Notes: 'Notes'
        });
        const otherUserId = Random.id();
        await Pets.updateAsync(
          { _id: idPet },
          {
            $push: {
              Shared: {
                _id: otherUserId,
                weightTrackingRight: ''
              }
            }
          }
        );

        likeAnimalActivity._execute(
          { userId: otherUserId },
          { idActivity: idPetActivity }
        );

        unLikeAnimalActivity._execute(
          { userId: otherUserId },
          { idActivity: idPetActivity }
        );

        expect(PetsActivities.findOne({ _id: idPetActivity }).like).to.equal(0);
        expect(
          PetsActivities.findOne({ _id: idPetActivity }).likeMember.length
        ).to.equal(0);
      });

      /**
       *
       * Method: animalactivitycreatefromgps
       *
       */

      it('animalactivitycreatefromgps : Vous devez être loggué.', () => {
        expect(function () {
          animalactivitycreatefromgps.call({
            Id: idPet,
            time: '01:10',
            name: 'Essai',
            description: 'Description',
            dateActivity: '2020-03-01T08:10:00+01:00',
            type: 'Cani-cross',
            distance: 10,
            Notes: 'Notes',
            geojson: [
              {
                type: 'dd',
                properties: {
                  time: ' zzzz',
                  coordinateProperties: { times: ['AA'], heart: [1, 2] }
                },
                geometry: {
                  type: 'Line',
                  coordinates: [
                    [3, 5],
                    [6, 8]
                  ]
                }
              }
            ]
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animalactivitycreatefromgps.notloggued]'
        );
      });

      /**
       *
       * Method: animalactivitymodify
       *
       */

      it('animalactivitymodify : Vous devez être loggué.', () => {
        expect(function () {
          animalactivitymodifiy.call({
            Id: idPetActivity,
            IDAnimal: idPet,
            time: '02:20',
            name: 'Essai Bis',
            description: 'Description Bis',
            dateActivity: '2021-05-01T10:08:00+01:00',
            type: 'Course à pied',
            distance: 32.1,
            Notes: 'Notes Bis'
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animalactivitymodifiy.notloggued]'
        );
      });

      it("animalactivitymodify : Vous n'êtes pas le propriétiare", () => {
        expect(function () {
          animalactivitymodifiy._execute(
            { userId: Random.id() },
            {
              Id: idPetActivity,
              IDAnimal: idPet,
              time: '02:20',
              name: 'Essai Bis',
              description: 'Description Bis',
              dateActivity: '2021-05-01T10:08:00+01:00',
              type: 'Course à pied',
              distance: 32.1,
              Notes: 'Notes Bis'
            }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.animalactivitymodifiy.unauthorized]"
        );
      });

      it('animalactivitymodify : peut modifier une activité animal sans images', async () => {
        animalactivitymodifiy._execute(context, {
          Id: idPetActivity,
          IDAnimal: idPet,
          time: '02:20',
          name: 'Essai Bis',
          description: 'Description Bis',
          dateActivity: '2021-05-01T10:08:00+01:00',
          type: 'Course à pied',
          distance: 32.1,
          Notes: 'Notes Bis'
        });

        let result = await PetsActivities.findOneAsync({ _id: idPetActivity });

        assert.strictEqual(result.IDAnimal._str, idPet._str);
        assert.strictEqual(result.description, 'Description Bis');
        assert.strictEqual(result.ActivityName, 'Essai Bis');
        assert.strictEqual(result.ActivityType, 'Course à pied');
        assert.strictEqual(
          moment(result.DateAct).utc().format(),
          '2021-05-01T09:08:00Z'
        );
        assert.strictEqual(result.TimeFCtotal, 8400);
        assert.strictEqual(result.Distance, 32.1);
        assert.strictEqual(result.Notes, 'Notes Bis');

        animalactivitymodifiy._execute(context, {
          Id: idPetActivity,
          IDAnimal: idPet,
          time: '02:20:02',
          name: 'Essai Bis',
          description: 'Description Bis',
          dateActivity: '2021-05-01T10:08:00+01:00',
          type: 'Course à pied',
          distance: 32.1,
          Notes: 'Notes Bis'
        });
        result = await PetsActivities.findOneAsync({ _id: idPetActivity });
        assert.strictEqual(result.TimeFCtotal, 8402);
      });

      // Faire modification avec images

      /*
       *
       * Method : animal.addimage
       *
       */

      it('animaladdimage : Vous devez être loggué.', () => {
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

        let id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        expect(function () {
          animaladdimage.call({
            idAnimal: id,
            file: file
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animaladdimage.notloggued]'
        );
      });

      it("animaladdimage : Vous n'êtes pas le propriétiare", () => {
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

        const id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        log.info('---- ID ----- : ', id);

        expect(function () {
          animaladdimage._execute(
            { userId: Random.id() },
            {
              idAnimal: id,
              file: file
            }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.animaladdimage.unauthorized]"
        );
      });
      it('animaladdimage : peut ajouter une image à un animal', async () => {
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

        let id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        animaladdimage._execute(context, {
          idAnimal: id,
          file: file
        });

        assert.strictEqual(
          await Pets.find({ 'images.asset_id': '123' }).countAsync(),
          1
        );
      });

      /*
       *
       * Method : animaladdavatar
       *
       */

      it('animaladdavatar : Vous devez être loggué.', () => {
        const avatar = {
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

        let id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        expect(function () {
          animaladdavatar.call({
            idAnimal: id,
            avatar: avatar
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.animaladdavatar.notloggued]'
        );
      });

      it("animaladdavatar : Vous n'êtes pas le propriétiare", () => {
        const avatar = {
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

        const id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        expect(function () {
          animaladdavatar._execute(
            { userId: Random.id() },
            {
              idAnimal: id,
              avatar: avatar
            }
          );
        }).to.throw(
          "Vous n'êtes pas le propriétiare [Animals.methods.animaladdavatar.unauthorized]"
        );
      });
      it('animaladdavatar : peut ajouter une image à un animal', async () => {
        const avatar = {
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

        let id = animalcreate._execute(context, {
          Name: 'Essai',
          Type: 'Cheval',
          isShare: true,
          Birthday: '2020-02-02',
          Weight: 9,
          Height: 10
        });

        animaladdavatar._execute(context, {
          idAnimal: id,
          avatar: avatar
        });

        assert.strictEqual(
          await Pets.find({ 'avatar.asset_id': '123' }).countAsync(),
          1
        );
      });

      /*
       *
       * Method : searchAnimal
       *
       */

      it('searchAnimal : Vous devez être loggué.', () => {
        expect(function () {
          searchAnimal.call({
            pattern: 'E'
          });
        }).to.throw(
          'Vous devez être loggué. [Animals.methods.searchAnimal.notloggued]'
        );
      });

      it('searchAnimal : Recherche', async function () {
        let id = animalcreate._execute(
          { userId: Random.id() },
          {
            Name: 'Essai',
            Type: 'Cheval',
            isShare: true,
            Birthday: '2020-02-02',
            Weight: 9,
            Height: 10
          }
        );

        let result = await searchAnimal._execute(context, {
          pattern: 'E'
        });

        assert.strictEqual(result.length, 1);
      });

      /*
       *
       * Method : getMyOverallAnimals
       *
       */

      it('getMyOverallAnimals : Vous devez être loggué.', () => {
        expect(function () {
          getMyOverallAnimals
            .call({ format: 'select' })
            .to.throw(
              'Vous devez être loggué. [Animals.methods.getMyOverallAnimals.notloggued]'
            );
        });
      });

      it('getMyOverallAnimals : Number of Animals', async function () {
        let id = animalcreate._execute(
          { userId: Random.id() },
          {
            Name: 'Essai',
            Type: 'Cheval',
            isShare: true,
            Birthday: '2020-02-02',
            Weight: 9,
            Height: 10
          }
        );

        let result = await getMyOverallAnimals._execute(context, {
          format: 'select'
        });

        assert.equal(result[6].text, 'Medoc');
        assert.strictEqual(result.length, 8);
      });
    });
  });
}
