import assert from 'assert';
import { expect } from 'chai';
import Pets from '../../imports/api/collections/Pets';
import '../../imports/api/methods/Animal';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import log from 'loglevel';

if (Meteor.isClient) {
  import { createLocalVue, mount } from '@vue/test-utils';
  /*   import {
    BootstrapVue
  } from 'bootstrap-vue'; */
  import { createStore } from 'vuex';
  import { createRouter } from 'vue-router';
  import { createI18n } from 'vue-i18n';

  //import VueRouter from 'vue-router';
  //import Vuex from 'vuex';
  //import VueI18n from 'vue-i18n';

  //import Vuelidate from 'vuelidate';
  import ViewActivityAdd from '../../imports/ui/views/ViewActivityAdd.vue';
  import ActivityAnimalCard from '../../imports/ui/components/Cards/ActivityAnimalCard.vue';
  //	log.info("IMPORT TESTS");

  //localVue.use(IconsPlugin);

  //	localVue.use(BootstrapVue);
  // Optionally install the BootstrapVue icon components plugin
  //	localVue.use(IconsPlugin);

  //Vue.use(BootstrapVue);

  import en from '/locales/en.json';
  import fr from '/locales/fr.json';

  const localVue = createLocalVue();
  //	log.info("IMPORT TESTS3");
  //localVue.use(Vuelidate);
  //localVue.use(VueI18n);
  //	log.info("IMPORT TESTS4");
  // localVue.use(BootstrapVue);
  //	log.info("IMPORT TESTS1");

  const i18n = createI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || 'fr',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'fr',
    messages: {
      fr: fr,
      en: en
    }
  });
  //localVue.use(VueRouter);
  // localVue.component('ActivityAnimalCard', ActivityAnimalCard);
  // localVue.component('ViewActivityAdd', ViewActivityAdd);

  //	log.info("IMPORT TESTS2");
  /*
   *
   * Composant ViewActivityAdd
   *
   */
  describe('Composant ViewActivityAdd: ', function () {
    const state = {
      geoJsonRecord: [],
      activityType: [
        {
          name: 'Balade',
          icon: '/activityIcons/walking.png'
        },
        {
          name: 'Cani-cross',
          icon: '/activityIcons/cani-cross.png'
        },
        {
          name: 'Cani-VTT',
          icon: '/activityIcons/mountainBike.png'
        },
        {
          name: 'Canin - Education',
          icon: '/activityIcons/dogActivity.png'
        },
        {
          name: 'Canin - Agilité',
          icon: '/activityIcons/dogActivity.png'
        },
        {
          name: 'Canoe - Kayak',
          icon: '/activityIcons/canoe.png'
        },
        {
          name: 'Course à pied',
          icon: '/activityIcons/running.png'
        },
        {
          name: 'Equitation - Dressage',
          icon: '/activityIcons/horseTraining.png'
        },
        {
          name: 'Equitation - Balade',
          icon: '/activityIcons/horseRiding.png'
        },
        {
          name: 'Marche',
          icon: '/activityIcons/walking.png'
        },
        {
          name: 'Marche nordique',
          icon: 'fa-solid fa-person-hiking'
        },
        {
          name: 'Musculation',
          icon: '/activityIcons/dumbell.png'
        },
        {
          name: 'Natation',
          icon: '/activityIcons/swimming.png'
        },
        {
          name: 'Randonnée',
          icon: '/activityIcons/hiking.png'
        },
        {
          name: 'Raquettes',
          icon: '/activityIcons/snowRaquets.png'
        },
        {
          name: 'Ski de fond',
          icon: '/activityIcons/crossCountrySkiing.png'
        },
        {
          name: 'Ski de randonnée',
          icon: '/activityIcons/touringSkiing.png'
        },
        {
          name: 'Ski alpin',
          icon: '/activityIcons/alpineSkiing.png'
        },
        {
          name: 'Vélo',
          icon: '/activityIcons/biking.png'
        }
      ]
    };
    const mutations = {
      DisableBottomBar() {},
      EnableTopLeftButton() {},
      SetTopRightButtonState() {},
      SetTopRightButtonLabel() {},
      disableTraceRecorded() {}
    };
    const store = new createStore({
      state,
      mutations
    });

    const routes = [
      // dynamic segments start with a colon
      { path: '/user/:id', component: ViewActivityAdd }
    ];

    const router = createRouter({
      routes
    });
    //log.info("Composant ActivityAnimalCard: ");

    //	let bootstrapvue = new BootstrapVue();
    //	log.info("bootstrapvue");
    let wrapper;
    let componentInstance;
    beforeEach(() => {
      wrapper = mount(ViewActivityAdd, {
        global: {
          plugins: [store, router, i18n]
        },

        //		bootstrapvue,
        data() {
          return {
            pets: []
          };
        },
        propsData: {},
        stubs: {
          'b-row': true,
          'b-col': true,
          'b-spinner': true,
          'b-card': true,
          'b-avatar': true,
          'b-iconstack': true,
          'b-icon': true,
          'b-button': true
        }
      });
      componentInstance = wrapper.vm;
    });

    it('Input Name vide', async function () {
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const nameMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-name'
      });
      assert.strictEqual(nameMandatoryValue.text(), 'Obligatoire');
    });

    it('Input Name longueur minimale', async function () {
      await wrapper.setData({ ModifyActivity: { name: 'Es' } });
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const nameLengthValue = wrapper.findComponent({
        ref: 'input-length-name'
      });
      expect(nameLengthValue.text()).to.match(/^Name must have at least*/);
    });

    it('Input Name non vide', async function () {
      await wrapper.setData({ ModifyActivity: { name: 'Essai' } });
      const nameValue = wrapper.findComponent({ ref: 'input-name' });
      const nameMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-name'
      });
      //	log.info(nameMandatoryValue.element);
      assert.strictEqual(nameMandatoryValue.element, undefined);
      assert.strictEqual(nameValue.element.value, 'Essai');
    });

    it('Input Type vide', async function () {
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const typeMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-type'
      });
      assert.strictEqual(typeMandatoryValue.text(), 'Obligatoire');
    });
    it('Input Type non vide', async function () {
      await wrapper.setData({
        ModifyActivity: { name: 'Essai', type: 'Course à pied' }
      });
      const typeValue = wrapper.findComponent({ ref: 'input-type' });
      const typeMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-type'
      });
      //	log.info(nameMandatoryValue.element);
      assert.strictEqual(typeMandatoryValue.element, undefined);
      assert.strictEqual(typeValue.element.value, 'Course à pied');
    });

    // Tester Ajouter Photo

    it('Input Description non vide', async function () {
      await wrapper.setData({
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool"
        }
      });
      const descriptionValue = wrapper.findComponent({
        ref: 'input-description'
      });

      //	log.info(nameMandatoryValue.element);

      assert.strictEqual(
        descriptionValue.element.value,
        "Une desciption, c'est cool"
      );
    });

    it('Input Time vide', async function () {
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const timeMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-time'
      });
      assert.strictEqual(timeMandatoryValue.text(), 'Obligatoire');
    });

    it('Input Time non vide', async function () {
      await wrapper.setData({
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool",
          time: '10:01:01'
        }
      });
      const timeValue = wrapper.findComponent({ ref: 'input-time' });
      const timeMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-time'
      });
      //	log.info(nameMandatoryValue.element);
      assert.strictEqual(timeMandatoryValue.element, undefined);
      assert.strictEqual(timeValue.element.value, '10:01:01');
    });

    it('Input distance non numérique', async function () {
      await wrapper.setData({ ModifyActivity: { distance: '' } });

      let distanceMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-distance'
      });
      assert.strictEqual(distanceMandatoryValue.text(), 'Obligatoire');
      await wrapper.setData({ ModifyActivity: { distance: 'E' } });

      let distanceNumberValue = wrapper.findComponent({
        ref: 'input-number-distance'
      });
      assert.strictEqual(
        distanceNumberValue.text(),
        'La distance doit être un nombre.'
      );
    });

    it('Input distance négative', async function () {
      await wrapper.setData({ ModifyActivity: { distance: '-1' } });

      let distanceMandatoryValue = wrapper.findComponent({
        ref: 'input-minvalue-distance'
      });
      assert.strictEqual(
        distanceMandatoryValue.text(),
        'La distance doit être positive.'
      );
    });

    it('Input Distance', async function () {
      await wrapper.setData({
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool",
          time: '10:01:01',
          distance: 10
        }
      });
      const distanceValue = wrapper.findComponent({ ref: 'input-distance' });

      assert.strictEqual(distanceValue.element.value, '10');
    });

    it('Input Date vide', async function () {
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const dateMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-date'
      });
      assert.strictEqual(dateMandatoryValue.text(), 'Obligatoire');
    });

    it('Input Date non vide ', async function () {
      await wrapper.setData({ date: '2020-01-04' });
      const dateValue = wrapper.findComponent({ ref: 'input-date' });
      const datemandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-date'
      });

      assert.strictEqual(datemandatoryValue.element, undefined);
      assert.strictEqual(dateValue.element.value, '2020-01-04');
    });

    it('Input Heure vide', async function () {
      //	const nameValue = wrapper.findComponent({ ref: "input-name" });
      const heureMandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-heure'
      });
      assert.strictEqual(heureMandatoryValue.text(), 'Obligatoire');
    });

    it('Input Heure non vide ', async function () {
      await wrapper.setData({ heure: '20:34:04' });
      const heureValue = wrapper.findComponent({ ref: 'input-heure' });
      const heuremandatoryValue = wrapper.findComponent({
        ref: 'input-mandatory-heure'
      });

      assert.strictEqual(heuremandatoryValue.element, undefined);
      assert.strictEqual(heureValue.element.value, '20:34:04');
    });

    it('Input Animaux checked', async function () {
      await wrapper.setData({
        pets: [
          { Name: 'Phantom', _id: 'dDsfFSFs' },
          { Name: 'Medoc', _id: 'dDsfdfsdfsFSFs' }
        ],
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool",
          time: '10:01:01',
          distance: 10,
          checked: []
        }
      });

      //	log.info(wrapper.find({ ref: "input-checked-animal" }).html());
      //	log.info("Chekced");
      //	log.info(wrapper.find("#A01"));

      assert.strictEqual(
        wrapper.find('#Check0').element.value,
        'dDsfFSFs,Phantom,0'
      );
      assert.strictEqual(
        wrapper.find('#Check1').element.value,
        'dDsfdfsdfsFSFs,Medoc,1'
      );
      assert.strictEqual(wrapper.find('#Check01').text(), 'Phantom');
      assert.strictEqual(wrapper.find('#Check11').text(), 'Medoc');
    });
    it('Input Animaux Notes', async function () {
      await wrapper.setData({
        pets: [
          { Name: 'Phantom', _id: 'dDsfFSFs' },
          { Name: 'Medoc', _id: 'dDsfdfsdfsFSFs' }
        ],
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool",
          time: '10:01:01',
          distance: 10,
          checked: [],
          Notes: ['Notes1', 'Notes2']
        }
      });

      //	log.info(wrapper.find({ ref: "input-checked-animal" }).html());
      //	log.info("Chekced");
      //	log.info(wrapper.find("#A01"));

      assert.strictEqual(wrapper.find('#Notes0').element.value, 'Notes1');
      assert.strictEqual(wrapper.find('#Notes1').element.value, 'Notes2');
    });

    it('Messages Submit', async function () {
      await wrapper.setData({ submitStatus: 'OK' });

      assert.strictEqual(
        wrapper.find('#OK').text(),
        'Thanks for your submission!'
      );
      assert.strictEqual(wrapper.find('#ERROR').element, undefined);
      assert.strictEqual(wrapper.find('#PENDING').element, undefined);

      await wrapper.setData({ submitStatus: 'ERROR' });

      assert.strictEqual(
        wrapper.find('#ERROR').text(),
        'Please fill the form correctly.'
      );
      assert.strictEqual(wrapper.find('#PENDING').element, undefined);
      assert.strictEqual(wrapper.find('#OK').element, undefined);

      await wrapper.setData({ submitStatus: 'PENDING' });

      assert.strictEqual(wrapper.find('#PENDING').text(), 'Sending...');
      assert.strictEqual(wrapper.find('#ERROR').element, undefined);
      assert.strictEqual(wrapper.find('#OK').element, undefined);
    });

    it('Submit', async function () {
      await wrapper.setData({
        pets: [
          { Name: 'Phantom', _id: 'dDsfFSFs' },
          { Name: 'Medoc', _id: 'dDsfdfsdfsFSFs' }
        ],
        ModifyActivity: {
          name: 'Essai',
          type: 'Course à pied',
          description: "Une desciption, c'est cool",
          time: '10:01:01',
          distance: 10,
          checked: [],
          Notes: ['Notes1', 'Notes2']
        },
        date: '2020-01-04',
        heure: '20:03:02'
      });

      //	A faire, bloque à la fin des test  componentInstance.submit();
      //	assert.strictEqual(resultDate, "01:01:01");
      //	log.info(wrapper.find({ ref: "input-checked-animal" }).html());
      //	log.info("Chekced");
      //	log.info(wrapper.find("#A01"));

      //	assert.strictEqual(wrapper.find("#Notes0").element.value, "Notes1");
      //	assert.strictEqual(wrapper.find("#Notes1").element.value, "Notes2");
    });
  });

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
				},
				data() {
					return {
						//	userId: "EDdfrrff",
						userById: "Stéphanie",
					};
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
	});*/
}
