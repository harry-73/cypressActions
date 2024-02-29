import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';
import {
  getMarkerType,
  getSettings,
  pushFcmToken,
  pushVersions,
  setSettings
} from '../../imports/api/methods/Connect';
import markerType from '../../imports/api/collections/markerType';
import log from 'loglevel';

if (Meteor.isServer) {
  describe('Connect', async function () {
    let userId = Random.id();
    await Meteor.users.insertAsync({ _id: userId }, (error, resul) => {
      if (error) log.info('ERROR ', error);
    });
    beforeEach(() => {});

    /*
     *
     * Method : utils.pushversions : Vous devez être loggué.
     *
     */
    it('utils.pushversions : Vous devez être loggué.', function () {
      // expect(function () {
      pushVersions.call(
        {
          webVersion: '2',
          mobileVersion: '4',
          viewPortWidth: 4
        },
        (err) => {
          expect(err.error).to.equal('Utils.methods.pushVersions.notloggued');
        }
      );
      /*   }).to.throw(
        'Vous devez être loggué. [Utils.methods.pushVersions.notloggued]'
      ); */
    });

    /*
     *
     * Method : utils.pushversions : Envoi versions
     *
     */
    it('utils.pushversions : Envoi versions', async function () {
      //	let userId = Random.id();
      const context = { userId };
      await pushVersions._execute(context, {
        webVersion: '2',
        mobileVersion: '4',
        viewPortWidth: 4
      });

      const result = await Meteor.users.findOneAsync({ _id: userId });

      expect(result.versions[result.versions.length - 1].webVersion).to.equal(
        '2'
      );
      expect(
        result.versions[result.versions.length - 1].mobileVersion
      ).to.equal('4');
      expect(
        result.versions[result.versions.length - 1].viewPortWidth
      ).to.equal(4);
    });

    /*
     *
     * Method : utils.pushFcmToken : Vous devez être loggué.
     *
     */
    it('utils.pushFcmToken : Vous devez être loggué.', function () {
      // expect(function () {
      pushFcmToken.call({ token: 'ddddddd' }, (err) => {
        expect(err.error).to.equal('Utils.methods.pushFcmToken.notloggued');

        /*  }).to.throw(
        'Vous devez être loggué. [Utils.methods.pushFcmToken.notloggued]'
      ); */
      });
    });

    /*
     *
     * Method : utils.pushFcmToken : Envoi token
     *
     */
    it('utils.pushFcmToken : Envoi token', async function () {
      //	let userId = Random.id();
      const context = { userId };
      await pushFcmToken._execute(context, {
        token: 'tttt'
      });

      const result = Meteor.users.findOne({ _id: userId });

      expect(result.fcmToken.token).to.equal('tttt');
    });

    /*
     *
     * Method : utils.setSettings : Vous devez être loggué.
     *
     */
    it('utils.setSettings : Vous devez être loggué.', function () {
      //  expect(function () {
      setSettings.call(
        {
          settings: {
            language: 'fr',
            displayOnBoarding: true,
            displayModals: {
              warningOffline: false
            },
            visibleMarkersOnMap: [
              { id: 0, visible: true },
              { id: 1, visible: true },
              { id: 2, visible: true },
              { id: 3, visible: true },
              { id: 4, visible: true },
              { id: 5, visible: true }
            ],
            mapFilter: {
              activityFilterOnMap: true,
              distanceMax: 100,
              distanceMin: 0
            },
            activitiesListFilter: {
              isMapVisible: true,
              isPhotosVisible: true,
              isDetailsVisible: true,
              distanceMax: 100,
              distanceMin: 0,
              activityTypeNotSelected: ['Balade']
            },
            activitiesAnimalsListFilter: {
              isMapVisible: true,
              isPhotosVisible: true,
              isDetailsVisible: true,
              distanceMax: 100,
              distanceMin: 0,
              activityTypeNotSelected: []
            }
          }
        },
        (err) => {
          expect(err.error).to.equal('Utils.methods.setSettings.notloggued');
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [Utils.methods.setSettings.notloggued]'
      ); */
    });

    /*
     *
     * Method : utils.setSettings : Set paramètres
     *
     */
    it('utils.setSettings : Set paramètres', async function () {
      //	let userId = Random.id();
      const context = { userId };
      await setSettings._execute(context, {
        settings: {
          language: 'fr',
          displayOnBoarding: true,
          displayModals: {
            warningOffline: false
          },
          visibleMarkersOnMap: [
            { id: 0, visible: true },
            { id: 1, visible: true },
            { id: 2, visible: true },
            { id: 3, visible: true },
            { id: 4, visible: true },
            { id: 5, visible: true }
          ],
          mapFilter: {
            activityFilterOnMap: true,
            distanceMax: 100,
            distanceMin: 0
          },
          activitiesListFilter: {
            isMapVisible: true,
            isPhotosVisible: true,
            isDetailsVisible: true,
            distanceMax: 100,
            distanceMin: 0,
            activityTypeNotSelected: ['Balade']
          },
          activitiesAnimalsListFilter: {
            isMapVisible: true,
            isPhotosVisible: true,
            isDetailsVisible: true,
            distanceMax: 100,
            distanceMin: 0,
            activityTypeNotSelected: []
          }
        }
      });
      expect(
        (await Meteor.users.findOneAsync({ _id: userId })).settings
          .displayModals.warningOffline
      ).to.equal(false);
    });

    /*
     *
     * Method : utils.getSettings : Vous devez être loggué.
     *
     */
    it('utils.getSettings : Vous devez être loggué.', function () {
      getSettings.call({}, (error, result) => {
        expect(result.length).to.equal(0);
      });
    });

    /*
     *
     * Method : utils.getSettings : Get paramètres
     *
     */
    it('utils.getSettings : Get paramètres', function () {
      //	let userId = Random.id();
      const context = { userId };
      getSettings._execute(context, {}, (error, result) => {
        expect(result.settings.displayModals.warningOffline).to.equal(false);
      });
    });
  });

  describe('getMarkerType', function () {
    let userId = Random.id();
    const context = { userId };

    /*
     *
     * Method : utils.getMarkerType : Vous devez être loggué.
     *
     */

    it('utils.getMarkerType : Vous devez être loggué.', function () {
      getMarkerType.call({}, (error, result) => {
        expect(result.length).to.equal(0);
      });
    });

    /*
     *
     * Method : utils.getMarkerType : Get marker type
     *
     */
    it('utils.getMarkerType : Get marker type', async function () {
     await markerType.insertAsync({
        markerType: [
          {
            text: 'Sac à crottes',
            icon: '/pets.png',
            value: 0.0,
            hasChildren: false
          },
          {
            text: 'Point de vue',
            icon: '/photography.png',
            value: 1.0,
            hasChildren: false
          },
          {
            text: 'Poubelle',
            icon: '/tours.png',
            value: 2.0,
            hasChildren: false
          },
          {
            text: "Point d'eau",
            icon: '/default.png',
            value: 3.0,
            hasChildren: false
          },
          {
            text: 'Point de baignade',
            icon: '/swimming-pools.png',
            value: 4.0,
            hasChildren: false
          },
          {
            text: "Poteau d'orientation",
            icon: '/orientation.png',
            value: 5.0,
            hasChildren: false
          }
        ]
      });
      getMarkerType._execute(context, {}, (error, result) => {
        expect(result.markerType[0].icon).to.equal('/pets.png');
        expect(result.markerType[2].text).to.equal('Poubelle');
      });
    });
  });
}
