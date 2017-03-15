
# Pattern Lab Node - Starter Template
This is my customized starter template for [Pattern Lab Node - Gulp Edition](https://github.com/pattern-lab/edition-node-gulp). If you are using Sass and ES6 in your Pattern Lab prototype, there is a decent amount of configuration needed before you are up and running. Hence, the purpose of this repo is to give a leg-up to those aiming to use those tools inside of a Pattern Lab project. With that said, certain directories, and both `patternlab-config.json` and `.gulpfile` have been changed to meet these needs.  


 
## Prerequisites   
Before getting started with this template you should have a base understanding of the Pattern Lab v2.0 API. You should also check out the README for Pattern Lab Node - Gulp Edition [here](https://github.com/pattern-lab/edition-node-gulp).

> The Pattern Lab Node - Gulp Edition uses [Node](https://nodejs.org) for core processing, [npm](https://www.npmjs.com/) to manage project dependencies, and [gulp.js](http://gulpjs.com/) to run tasks and interface with the core library. Node version 4 or higher suffices. You can follow the directions for [installing Node](https://nodejs.org/en/download/) on the Node website if you haven't done so already. Installation of Node will include npm.

> It's also highly recommended that you [install gulp](hhttps://github.com/gulpjs/gulp/blob/4.0/docs/getting-started.md) globally.

> Note: The Gulp Edition of Pattern Lab uses Gulp 4, which may require a new global install of the Gulp command line interface. Follow the [gulp upgrade instructions](https://github.com/pattern-lab/edition-node-gulp/wiki/Updating-to-Gulp-4) if you already have gulp installed and need to upgrade. Gulp 4 is in alpha, but brings many benefits to the table and is relatively stable. You can alternatively [run with local gulp instead of global gulp](https://github.com/pattern-lab/patternlab-node/wiki/Running-with-Local-Gulp-Instead-of-Global-Gulp), but commands are a bit more verbose. The rest of this documentation assumes a global install.



## Quick Start

### Starter Template Features
Below are some of the added benefits of using this template to build your Pattern Lab project:

* gzip compression and minification of CSS 
* SCSS compilation (with sourcemaps and autoprefixer) added to existing build task  
* sass-lint gulp task and config 
* imagemin gulp task and config (for production build)
* babel transpilation and config (es2015 preset) added to existing build task

### Useful Commands
* `gulp sass-lint`              : runs the sass-lint process on files inside of _/source/scss_ directory
* `gulp imagemin`               : runs image minification on all files inside of _/source/images_ and outputs them to _/public/images/minified_
* `gulp patternlab:build`       : builds all assets for development  
* `gulp patternlab:watch`       : builds all assets for development and watches file changes 
* `gulp patternlab:serve`       : builds all assets for development, watches file changes, and starts local server 
* `gulp patternlab:prod-build`  : builds all assets for production (see details below for Javascript and Sass builds)


## SCSS Build Process
To ensure your .scss files are compiled put your source code inside of */source/scss* (instead of the default */source/css* directory). 

### Development
Features of development build: 
    * sourcemaps
    * Sass compilation
    * autoprefixer (see [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) for details)
    * post-compilation size preview in console (gzipped size).
    * gzip compression  
    * outputs compiled and gzipped CSS files to _/public/css_
        + also outputs human-readable CSS file into _/source/scss_ for debugging  

The following command will trigger SCSS compilation for development: 
> `gulp dev:styles`      

### Production
Features of production build: 
    * Sass compilation
    * autoprefixer (see [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) for details)
    * clean-css with size preview in console (see [gulp-clean-css]() for details)
    * minification 
    * gzip compression  
    * outputs compiled and gzipped CSS files to _/public/css_ 

The following command will trigger SCSS compilation for production: 
> `gulp prod:styles`       
      


## Javascript Build Process
To ensure your JS is compiled using babel put your source code inside of */source/js/src* (instead of the default */source/js* directory). 

### Development
Features of development build: 
    * sourcemaps
    * babel compilation (es2015 preset)
    * outputs compiled Javascript files to _/public/js_  

The following commands will trigger JS compilation for development: 
> `gulp dev:scripts`            

### Production
Features of production build: 
    * babel compilation (es2015 preset)
    * bundled output 
    * uglification 
    * outputs _app.js_ to _/public/js/dist_  

The following commands will trigger JS compilation for production: 
> `gulp prod:scripts`       



## Updating Pattern Lab
To update Pattern Lab please refer to each component's GitHub repository, and the [master instructions for core](https://github.com/pattern-lab/patternlab-node/wiki/Upgrading). The components are listed at the top of the README.
