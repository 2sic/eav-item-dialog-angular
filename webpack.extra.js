const webpack = require('webpack');

var configuration = {
  // This ensures that much of the code is externalized into a separate package
    "externals": {
        "rxjs": "rxjs",
        "@angular/core": "ng.core",
        "@angular/common": "ng.common",
        "@angular/platform-browser": "ng.platformBrowser",
        "@angular/elements": "ng.elements"
    },
}

/*
  2dm: change source map generation based on production mode
  our goal is to not include source maps in the distribution
  but have them when developing
*/

const nodeEnv = (process.env.NODE_ENV || 'development').trim(); // trim is important because of an issue with package.json
const isProd = nodeEnv === 'production';
const ifProd = x => isProd && x;
var pjson = require('./package.json');

console.log('isprod' + isProd + '; process.env...' + process.env.NODE_ENV);

if(isProd) {
  // devTool option is not needed anymore for prod
  // but for development it's just easier to use then SourceMapDevToolPlugin
  configuration.devtool = false;

  configuration.plugins = [
        // ... other plugins
        ifProd(new webpack.SourceMapDevToolPlugin({
            // this is the url of our local sourcemap server
            publicPath: 'https://sources.2sxc.org/' + pjson.version + '/ng-edit/',
            filename: '[file].map',
        })),
      ];
}

module.exports = configuration;
