Working with the ``@joincivil/civil-sdk`` package
=================================================

The ``build`` and ``start`` package.json scripts create standalone build files for sdk integrations. To work with these tools and components as a JS package for import elsewhere, e.g. the `Civil monorepo`_, use ``package:build`` and ``package:watch``.

Local development alongside Civil monorepo
------------------------------------------

Use ``yarn link`` everywhere. Link the monorepo packages used by sdk into sdk (currently just ``@joincivil/core``, ``@joincivil/components``, and ``@joincivil/utils``) and link ``@joincivil/civil-sdk`` into monorepo root.

Releasing updates to Civil monorepo
-----------------------------------

* If updates in this repo depend on updates in the monorepo:

    * Merge monorepo updates to master

    * Run ``lerna publish`` to publish monorepo updates to npm

    * Update monorepo package version numbers in civil-sdk and ``yarn install``

        * Note that it’s safest to update version numbers of all packages at once. E.g. if you only made an update in ``core``, don’t just update ``core`` in civil-sdk, because civil-sdk also uses ``components``, which also imports ``core``, and if you update one and not the other you’ll end up with separate versions of ``core``.

* Merge civil-sdk updates to master.

    * A release will automatically be created and published to npm - you’ll receive an email and a comment on the PR

    * Note that the release type (major, minor, patch) depends on the commit types involved (e.g. ``feat`` -> minor, ``fix`` -> patch) and that some commit types (e.g. ``chore``) don’t trigger releases at all.

    * *Note*: The husky/commit lint check is not case sensitive, but the release determination is. This means that ``Feat: Commit message`` is a valid commit, but won’t trigger a release!

* Once the civil-sdk update has published to npm, update the version in monorepo and deploy

.. _Civil monorepo: https://github.com/joincivil/Civil