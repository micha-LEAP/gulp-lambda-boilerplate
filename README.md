# Gulp-Browserify Lambda Boilerplate

The goal of this project is to show a proof of concept build pipeline for deploying bundled aws-lambda nodejs executibles.

## Features

1. Can view and edit deployed lambda in Amazon Lambda console.
  * possible because the lambda has not external dependencies.
2. Extensible build pipeline.
  * adding new build steps is trivial and extensible
3. Pre-deploy testing
  * Mocha will stop the deploy if the tests fail

### Results

The purpose of this experiment was to see if bundling lambda functions as a self contained executible can help solve the [jaws-stack](https://github.com/jaws-stack/JAWS) issues described here:

  * [Mitigating AWS Lamdbda limits](https://github.com/jaws-stack/JAWS/issues/28)
  * [Multi-stage, local test, CloudFormation](https://github.com/jaws-stack/JAWS/pull/42)

##### "Hello World"

This is a trivial lambda that is only includes one small external dependency.

* current JAWS: 2.2 MB
* gulp-browserify JAWS: 658 BYTES

##### "React-SSR"

A little heavier example that imports the `react` and `moment` libraries.

[source]()

* current JAWS:
* gulp-browserify JAWS:

### Installation

1. `git clone git@github.com:austinrivas/gulp-lambda-boilerplate.git`
2. `cd gulp-lambda-boilerplate`
3. `npm install`
4. Update your credentials in `sample.env` and rename to `.env`
5. Update your `lambda.json` [OPTIONAL]


### Tasks

The two main tasks for this demo are `gulp build` & `gulp deploy`, both skip code optimization by passing `--dev` flag.

`gulp deploy` implements `gulp build`, so there is no need to build before deploying.

#### `gulp clean`

Removes any existing builds. Deletes the `./dist` dir and `./dist.zip`

#### `gulp js`

Bundles the lambda and its dependencies. Places the bundled `index.js` in the `./dist` dir.

The optional `--dev` flag skips code optimization.

#### `gulp test`

Runs the mocha tests found at `./test/test.js` against the compiled lambda at `./dist/index.js`.

`gulp build` & `gulp deploy` run `gulp test` as part of their pipeline.

If an error is returned the build is terminated.

#### `gulp zip`

Zips `./dist` directory. Current implementation is naive, but can be made extensible.

#### `gulp deploy`

Deploys `./dist.zip` to the using the same method as [JAWS deploy command @furf redux](https://github.com/furf/JAWS/blob/improvement/jaws-deploy-update/cli/lib/main.js).

`gulp deploy --dev` will deploy the non optimized `index.js`.


### References

* [A Gulp Workflow for Amazon Lambda](https://medium.com/@AdamRNeary/a-gulp-workflow-for-amazon-lambda-61c2afd723b6)
* [Browserify-Uglify Docs](https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md)
* [JAWS deploy command @furf redux](https://github.com/furf/JAWS/blob/improvement/jaws-deploy-update/cli/lib/main.js)
* [adamrneary/adventr-lambda-video](https://github.com/adamrneary/adventr-lambda-video)
