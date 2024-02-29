import assert from 'assert';
import { expect } from 'chai';
import Pets from '../../imports/api/collections/Pets';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import log from 'loglevel';

if (Meteor.isClient) {
  log.info('IMPORT TESTS2');
  import store from '../../imports/plugins/store';
  import { createLocalVue, mount } from '@vue/test-utils';
  //import { BootstrapVue } from 'bootstrap-vue';
  import VueRouter from 'vue-router';
  import Vuex from 'vuex';
  import VueI18n from 'vue-i18n';

  //import Vuelidate from 'vuelidate';

  import VPets from '../../imports/ui/views/PetsTop.vue';

  const VlocalVue = createLocalVue();
  //	log.info("IMPORT TESTS3");
  // VlocalVue.use(Vuelidate);
  VlocalVue.use(VueI18n);
  //	log.info("IMPORT TESTS4");
  //VlocalVue.use(BootstrapVue);
  //	log.info("IMPORT TESTS1");

  const i18n = new VueI18n();
  VlocalVue.use(VueRouter);
  VlocalVue.use(Vuex);

  VlocalVue.component('VPets', VPets);

  describe('Composant Vuex: ', function () {
    it('setIsGalleryOpen', async function () {
      store.commit('setIsGalleryOpen', true);
      expect(store.state.isGalleryOpen).to.equal(true);
      store.commit('setIsGalleryOpen', false);
      expect(store.state.isGalleryOpen).to.equal(false);
    });

    it('setvActivityFilterOnMap', async function () {
      store.commit('setvActivityFilterOnMap', true);
      expect(store.state.settings.mapFilter.activityFilterOnMap).to.equal(true);
      store.commit('setvActivityFilterOnMap', false);
      expect(store.state.settings.mapFilter.activityFilterOnMap).to.equal(
        false
      );
    });

    it('setActivityType', async function () {
      store.commit('setActivityType', [
        'Balade',
        'Cani-cross',
        'Cani-VTT',
        'Course à pied',
        'Equitation - Dressage',
        'Equitation - Balade',
        'Vélo',
        'Randonnée'
      ]);
      expect(store.state.activityType.length).to.equal(8);
      expect(store.state.activityType[0]).to.equal('Balade');
      expect(store.state.activityType[6]).to.equal('Vélo');
    });

    it('setApplicationState', async function () {
      store.commit('setApplicationState', 'map');
      expect(store.state.applicationState['map']).to.equal(true);
      expect(store.state.applicationState['traces']).to.equal(false);
      store.commit('setApplicationState', 'traces');
      expect(store.state.applicationState['map']).to.equal(false);
      expect(store.state.applicationState['stats']).to.equal(false);
      expect(store.state.applicationState['traces']).to.equal(true);
    });

    it('setMapVisible', async function () {
      store.commit('setMapVisible', true);
      expect(store.state.settings.activitiesListFilter.isMapVisible).to.equal(
        true
      );
      store.commit('setMapVisible', false);
      expect(store.state.settings.activitiesListFilter.isMapVisible).to.equal(
        false
      );
    });

    it('setPhotosVisible', async function () {
      store.commit('setPhotosVisible', true);
      expect(
        store.state.settings.activitiesListFilter.isPhotosVisible
      ).to.equal(true);
      store.commit('setPhotosVisible', false);
      expect(
        store.state.settings.activitiesListFilter.isPhotosVisible
      ).to.equal(false);
    });

    it('setDetailsVisible', async function () {
      store.commit('setDetailsVisible', true);
      expect(
        store.state.settings.activitiesListFilter.isDetailsVisible
      ).to.equal(true);
      store.commit('setDetailsVisible', false);
      expect(
        store.state.settings.activitiesListFilter.isDetailsVisible
      ).to.equal(false);
    });

    it('setDistanceMax', async function () {
      store.commit('setDistanceMax', 100);
      expect(store.state.settings.activitiesListFilter.distanceMax).to.equal(
        100
      );
      store.commit('setDistanceMax', 50);
      expect(store.state.settings.activitiesListFilter.distanceMax).to.equal(
        50
      );
    });

    it('setDistanceMin', async function () {
      store.commit('setDistanceMin', 100);
      expect(store.state.settings.activitiesListFilter.distanceMin).to.equal(
        100
      );
      store.commit('setDistanceMin', 50);
      expect(store.state.settings.activitiesListFilter.distanceMin).to.equal(
        50
      );
    });

    it('setBackButton', async function () {
      store.commit('setBackButton');
      expect(store.state.backButton).to.equal(true);
    });

    it('unsetBackButton', async function () {
      store.commit('unsetBackButton');
      expect(store.state.backButton).to.equal(false);
    });

    it('DisableBottomBar', async function () {
      store.commit('DisableBottomBar');
      expect(store.state.StateBottomBar).to.equal(false);
    });

    it('EnableBottomBar', async function () {
      store.commit('EnableBottomBar');
      expect(store.state.StateBottomBar).to.equal(true);
    });

    it('EnableTopLeftButton', async function () {
      store.commit('EnableTopLeftButton');
      expect(store.state.StateTopLeftButton).to.equal(true);
    });

    it('DisableTopLeftButton', async function () {
      store.commit('DisableTopLeftButton');
      expect(store.state.StateTopLeftButton).to.equal(false);
    });

    it('pushTopFeltButtomFrom', async function () {
      store.commit('pushTopFeltButtomFrom', {
        from: 'AnimalDetailCard',
        displaydetailcard: true,
        animalid: '12a22'
      });
      expect(store.state.TopFeltButtomFrom[0].from).to.equal(
        'AnimalDetailCard'
      );
      expect(store.state.TopFeltButtomFrom[0].displaydetailcard).to.equal(true);
      expect(store.state.TopFeltButtomFrom[0].animalid).to.equal('12a22');

      store.commit('pushTopFeltButtomFrom', {
        from: 'AnimalCard',
        displaydetailcard: false,
        animalid: '122'
      });
      expect(store.state.TopFeltButtomFrom.length).to.equal(2);
      expect(store.state.TopFeltButtomFrom[1].displaydetailcard).to.equal(
        false
      );
    });

    it('popTopFeltButtomFrom', async function () {
      store.commit('popTopFeltButtomFrom');
      expect(store.state.TopFeltButtomFrom.length).to.equal(1);
      expect(store.state.TopFeltButtomFrom[0].from).to.equal(
        'AnimalDetailCard'
      );
      expect(store.state.TopFeltButtomFrom[0].displaydetailcard).to.equal(true);
      expect(store.state.TopFeltButtomFrom[0].animalid).to.equal('12a22');
    });

    it('SetPreviousRoute', async function () {
      store.commit('SetPreviousRoute', '/route');
      expect(store.state.PreviousRoute).to.equal('/route');
    });

    it('SetBack2Route', async function () {
      store.commit('SetBack2Route', '/route');
      expect(store.state.Back2Route).to.equal('/route');
    });

    it('SetTopRightButtonLabel', async function () {
      store.commit('SetTopRightButtonLabel', 'Modify');
      expect(store.state.TopRightButtonLabel).to.equal('Modify');
    });

    it('SetTopRightButtonState', async function () {
      store.commit('SetTopRightButtonState', true);
      expect(store.state.TopRightButtonState).to.equal(true);
      store.commit('SetTopRightButtonState', false);
      expect(store.state.TopRightButtonState).to.equal(false);
    });

    it('SetFileUpLoad', async function () {
      store.commit('SetFileUpLoad', 'file.png');
      expect(store.state.FileUpLoad).to.equal('file.png');
    });

    it('SetMarkersTmp', async function () {
      store.commit('SetMarkersTmp', [{ essai: 'eeee' }, { toto: 'zzzz' }]);
      expect(store.state.MarkersTmp[0].essai).to.equal('eeee');
      expect(store.state.MarkersTmp[1].toto).to.equal('zzzz');
    });

    it('enableTraceRecorded', async function () {
      store.commit('enableTraceRecorded');
      expect(store.state.isTraceRecorded).to.equal(true);
    });

    it('disableTraceRecorded', async function () {
      store.commit('disableTraceRecorded');
      expect(store.state.isTraceRecorded).to.equal(false);
    });

    it('setPauseTraceRecorded', async function () {
      store.commit('setPauseTraceRecorded');
      expect(store.state.isPauseTraceRecorded).to.equal(true);
    });

    it('unsetPauseTraceRecorded', async function () {
      store.commit('unsetPauseTraceRecorded');
      expect(store.state.isPauseTraceRecorded).to.equal(false);
    });

    it('updateTimerRecord', async function () {
      expect(store.state.timerRecord).to.equal(0);
      store.commit('updateTimerRecord');
      expect(store.state.timerRecord).to.equal(1);
    });

    // Cache Activité Humaine
    it('incrActivitiesPageNumber', async function () {
      expect(store.state.activities.pageNumber).to.equal(0);
      store.commit('incrActivitiesPageNumber');
      expect(store.state.activities.pageNumber).to.equal(1);
    });

    it('updateActivitiesCurrentCount', async function () {
      store.commit('updateActivitiesCurrentCount');
      expect(store.state.activities.activitiesCurrentCount).to.equal(5);
    });

    it('setActivitiesTotalCount', async function () {
      store.commit('setActivitiesTotalCount', 35);
      expect(store.state.activities.activitiesTotalCount).to.equal(35);
    });

    it('setActivitiesList', async function () {
      store.commit('setActivitiesList', [
        { Name: 'name', description: 'description' }
      ]);
      expect(store.state.activities.activitiesList[0].Name).to.equal('name');
      expect(store.state.activities.activitiesList[0].description).to.equal(
        'description'
      );
    });

    it('updateCacheHumanActivity', async function () {
      store.commit('updateCacheHumanActivity', {
        activity: {
          name: 'name1',
          description: 'description1',
          type: 'Course',
          time: '01:00:00',
          distance: 25
        },
        index: 0
      });
      expect(store.state.activities.activitiesList[0].Name).to.equal('name1');
      expect(store.state.activities.activitiesList[0].description).to.equal(
        'description1'
      );
      expect(store.state.activities.activitiesList[0].Type).to.equal('Course');
      expect(store.state.activities.activitiesList[0].TimeFCtotal).to.equal(
        '3600'
      );
      expect(store.state.activities.activitiesList[0].Distance).to.equal(25);
    });

    it('resetOptionsCacheActivities', async function () {
      store.commit('resetOptionsCacheActivities');
      expect(store.state.activities.pageNumber).to.equal(0);
      expect(store.state.activities.pageSize).to.equal(5);
      expect(store.state.activities.activitiesCurrentCount).to.equal(-1);
      expect(store.state.activities.activitiesTotalCount).to.equal(0);
    });

    // Cache Activité Animal
    it('incrActivitiesAnimalsPageNumber', async function () {
      expect(store.state.activitiesAnimals.pageNumber).to.equal(0);
      store.commit('incrActivitiesAnimalsPageNumber');
      expect(store.state.activitiesAnimals.pageNumber).to.equal(1);
    });

    it('updateActivitiesAnimalsCurrentCount', async function () {
      store.commit('updateActivitiesAnimalsCurrentCount');
      expect(store.state.activitiesAnimals.activitiesCurrentCount).to.equal(10);
    });

    it('setActivitiesAnimalsTotalCount', async function () {
      store.commit('setActivitiesAnimalsTotalCount', 35);
      expect(store.state.activitiesAnimals.activitiesTotalCount).to.equal(35);
    });

    it('setActivitiesAnimalsList', async function () {
      store.commit('setActivitiesAnimalsList', [
        { Name: 'name', description: 'description' }
      ]);
      expect(store.state.activitiesAnimals.activitiesList[0].Name).to.equal(
        'name'
      );
      expect(
        store.state.activitiesAnimals.activitiesList[0].description
      ).to.equal('description');
    });

    it('updateCacheAnimalActivity', async function () {
      store.commit('updateCacheAnimalActivity', {
        activity: {
          name: 'name1',
          description: 'description1',
          type: 'Course',
          IDAnimal: 'IDAnimal'
        },
        index: 0
      });
      expect(
        store.state.activitiesAnimals.activitiesList[0].ActivityName
      ).to.equal('name1');
      expect(
        store.state.activitiesAnimals.activitiesList[0].description
      ).to.equal('description1');
      expect(
        store.state.activitiesAnimals.activitiesList[0].ActivityType
      ).to.equal('Course');
      expect(store.state.activitiesAnimals.activitiesList[0].IDAnimal).to.equal(
        'IDAnimal'
      );
    });

    it('resetOptionsCacheActivitiesAnimals', async function () {
      store.commit('resetOptionsCacheActivitiesAnimals');
      expect(store.state.activitiesAnimals.pageNumber).to.equal(0);
      expect(store.state.activitiesAnimals.pageSize).to.equal(5);
      expect(store.state.activitiesAnimals.activitiesCurrentCount).to.equal(-1);
      expect(store.state.activitiesAnimals.activitiesTotalCount).to.equal(0);
    });

    it('setMobileVersion', async function () {
      store.commit('setMobileVersion', '3.4.6');
      expect(store.state.mobileVersion).to.equal('3.4.6');
    });
    it('setMapState', async function () {
      store.commit('setMapState', {
        firstTime: false,
        zoom: 4,
        center: [4, 6]
      });
      expect(store.state.mapState.firstTime).to.equal(false);
      expect(store.state.mapState.zoom).to.equal(4);
      expect(store.state.mapState.center[0]).to.equal(4);
      expect(store.state.mapState.center[1]).to.equal(6);
    });

    it('setJustExitPause', async function () {
      store.commit('setJustExitPause', true);
      expect(store.state.isJustExitPause).to.equal(true);
    });

    it('resetRecord', async function () {
      store.commit('resetRecord');
      //	expect(store.state.startTimeRecord).to.equal(moment().utc());
      expect(store.state.timerRecord).to.equal(0);
      expect(store.state.distanceRecord).to.equal(0);
      expect(store.state.geoLat).to.equal(0);
      expect(store.state.geoLong).to.equal(0);
      expect(store.state.geoJsonRecord[0].type).to.equal('Feature');
      expect(store.state.geoJsonRecord[0].properties.time).to.equal('');
      expect(
        store.state.geoJsonRecord[0].properties.coordinateProperties.times
          .length
      ).to.equal(0);
      expect(
        store.state.geoJsonRecord[0].properties.coordinateProperties.heart
          .length
      ).to.equal(0);
      expect(store.state.geoJsonRecord[0].geometry.type).to.equal('LineString');
      expect(store.state.geoJsonRecord[0].geometry.coordinates.length).to.equal(
        0
      );
    });

    it('setTimerId', async function () {
      store.commit('setTimerId', '23334');
      expect(store.state.timerId).to.equal('23334');
    });

    it('resetGeoTrace', async function () {
      store.commit('resetGeoTrace');
      expect(store.state.geoJsonRecord[0].type).to.equal('Feature');
      expect(store.state.geoJsonRecord[0].properties.time).to.equal('');
      expect(
        store.state.geoJsonRecord[0].properties.coordinateProperties.times
          .length
      ).to.equal(0);
      expect(
        store.state.geoJsonRecord[0].properties.coordinateProperties.heart
          .length
      ).to.equal(0);
      expect(store.state.geoJsonRecord[0].geometry.type).to.equal('LineString');
      expect(store.state.geoJsonRecord[0].geometry.coordinates.length).to.equal(
        0
      );
    });

    it('setTimerId', async function () {
      store.commit('setTimerId', '23334');
      expect(store.state.timerId).to.equal('23334');
    });

    it('setCoordGeoTrace', async function () {
      store.commit('setCoordGeoTrace', [49.4, 2.6]);
      expect(store.state.geoJsonRecord[0].geometry.coordinates[0][0]).to.equal(
        49.4
      );
      expect(store.state.geoJsonRecord[0].geometry.coordinates[0][1]).to.equal(
        2.6
      );
      expect(store.state.geoLong).to.equal(49.4);
      expect(store.state.geoLat).to.equal(2.6);
    });

    it('setDisplayBurgerMenu', async function () {
      store.commit('setDisplayBurgerMenu', true);
      expect(store.state.displayBurgerMenu).to.equal(true);
    });

    it('setBurgerMenuContents', async function () {
      let menu = [
        {
          label: 'Modifier',
          disabled: false,
          action: function () {
            EventBus.$emit('modifyMarker');
          }
        },
        {
          label: 'Supprimer',
          disabled: true,
          action: function () {
            EventBus.$emit('deleteMarker');
          }
        }
      ];
      store.commit('setBurgerMenuContents', menu);

      expect(store.state.burgerMenuContents[0].label).to.equal('Modifier');
      expect(store.state.burgerMenuContents[1].label).to.equal('Supprimer');
      expect(store.state.burgerMenuContents[0].disabled).to.equal(false);
      expect(store.state.burgerMenuContents[1].disabled).to.equal(true);
    });

    it('setConnexionStatus', async function () {
      store.commit('setConnexionStatus', false);
      expect(store.state.connexionStatus).to.equal(false);
    });

    it('setSettings', async function () {
      store.commit('setSettings', {
        language: 'fr',
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
          activityTypeNotSelected: []
        },
        activitiesAnimalsListFilter: {
          isMapVisible: true,
          isPhotosVisible: true,
          isDetailsVisible: true,
          distanceMax: 100,
          distanceMin: 0,
          activityTypeNotSelected: []
        }
      });
      expect(store.state.settings.displayModals.warningOffline).to.equal(false);
    });

    it('setWarningOfflineModal', async function () {
      store.commit('setWarningOfflineModal', true);
      expect(store.state.settings.displayModals.warningOffline).to.equal(true);
    });

    it('push_settings_activitiesListFilter_activityTypeNotSelected', async function () {
      store.commit(
        'push_settings_activitiesListFilter_activityTypeNotSelected',
        'Balade'
      );
      store.commit(
        'push_settings_activitiesListFilter_activityTypeNotSelected',
        'Essai'
      );
      expect(
        store.state.settings.activitiesListFilter.activityTypeNotSelected[0]
      ).to.equal('Balade');
      expect(
        store.state.settings.activitiesListFilter.activityTypeNotSelected[1]
      ).to.equal('Essai');
    });

    it('pop_settings_activitiesListFilter_activityTypeNotSelected', async function () {
      store.commit(
        'pop_settings_activitiesListFilter_activityTypeNotSelected',
        'Balade'
      );

      expect(
        store.state.settings.activitiesListFilter.activityTypeNotSelected[0]
      ).to.equal('Essai');
    });

    it('push_settings_activitiesAnimalsListFilter_activityTypeNotSelected', async function () {
      store.commit(
        'push_settings_activitiesAnimalsListFilter_activityTypeNotSelected',
        'Balade'
      );
      store.commit(
        'push_settings_activitiesAnimalsListFilter_activityTypeNotSelected',
        'Essai'
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter
          .activityTypeNotSelected[0]
      ).to.equal('Balade');
      expect(
        store.state.settings.activitiesAnimalsListFilter
          .activityTypeNotSelected[1]
      ).to.equal('Essai');
    });

    it('pop_settings_activitiesAnimalsListFilter_activityTypeNotSelected', async function () {
      store.commit(
        'pop_settings_activitiesAnimalsListFilter_activityTypeNotSelected',
        'Balade'
      );

      expect(
        store.state.settings.activitiesListFilter.activityTypeNotSelected[0]
      ).to.equal('Essai');
    });

    it('set_settings_activitiesAnimalsListFilter_mapVisible', async function () {
      store.commit('set_settings_activitiesAnimalsListFilter_mapVisible', true);
      expect(
        store.state.settings.activitiesAnimalsListFilter.isMapVisible
      ).to.equal(true);
      store.commit(
        'set_settings_activitiesAnimalsListFilter_mapVisible',
        false
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter.isMapVisible
      ).to.equal(false);
    });

    it('set_settings_activitiesAnimalsListFilter_photosVisible', async function () {
      store.commit(
        'set_settings_activitiesAnimalsListFilter_photosVisible',
        true
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter.isPhotosVisible
      ).to.equal(true);
      store.commit(
        'set_settings_activitiesAnimalsListFilter_photosVisible',
        false
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter.isPhotosVisible
      ).to.equal(false);
    });

    it('set_settings_activitiesAnimalsListFilter_detailsVisible', async function () {
      store.commit(
        'set_settings_activitiesAnimalsListFilter_detailsVisible',
        true
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter.isDetailsVisible
      ).to.equal(true);
      store.commit(
        'set_settings_activitiesAnimalsListFilter_detailsVisible',
        false
      );
      expect(
        store.state.settings.activitiesAnimalsListFilter.isDetailsVisible
      ).to.equal(false);
    });

    it('set_settings_activitiesAnimalsListFilter_distanceMax', async function () {
      store.commit('set_settings_activitiesAnimalsListFilter_distanceMax', 100);
      expect(
        store.state.settings.activitiesAnimalsListFilter.distanceMax
      ).to.equal(100);
      store.commit('set_settings_activitiesAnimalsListFilter_distanceMax', 50);
      expect(
        store.state.settings.activitiesAnimalsListFilter.distanceMax
      ).to.equal(50);
    });

    it('set_settings_activitiesAnimalsListFilter_distanceMin', async function () {
      store.commit('set_settings_activitiesAnimalsListFilter_distanceMin', 100);
      expect(
        store.state.settings.activitiesAnimalsListFilter.distanceMin
      ).to.equal(100);
      store.commit('set_settings_activitiesAnimalsListFilter_distanceMin', 50);
      expect(
        store.state.settings.activitiesAnimalsListFilter.distanceMin
      ).to.equal(50);
    });

    it('setDistanceMaxOnFilterMap', async function () {
      store.commit('setDistanceMaxOnFilterMap', 50);

      expect(store.state.settings.mapFilter.distanceMax).to.equal(50);
    });

    it('setDistanceMinOnFilterMap', async function () {
      store.commit('setDistanceMinOnFilterMap', 13);

      expect(store.state.settings.mapFilter.distanceMin).to.equal(13);
    });

    it('set_settings_language', async function () {
      store.commit('set_settings_language', 'en');

      expect(store.state.settings.language).to.equal('en');
    });

    it('Input Name vide', async function () {
      assert.strictEqual(store.state.applicationState.map, false);
    });

    it('nbUploadingImages is an Array', async function () {
      expect(store.state.nbUploadingImages).to.be.a('array');
    });

    it('nbUploadingImages : Création entrée', async function () {
      store.commit('setNbUploadingImages', {
        id: new Mongo.ObjectID('123456789012345678901212'),
        number: 2
      });
      expect(
        store.state.nbUploadingImages[store.state.nbUploadingImages.length - 1]
          .id._str
      ).to.equal('123456789012345678901212');
      expect(
        store.state.nbUploadingImages[store.state.nbUploadingImages.length - 1]
          .number
      ).to.equal(2);
    });

    it("nbUploadingImages : soustraire 1 de l'entrée précédente ", async function () {
      store.commit(
        'decreaseNbUploadingImages',
        new Mongo.ObjectID('123456789012345678901212')
      );
      expect(
        store.state.nbUploadingImages[store.state.nbUploadingImages.length - 1]
          .id._str
      ).to.equal('123456789012345678901212');
      expect(
        store.state.nbUploadingImages[store.state.nbUploadingImages.length - 1]
          .number
      ).to.equal(1);
    });

    it("nbUploadingImages : Arrivée à zéro, retrait de l'entré ", async function () {
      store.commit(
        'decreaseNbUploadingImages',
        new Mongo.ObjectID('123456789012345678901212')
      );
      expect(store.state.nbUploadingImages.length).to.equal(0);
    });

    it('setvisibleMarkerOnMap : Init ', async function () {
      expect(store.state.settings.visibleMarkersOnMap).to.be.a('array');
      expect(store.state.settings.visibleMarkersOnMap[0].id).to.equal(0);
      expect(store.state.settings.visibleMarkersOnMap[1].visible).to.equal(
        true
      );
      //expect(store.state.visibleMarkersOnMap[2]).to.equal("Sac à crottes");
    });

    it('setvisibleMarkerOnMap ', async function () {
      store.commit('setvisibleMarkerOnMap', ['zzz', 'aaa']);
      expect(store.state.settings.visibleMarkersOnMap[0]).to.equal('zzz');
      expect(store.state.settings.visibleMarkersOnMap[1]).to.equal('aaa');
    });

    //	A faire, bloque à la fin des test  componentInstance.submit();
    //	assert.strictEqual(resultDate, "01:01:01");
    //	log.info(wrapper.find({ ref: "input-checked-animal" }).html());
    //	log.info("Chekced");
    //	log.info(wrapper.find("#A01"));

    //	assert.strictEqual(wrapper.find("#Notes0").element.value, "Notes1");
    //	assert.strictEqual(wrapper.find("#Notes1").element.value, "Notes2");
  });
}

