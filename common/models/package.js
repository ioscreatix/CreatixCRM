'use strict';

var ar, fs, path, targz, ControlParser, hashFiles, uuid, zlib, debParser;
ar = require('ar-async');
fs = require('fs-extra');
path = require('path');
targz = require('tar.gz');
ControlParser = require('debian-control-parser');
hashFiles = require('hash-files');
zlib = require('zlib');
debParser = require('deb-ctrl-parser');

const uuidV4 = require('uuid/v4');

var CONTAINERS_URL = 'http://api.ioscreatix.com/api/containers/';

module.exports = function(Package) {
  Package.reload = function() {
    var PackagesFile = fs.createWriteStream('./client/dist/Packages', {
    });

    // PackagesFile.on('open', function(fd) {
    Package.find({include: {
      versions: 'file'
    }}, function(err, packages) {
      console.log(packages);
      packages.forEach(function(packageObject) {
        packageObject = packageObject.toJSON();
        console.log(packageObject.versions);
        packageObject.versions.forEach(function(packageVersion) {
           // var packageJSON = packageObject.toJSON();
          PackagesFile.write('Package: ' + packageObject.identifier + '\n' +
            'Section: ' + 'Tweaks' + '\n' +
            'Version: ' + packageVersion.version + '\n' +
            'Maintainer: ' + packageObject.maintainer + '\n' +
            'Depends: ' + packageVersion.dependencies + '\n' +
            'Filename: ' + packageVersion.file.url + '\n' +
            'Size: ' + packageVersion.file.size + '\n' +
            'Architecture: ' + 'iphoneos-arm' + '\n' +
            'Description: ' + packageObject.shortDescription + '\n' +
            'Name: ' + packageObject.name + '\n' +
            'Author: ' + packageObject.author + '\n' +
            'Depiction: ' + 'http://repo.ioscreatix.com/index.php?pid=130' + '\n' +
            'MD5sum: ' + packageVersion.file.md5 + '\n' +
            'SHA1: ' + packageVersion.file.sha1 + '\n' +
            'SHA256: ' + packageVersion.file.sha256 + '\n' +
            'Installed-Size: ' + packageVersion.raw['Installed-Size'] + '\n' + '\n'
          );
        });
      });

      PackagesFile.end();

      fs.createReadStream('./client/dist/Packages').pipe(zlib.createGzip()).pipe(fs.createWriteStream('./client/dist/Packages.gz'));
    });
  };
  Package.upload = function(ctx, options, cb) {
    console.log('Got Package');
    if (!options) options = {};

    ctx.req.params.container = 'packages';

    // ctx.req.form.complete(function (err, fields, files) {
    //   console.log(files);

   // console.log(ctx);
    // });
   // ctx.res.writeHead(200, {'Content-Type': 'application/vnd.debian.binary-package'});
   // console.log(ctx.req);
    Package.app.models.Container.upload('packages', ctx.req, function(err, fileObj, controlData) {
      // console.log(err);
      console.log('upload thing');
      if (err) {
        return cb(err);
      } else {
        var fileInfo = fileObj.metadata;
        var obj = {
          size: fileObj.length,
          name: fileObj.filename,
          type: fileInfo.mimetype,
          md5: fileObj.md5,
          sha1: fileInfo.sha1,
          sha256: fileInfo.sha256,
          date: Date.now(),
          container: fileInfo.container,
          url: CONTAINERS_URL + fileInfo.container + '/download/' + fileObj._id
        };

        var stanza = controlData;
        Package.findOrCreate({
          where: {
            identifier: stanza.Package
          }
        }, {
          name: stanza.Name,
          identifier: stanza.Package,
          author: stanza['Author'],
          maintainer: stanza['Maintainer'],
          latest: stanza['Version'] ? stanza['Version'] : '0.0.1',
          stage: stanza['Stage'] ? stanza['Stage'] : 'Stable',
          accountId: ctx.req.accessToken.userId
        }, function(packageError, packageObject, packageCreated) {
          if (packageError) {
            console.log(packageError);
            cb(packageError);
            return;
          } else {
            if (!packageCreated) {
              if (stanza['Version']) {
                packageObject.latest = stanza['Version'];
                packageObject.save();
              }
            }
            Package.app.models.PackageVersion.create({
              version: stanza['Version'] ? stanza['Version'] : '0.0.1',
              packageId: packageObject.id,
              dependencies: stanza['Depends'],
              raw: stanza
            }, function(packageVersionError, packageVersionObject) {
              if (packageVersionError) {
                console.log(packageVersionError);
                cb(packageVersionError);
                return;
              } else {
                obj['packageVersionId'] = packageVersionObject.id;
                Package.app.models.PackageFile.create(obj, function(packageFileError, packageFileObject) {
                  if (packageFileError) {
                    console.log(packageFileError);
                    cb(packageFileError);
                    return;
                  } else {
                    cb(null, packageObject);
                    Package.reload();
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  Package.remoteMethod(
        'upload', {
          description: 'Uploads a Debian Package to the Repository',
          accepts: [{
            arg: 'ctx',
            type: 'object',
            http: {
              source: 'context'
            }
          }, {
            arg: 'options',
            type: 'object',
            http: {
              source: 'query'
            }
          }],
          returns: {
            arg: 'fileObject',
            type: 'object',
            root: true
          },
          http: {
            verb: 'post'
          }
        }
    );
};
