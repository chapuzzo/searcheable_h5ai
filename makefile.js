/*jshint node: true */
'use strict';


var path = require('path'),

	pkg = require('./package.json'),

	root = path.resolve(__dirname),
	src = path.join(root, 'src'),
	build = path.join(root, 'build'),

	jshint = {
		// Enforcing Options
		bitwise: true,
		curly: true,
		eqeqeq: true,
		forin: true,
		latedef: true,
		newcap: true,
		noempty: true,
		plusplus: true,
		trailing: true,
		undef: true,

		// Environments
		browser: true,

		// Globals
		predef: [
			'modulejs'
		]
	},

	handlebarsEnv = {
		pkg: pkg
	},

	mapSrc = function (blob) {

		return blob.source.replace(src, build).replace(/\.less$/, '.css').replace(/\.jade$/, '');
	},

	mapRoot = function (blob) {

		return blob.source.replace(root, path.join(build, '_h5ai'));
	};


module.exports = function (make) {

	var Event = make.Event,
		$ = make.fQuery,
		moment = make.moment;

	
	make.version('>=0.8.1');
	make.defaults('build');


	make.before(function () {

		handlebarsEnv.stamp = moment().format('YYYY-MM-DD HH:mm:ss');
	});


	make.target('check-version', [], 'add git info to dev builds').async(function (done, fail) {

		if (!/-dev$/.test(pkg.version)) {
			done();
			return;
		}

		$.git(root, function (err, result) {

			pkg.version += '-' + result.revListOriginMasterHead.length + '-' + result.revParseHead.slice(0, 7);
			Event.info({
				method: 'check-version',
				message: 'version set to ' + pkg.version
			});
			done();
		});
	});


	make.target('clean', [], 'delete build folder').sync(function () {

		$.rmfr($.I_AM_SURE, build);
	});


	make.target('lint', [], 'lint all JavaScript files with JSHint').sync(function () {

		$(src + '/_h5ai/client/js: **/*.js, ! lib/**')
			.jshint(jshint);
	});

	make.target('tl', ['build-uncompressed'], 'ln to a test directory with lots of subdir').sync(function (){
		$.rmfr($.I_AM_SURE, build+'/prova');
		var cp = require('child_process');
		cp.exec('ln -sf /home/luis/sandbox/jsonizer/prova '+build+'/prova', function (error, stdout, stderr) {
		  console.log(stdout);
		  console.log(stderr);

		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		});


	});


	make.target('build', ['check-version'], 'build all updated files').sync(function () {

		$(src + ': _h5ai/client/js/*.js')
			.modified(mapSrc, $(src + ': _h5ai/client/js/**'))
			.includify()
			.uglifyjs()
			.write($.OVERWRITE, mapSrc);

		$(src + ': _h5ai/client/css/*.less')
			.modified(mapSrc, $(src + ': _h5ai/client/css/**, ! _h5ai/client/css/*.css'))
			.less()
			.cssmin()
			.write($.OVERWRITE, mapSrc);

		$(src +  ': _h5ai/client/css/*.css')
			.modified(mapSrc, $(src + ': _h5ai/client/css/*.css'))
			/*.cssmin()*/
			.write($.OVERWRITE, mapSrc);

		$(src + ': **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.jade({pretty:true})
			.write($.OVERWRITE, mapSrc);

		$(src + ': **, ! _h5ai/client/js/**, ! _h5ai/client/css/**, ! **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.write($.OVERWRITE, mapSrc);

		$(root + ': README*, LICENSE*')
			.modified(mapRoot)
			.write($.OVERWRITE, mapRoot);
	});


	make.target('build-uncompressed', ['check-version'], 'build all updated files without compression').sync(function () {

		$(src + ': _h5ai/client/js/*.js')
			.modified(mapSrc, $(src + ': _h5ai/client/js/**'))
			.includify()
			// .uglifyjs()
			.write($.OVERWRITE, mapSrc);

		$(src + ': _h5ai/client/css/*.less')
			.modified(mapSrc, $(src + ': _h5ai/client/css/**, ! _h5ai/client/css/*.css'))
			.less()
			// .cssmin()
			.write($.OVERWRITE, mapSrc);

		$(src +  ': _h5ai/client/css/*.css')
			.modified(mapSrc, $(src + ': _h5ai/client/css/*.css'))
			/*.cssmin()*/
			.write($.OVERWRITE, mapSrc);

		$(src + ': **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.jade({pretty:true})
			.write($.OVERWRITE, mapSrc);

		$(src + ': **, ! _h5ai/client/js/**, ! _h5ai/client/css/**, ! **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.write($.OVERWRITE, mapSrc);

		$(root + ': README*, LICENSE*')
			.modified(mapRoot)
			.write($.OVERWRITE, mapRoot);
	});


	make.target('release', ['clean', 'build'], 'create a zipball').async(function (done, fail) {

		$(build + ': **').shzip({
			target: path.join(build, pkg.name + '-' + pkg.version + '.zip'),
			dir: build,
			callback: done
		});
	});
};
