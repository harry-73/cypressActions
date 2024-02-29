import assert from 'assert';
import MarkerComments from '../../imports/api/collections/MarkerComments';
import Markers from '../../imports/api/collections/Markers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import log from 'loglevel';
import '../../imports/api/methods/Comments';
import { commentadd, commentdelete } from '../../imports/api/methods/Comments';
import { Random } from 'meteor/random';

if (Meteor.isServer) {
  (async () => {
    await MarkerComments.removeAsync({});
  })();
  (async () => {
    await Markers.removeAsync({});
  })();
}

if (Meteor.isServer) {
  describe('Comments', function () {
    describe('methods not loggued', function () {
      it('commentadd : peut ajouter un commentaire', async function () {
        const userId = Random.id();

        let idMarker = await Markers.insertAsync({
          position: [1, 2],
          OwnerId: userId,
          Type: 'Type',
          icon: 'icon.png',
          description: 'Descr',
          title: 'Titre',
          like: 1,
          dislike: 0,
          SelectLike: [userId],
          SelectDislike: []
        });

        //   expect(function () {
        commentadd.call(
          {
            text: 'Good site',
            date: new Date('2020-01-03T23:43:04+02:00'),
            IdMarker: idMarker
          },
          (err) => {
            expect(err.error).to.equal('Comments.methods.commentadd.notlogged');
          }
        );
        /*  }).to.throw(
          'Vous devez être loggué. [Comments.methods.commentadd.notlogged]'
        ); */

        /* assert.strictEqual(
					MarkerComments.find({ IdMarker: idMarker }).count(),
					1
				);
				let result = MarkerComments.find({
					IdMarker: idMarker,
				}).fetch()[0];

				assert.strictEqual(result.text, "Good site");

				assert.strictEqual(result.IdMarker._str, idMarker._str);
				assert.strictEqual(result.IdOwner, Meteor.userId());
				assert.strictEqual(result.ownerFirstName, "Stéphane"); */
      });

      it('sase.commentdelete : peut effacer un commentaire (Not Loggued', async function () {
        const userId = await Accounts.createUserAsync({
          username: 'Comment1',
          email: 'ste11.monnier@gmail.com',
          password: 'EEEE',
          profile: {
            firstname: 'Stéphane',
            lastname: 'Monnier'
          }
        });
        const context = { userId };
        //log.info("USERID : ", Meteor.userId());
        let idMarker = await Markers.insertAsync({
          position: [1, 2],
          OwnerId: userId,
          Type: 'Type',
          icon: 'icon.png',
          description: 'Descr',
          title: 'Titre',
          like: 1,
          dislike: 0,
          SelectLike: ['id'],
          SelectDislike: []
        });

        let idComment = await commentadd._execute(
          context,

          {
            text: 'Good site',
            date: new Date('2020-01-03T23:43:04+02:00'),
            IdMarker: idMarker
          }
        );
        //   expect(function () {
        commentdelete.call({ id: idComment }, (err) => {
          expect(err.error).to.equal(
            'Comments.methods.commentdelete.notlogged'
          );
        });
        /*  }).to.throw(
          'Vous devez être loggué. [Comments.methods.commentdelete.notlogged]'
        ); */
      });

      it('sase.commentdelete : peut effacer un commentaire (Not Owner', async function () {
        const userId = await Accounts.createUserAsync({
          username: 'Comment11',
          email: 'ste111.monnier@gmail.com',
          password: 'EEEE',
          profile: {
            firstname: 'Stéphane',
            lastname: 'Monnier'
          }
        });
        const context = { userId };
        //log.info("USERID : ", Meteor.userId());
        let idMarker = await Markers.insertAsync({
          position: [1, 2],
          OwnerId: userId,
          Type: 'Type',
          icon: 'icon.png',
          description: 'Descr',
          title: 'Titre',
          like: 1,
          dislike: 0,
          SelectLike: ['id'],
          SelectDislike: []
        });

        let idComment = await commentadd._execute(
          context,

          {
            text: 'Good site',
            date: new Date('2020-01-03T23:43:04+02:00'),
            IdMarker: idMarker
          }
        );
        // expect(function () {
        commentdelete._execute(
          { userId: Random.id() },
          { id: idComment },
          (err) => {
            expect(err.error).to.equal(
              'Comments.methods.commentdelete.unauthorized'
            );
          }
        );
        /*  }).to.throw(
          "Vous n'êtes pas le propriétiare [Comments.methods.commentdelete.unauthorized]"
        ); */
      });
    });
    //const userId = Random.id();

    /* 

			 */
  });

  describe('methods  loggued', () => {
    it('sase.commentadd : peut ajouter un commentaire', async function () {
      const userId = await Accounts.createUserAsync({
        username: 'Comment',
        email: 'ste1.monnier@gmail.com',
        password: 'EEEE',
        profile: {
          firstname: 'Stéphane',
          lastname: 'Monnier'
        }
      });
      const context = { userId };
      //log.info("USERID : ", Meteor.userId());
      let idMarker = await Markers.insertAsync({
        position: [1, 2],
        OwnerId: userId,
        Type: 'Type',
        icon: 'icon.png',
        description: 'Descr',
        title: 'Titre',
        like: 1,
        dislike: 0,
        SelectLike: ['id'],
        SelectDislike: []
      });

     await commentadd._execute(
        context,

        {
          text: 'Good site',
          date: new Date('2020-01-03T23:43:04+02:00'),
          IdMarker: idMarker
        }
      );

      assert.strictEqual(
        await MarkerComments.find({ IdMarker: idMarker }).countAsync(),
        1
      );
      let result = await MarkerComments.findOneAsync({
        IdMarker: idMarker
      });

      assert.strictEqual(result.text, 'Good site');

      assert.strictEqual(result.IdMarker._str, idMarker._str);
      assert.strictEqual(result.IdOwner, userId);
      assert.strictEqual(result.ownerFirstName, 'Stéphane');
    });

    it('sase.commentdelete : peut effacer un commentaire ', async function () {
      const userId = await Accounts.createUserAsync({
        username: 'Comment113',
        email: 'ste1113.monnier@gmail.com',
        password: 'EEEE',
        profile: {
          firstname: 'Stéphane',
          lastname: 'Monnier'
        }
      });
      const context = { userId };
      //log.info("USERID : ", Meteor.userId());
      let idMarker = await Markers.insertAsync({
        position: [1, 2],
        OwnerId: userId,
        Type: 'Type',
        icon: 'icon.png',
        description: 'Descr',
        title: 'Titre',
        like: 1,
        dislike: 0,
        SelectLike: ['id'],
        SelectDislike: []
      });

      let idComment = await commentadd._execute(
        context,

        {
          text: 'Good site',
          date: new Date('2020-01-03T23:43:04+02:00'),
          IdMarker: idMarker
        }
      );

      await commentdelete._execute(context, { id: idComment });

      assert.strictEqual(
        await MarkerComments.find({ _id: idComment }).countAsync(),
        0
      );
    });
  });
}
