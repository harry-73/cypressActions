import assert from 'assert';
import MarkerComments from '../../imports/api/collections/MarkerComments';
import Markers from '../../imports/api/collections/Markers';
import {
  markermodify,
  markerdislike,
  markerlike,
  markeradd,
  markerdelete,
  markeraddimage
} from '../../imports/api/methods/Markers';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import markerType from '../../imports/api/collections/markerType';
import { Random } from 'meteor/random';
import log from 'loglevel';

if (Meteor.isServer) {
  if (Meteor.isServer) {
    (async () => {
      await MarkerComments.removeAsync({});
    })();

    // ...
  }

  describe('Markers', () => {
    describe('methods loggued', () => {
      let userId, idMarker, context;
      beforeEach(async () => {
        userId = Random.id();
        idMarker = await Markers.insertAsync({
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

        context = { userId };
      });
      it('marker.dislike : Vous devez être loggué.', () => {
        //  expect(function () {
        markerdislike.call(
          {
            Id: idMarker,
            like: 2,
            dislike: 0
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Markers.methods.markerdislike.notloggued'
            );
          }
        );
        /*  }).to.throw(
          'Vous devez être loggué. [Markers.methods.markerdislike.notloggued]'
        ); */
      });
      it("marker.dislike : n'aime pas un marqueur", async function () {
        await markerdislike._execute(context, {
          Id: idMarker,
          like: 0,
          dislike: 1
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).like,
          0
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).dislike,
          1
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).SelectLike.length,
          0
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).SelectDislike.length,
          1
        );
      });

      it('marker.like : Vous devez être loggué.', function () {
        // expect(function () {
        markerlike.call(
          {
            Id: idMarker,
            like: 2,
            dislike: 0
          },
          (err) => {
            assert.strictEqual(
              err.error,
              'Markers.methods.markerlike.notloggued'
            );
          }
        );
        /*   }).to.throw(
          'Vous devez être loggué. [Markers.methods.markerlike.notloggued]'
        ); */
      });

      it('marker.like :aime un marqueur', async function () {
        await markerlike._execute(
          { userId: Random.id() },
          {
            Id: idMarker,
            like: 2,
            dislike: 0
          }
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).like,
          2
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).dislike,
          0
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).SelectLike.length,
          2
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).SelectDislike.length,
          0
        );
      });

      it('marker.modify : modifier un marqueur', async function () {
        await markerType.insertAsync({
          markerType: [
            {
              text: 'Sac à crottes',
              icon: '/pets.png',
              value: 0,
              hasChildren: false
            },
            {
              text: 'Point de vue',
              icon: '/photography.png',
              value: 1,
              hasChildren: false
            },
            {
              text: 'Poubelle',
              icon: '/tours.png',
              value: 2,
              hasChildren: false
            },
            {
              text: "Point d'eau",
              icon: '/default.png',
              value: 3,
              hasChildren: false
            },
            {
              text: 'Point de baignade',
              icon: '/swimming-pools.png',
              value: 4,
              hasChildren: false
            },
            {
              text: "Poteau d'orientation",
              icon: '/orientation.png',
              value: 5,
              hasChildren: false
            },
            {
              text: "Point d'intéret",
              icon: '/interest.png',
              value: 6,
              hasChildren: false
            },
            {
              text: 'Plage',
              icon: '/beach.png',
              value: 7,
              hasChildren: false
            }
          ]
        });
        await markermodify._execute(context, {
          _id: idMarker,
          title: 'New title',
          description: 'new',
          Type: 3,
          images: []
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).title,
          'New title'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).description,
          'new'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).Type,
          3
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).icon,
          '/default.png'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).images.length,
          0
        );
      });

      it('marker.modify : modifier un marqueur plage autorisée', async function () {
        await markermodify._execute(context, {
          _id: idMarker,
          title: 'Plage autorisée',
          description: 'new',
          Type: 7,
          subType: '0',
          images: []
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).title,
          'Plage autorisée'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).description,
          'new'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).Type,
          7
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).subType,
          '0'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).icon,
          '/beach_allowed.png'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).images.length,
          0
        );
      });

      it('marker.modify : modifier un marqueur plage sous condition', async function () {
        await markermodify._execute(context, {
          _id: idMarker,
          title: 'Plage sous condition',
          description: 'new',
          Type: 7,
          subType: '1',
          images: []
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).title,
          'Plage sous condition'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).description,
          'new'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).Type,
          7
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).subType,
          '1'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).icon,
          '/beach_underCondition.png'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).images.length,
          0
        );
      });

      it('marker.modify : modifier un marqueur plage interdite', async function () {
        await markermodify._execute(context, {
          _id: idMarker,
          title: 'plage interdite',
          description: 'new',
          Type: 7,
          subType: '2',
          images: []
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).title,
          'plage interdite'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).description,
          'new'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).Type,
          7
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).subType,
          '2'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).icon,
          '/beach_notallowed.png'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).images.length,
          0
        );
      });

      it('marker.modify : modifier un marqueur plage ne sais pas', async function () {
        await markermodify._execute(context, {
          _id: idMarker,
          title: 'plage ne sais pas',
          description: 'new',
          Type: 7,
          subType: '-1',
          images: []
        });

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).title,
          'plage ne sais pas'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).description,
          'new'
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).Type,
          7
        );
        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).subType,
          '-1'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).icon,
          '/beach.png'
        );

        assert.strictEqual(
          (await Markers.findOneAsync({ _id: idMarker })).images.length,
          0
        );
      });
    });
  });
  describe('methods loggued', () => {
    it('marker.modify : modifier un marqueur pas propriétaire', async function () {
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

      const otherContext = { userId: Random.id() };
      //  expect(function () {
      markermodify._execute(
        otherContext,
        {
          _id: idMarker,
          title: 'New title',
          description: 'new',
          Type: "Point d'eau",
          images: []
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markermodify.unauthorized'
          );
        }
      );
      /*  }).throw(
        "Vous n'êtes pas le propriétiare [Markers.methods.markermodify.unauthorized]"
      ); */
    });
  });
  describe('marker.add', () => {
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
    let idMarker;

    it('markeradd: Ajouter un marqueur', async function () {
      idMarker = await markeradd._execute(context, {
        position: { lat: 49.3, lng: 2.6 },
        title: 'New title',
        text: 'new',
        icon: '/test.png',
        Type: "Point d'eau"
      });

      expect((await Markers.findOneAsync({ _id: idMarker })).title).to.equal(
        'New title'
      );
      expect(
        (await Markers.findOneAsync({ _id: idMarker })).description
      ).to.equal('new');
      expect((await Markers.findOneAsync({ _id: idMarker })).icon).to.equal(
        '/test.png'
      );
      expect((await Markers.findOneAsync({ _id: idMarker })).Type).to.equal(
        "Point d'eau"
      );
      expect(
        (await Markers.findOneAsync({ _id: idMarker })).position.lat
      ).to.equal(49.3);
      expect(
        (await Markers.findOneAsync({ _id: idMarker })).position.lng
      ).to.equal(2.6);
    });

    it('markeradd: Ajouter un marqueur plage autorisée', async function () {
      let idMark = await markeradd._execute(context, {
        position: { lat: 49.3, lng: 2.6 },
        title: 'plage autorisée',
        text: 'new',
        icon: '/test.png',
        Type: '7',
        subType: '0'
      });

      expect((await Markers.findOneAsync({ _id: idMark })).title).to.equal(
        'plage autorisée'
      );
      expect(
        (await Markers.findOneAsync({ _id: idMark })).description
      ).to.equal('new');
      expect((await Markers.findOneAsync({ _id: idMark })).icon).to.equal(
        '/beach_allowed.png'
      );
      expect((await Markers.findOneAsync({ _id: idMark })).Type).to.equal('7');
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lat
      ).to.equal(49.3);
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lng
      ).to.equal(2.6);

      expect((await Markers.findOneAsync({ _id: idMark })).subType).to.equal(
        '0'
      );
    });

    it('markeradd: Ajouter un marqueur plage sous condition', async function () {
      let idMark = await markeradd._execute(context, {
        position: { lat: 49.3, lng: 2.6 },
        title: 'plage sous condition',
        text: 'new',
        icon: '/test.png',
        Type: '7',
        subType: '1'
      });

      expect((await Markers.findOneAsync({ _id: idMark })).title).to.equal(
        'plage sous condition'
      );
      expect(
        (await Markers.findOneAsync({ _id: idMark })).description
      ).to.equal('new');
      expect((await Markers.findOneAsync({ _id: idMark })).icon).to.equal(
        '/beach_underCondition.png'
      );
      expect((await Markers.findOneAsync({ _id: idMark })).Type).to.equal('7');
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lat
      ).to.equal(49.3);
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lng
      ).to.equal(2.6);

      expect((await Markers.findOneAsync({ _id: idMark })).subType).to.equal(
        '1'
      );
    });

    it('markeradd: Ajouter un marqueur plage non autorisée', async function () {
      let idMark = await markeradd._execute(context, {
        position: { lat: 49.3, lng: 2.6 },
        title: 'plage sous condition',
        text: 'new',
        icon: '/test.png',
        Type: '7',
        subType: '2'
      });

      expect((await Markers.findOneAsync({ _id: idMark })).title).to.equal(
        'plage sous condition'
      );
      expect(
        (await Markers.findOneAsync({ _id: idMark })).description
      ).to.equal('new');
      expect((await Markers.findOneAsync({ _id: idMark })).icon).to.equal(
        '/beach_notallowed.png'
      );
      expect((await Markers.findOneAsync({ _id: idMark })).Type).to.equal('7');
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lat
      ).to.equal(49.3);
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lng
      ).to.equal(2.6);

      expect((await Markers.findOneAsync({ _id: idMark })).subType).to.equal(
        '2'
      );
    });

    it('markeradd: Ajouter un marqueur plage ne sais pas', async function () {
      let idMark = await markeradd._execute(context, {
        position: { lat: 49.3, lng: 2.6 },
        title: 'plage ne sais pas',
        text: 'new',
        icon: '/beach.png',
        Type: '7',
        subType: '-1'
      });

      expect((await Markers.findOneAsync({ _id: idMark })).title).to.equal(
        'plage ne sais pas'
      );
      expect(
        (await Markers.findOneAsync({ _id: idMark })).description
      ).to.equal('new');
      expect((await Markers.findOneAsync({ _id: idMark })).icon).to.equal(
        '/beach.png'
      );
      expect((await Markers.findOneAsync({ _id: idMark })).Type).to.equal('7');
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lat
      ).to.equal(49.3);
      expect(
        (await Markers.findOneAsync({ _id: idMark })).position.lng
      ).to.equal(2.6);

      expect((await Markers.findOneAsync({ _id: idMark })).subType).to.equal(
        '-1'
      );
    });

    it('marker.addimage : Vous devez être loggué.', function () {
      //   expect(function () {
      markeraddimage.call(
        {
          idMarker,
          file
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markeraddimage.notloggued'
          );
        }
      );
      /*  }).to.throw(
        'Vous devez être loggué. [Markers.methods.markeraddimage.notloggued]'
      ); */
    });

    it("marker.addimage : Vous n'êtes pas le propriétiare", function () {
      //   expect(function () {
      markeraddimage._execute(
        { userId: Random.id() },
        {
          idMarker,
          file
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markeraddimage.unauthorized'
          );
        }
      );
      /*  }).to.throw(
        "Vous n'êtes pas le propriétiare [Markers.methods.markeraddimage.unauthorized]"
      ); */
    });

    it('marker.addimage : Effacement', async function () {
      await markeraddimage._execute(context, {
        idMarker,
        file
      });

      expect(
        await Markers.find({ 'images.asset_id': '123' }).countAsync()
      ).to.equal(1);
    });

    it('marker.delete : Vous devez être loggué.', function () {
      //expect(function () {
      markerdelete.call(
        {
          Id: idMarker
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markerdelete.notloggued'
          );
        }
      );
      /* }).to.throw(
        'Vous devez être loggué. [Markers.methods.markerdelete.notloggued]'
      ); */
    });

    it("marker.delete : Vous n'êtes pas le propriétiare", function () {
      //  expect(function () {
      markerdelete._execute(
        { userId: Random.id() },
        {
          Id: idMarker
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markerdelete.unauthorized'
          );
        }
      );
      /*  }).to.throw(
        "Vous n'êtes pas le propriétiare [Markers.methods.markerdelete.unauthorized]"
      ); */
    });

    it('marker.delete : Effacement', async function () {
      await markerdelete._execute(context, {
        Id: idMarker
      });

      expect(await Markers.find({ _id: idMarker }).countAsync()).to.equal(0);
    });
  });
}

