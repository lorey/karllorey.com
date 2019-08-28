# karllorey.com

[![Build Status](https://travis-ci.org/lorey/karllorey.com.svg?branch=master)](https://travis-ci.org/lorey/karllorey.com)

The [personal site of Karl Lorey](https://karllorey.com). That would be me.
Built with minimalism in mind and Lektor.

## Test it
[Install Lektor](https://www.getlektor.com/docs/installation/) and run

```
lektor serve
```

## Build and deploy it
Deployment is set up via Travis CI and configured in the files `.travis.yml` and `.lektorproject`.
Each new commit to this repo will be pushed to the github pages branch of this repo.

You can also manually deploy via:
```
lektor build
lektor deploy
```
