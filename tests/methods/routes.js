import ActivitiesGPX from '../../imports/api/collections/ActivitiesGPX';
import {
  activityshare,
  activitycreate
} from '../../imports/api/methods/Activity';

import { routemodify } from '../../imports/api/methods/Route';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'chai';

if (Meteor.isServer) {
  describe('Route', function () {
    let userId, context, activityGpxId, route;
    beforeEach(async function () {
      await ActivitiesGPX.removeAsync({});

      userId = Random.id();
      context = { userId };

      activityGpxId = await ActivitiesGPX.insertAsync({
        Shared: true,
        Owner: userId,
        name: 'Test',
        type: [1, 2],
        description: 'description',
        time: '11:22:33',
        distance: 5.6,
        images: []
      });

      route = {
        id: activityGpxId,
        name: 'Test',
        type: [0, 1],
        description: 'description',
        time: '11:22:33',
        distance: 5.6,
        dogFeatures: {
          available: false,
          free: false,
          onLeash: false,
          roadCrossing: false,
          animalCrossbreeding: false,
          animalCrossbreedingType: [],
          difficulty: 0.0
        }
      };
    });

    /*
     *
     * Method : route.modify : Vous devez être loggué.
     *
     */
    it('route.modify : Vous devez être loggué.', function () {
      //expect(function () {
      routemodify.call(route, (err) => {
        expect(err.error).to.equal('Route.methods.routemodify.notloggued');
      });
      /*   }).to.throw(
        'Vous devez être loggué. [Route.methods.routemodify.notloggued]'
      ); */
    });
    /*
     *
     * Method : route.modify : Vous n'êtes pas le propriétiare
     *
     */
    it("route.modify : Vous n'êtes pas le propriétiare", function () {
      const otherContext = { userId: Random.id() };
      // expect(function () {
      routemodify._execute(otherContext, route, (err) => {
        expect(err.error).to.equal('Route.methods.routemodify.unauthorized');
      });
      /*  }).to.throw(
        "Vous n'êtes pas le propriétiare [Route.methods.routemodify.unauthorized]"
      ); */
    });

    /*
     *
     * Method : route.modify : Modifier un parcours
     *
     */
    it('route.modify : Modifier un parcours', async function () {
      await routemodify._execute(context, route);

      const result = await ActivitiesGPX.findOneAsync({ _id: activityGpxId });

      expect(result.name).to.equal('Test');
      expect(result.type[0]).to.equal(0);
      expect(result.type[1]).to.equal(1);
      expect(result.description).to.equal('description');
      expect(result.time).to.equal('11:22:33');
      expect(result.distance).to.equal(5.6);
    });
  });
}