if (Meteor.isServer) {
  describe('methods not loggued', () => {
    it('marker.modify : Vous devez être loggué ', async function () {
      //log.info("USERID : ", Meteor.userId());
      let idMarker = await Markers.insertAsync({
        position: [1, 2],
        OwnerId: 'id',
        Type: 'Type',
        icon: 'icon.png',
        description: 'Descr',
        title: 'Titre',
        like: 1,
        dislike: 0,
        SelectLike: ['id'],
        SelectDislike: []
      });

      //expect(function () {
      markermodify.call(
        {
          _id: idMarker,
          title: 'New title',
          description: 'new',
          Type: "Point d'eau",
          images: []
        },
        (err) => {
          assert.strictEqual(
            err.error,
            'Markers.methods.markermodify.notloggued'
          );
        }
      );
      /*  }).throw(
        'Vous devez être loggué. [Markers.methods.markermodify.notloggued]'
      ); */
    });
    it('marker.add : Vous devez être loggué ', function () {
      //log.info("USERID : ", Meteor.userId());

      //  expect(function () {
      markeradd.call(
        {
          position: { lat: 49.3, lng: 2.6 },
          title: 'New title',
          text: 'new',
          icon: '/test.png',
          Type: "Point d'eau"
        },
        (err) => {
          assert.strictEqual(err.error, 'Markers.methods.markeradd.notloggued');
        }
      );
      /*  }).throw(
        'Vous devez être loggué. [Markers.methods.markeradd.notloggued]'
      ); */
    });
  });
}