// ******
//A faire
// *****
/* 		it("settings_set_warningOfflineModal", async function () {
			store.dispatch("settings_set_warningOfflineModal", false);
			expect(store.state.settings.displayModals.warningOffline).to.equal(false);
		});
 */
// **
// **
// **

/*
 *
 * Composant ActivityAnimalCard
 *
 */
/* 
	describe("Composant ActivityAnimalCard: ", () => {
		const state = {
			nbUploadingImages: [],
			geoJsonRecord: [],
			activityType: [
				"Balade",
				"Cani-cross",
				"Cani-VTT",
				"Course à pied",
				"Equitation - Dressage",
				"Equitation - Balade",
				"Vélo",
				"Randonnée",
			],
		};
		const mutations = {
			DisableBottomBar() {},
			EnableTopLeftButton() {},
			SetTopRightButtonState() {},
			SetTopRightButtonLabel() {},
			disableTraceRecorded() {},
		};
		const store = new Vuex.Store({
			state,
			mutations,
		});
		log.info("Composant ActivityAnimalCard: ");
		let wrapper;
		let componentInstance;

		log.info("Composant ActivityAnimalCard : APRES");
	

		beforeEach(() => {
			Meteor.userId = function () {
				return Random.id();
			};

			Meteor.userById = function () {
				return "zjKTB3xutRYgSk2Ne";
			};

			const idOwner = Random.id();

			Meteor.animal = function () {
				return {
					Name: "Phantom",
					Owner: idOwner,
					Type: "Chien",
					isShare: true,
					Birthday: "12/11/2020",
					Weight: 10,
					Height: 12,
				};
			};

			let PetId = Meteor.call("animal.create", {
				Name: "Phantom",
				Type: "Chien",
				isShare: true,
				Birthday: "12/11/2020",
				Weight: 10,
				Height: 12,
			});

			wrapper = mount(ActivityAnimalCard, {
				localVue,
				store,
				i18n,
				//	bootstrapvue,
				propsData: {
					activity: {
						_id: { _str: "c1cac9ff37895957c2160b11" },
						IDAnimal: PetId,
						IDActivity: { _str: "95ed6468a22d8765f93769b7" },
						ActivityOwner: "zjKTB3xutRYgSk2Ne",
						ActivityName: "Balade1",
						ActivityDescription: "",
						AnimalName: "Phantom",
						AnimalOwner: idOwner,
						ActivityType: "Balade",
						DateAct: new Date("20210316T07:29:39Z"),
						TimeFCtotal: 1024,
						Distance: 1.3525403372249576,
						Notes: null,
						center: [],
						Id_GPX: { _str: "a2ed24f539a217a7aa10e909" },
					},
					userId: "EDdfrrff",
					userById: "Stéphanie",
				},
				data() {
					return {};
				},
				stubs: {
					"b-row": true,
					"b-col": true,
					"b-spinner": true,
					"b-card": true,
					"b-avatar": true,
					"b-iconstack": true,
					"b-icon": true,
					"b-button": true,
				},
			});
			componentInstance = wrapper.vm;
		});
		it("Method FormatDate", async function () {
	

			let date = new Date("2020-12-24 08:57:19.000Z");
			let DateUTC = moment("2020-12-24 08:57:19.000Z");

			let resultDate = componentInstance.FormatDate(date);
			assert.strictEqual(
				resultDate,
				"Le " +
					DateUTC.format("DD/MM/YYYY") +
					" à " +
					DateUTC.format("HH:mm:ss")
			);
		});
		it("Method FormatTime", async function () {
		
		 
			let resultDate = componentInstance.FormatTime(3661);
			assert.strictEqual(resultDate, "01:01:01");
		});
	}); */
