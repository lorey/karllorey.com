# karllorey.com

[![Build Status](https://travis-ci.org/lorey/karllorey.com.svg?branch=master)](https://travis-ci.org/lorey/karllorey.com)

The [personal site of Karl Lorey](https://karllorey.com). That would be me.
Built with minimalism in mind and Nikola.

## Test it
Install the requirements inside `requirements.txt` and run

```
make
```

## Build and deploy it
If you're deploying for the first time to GitHub pages, pull the gh-pages branch first (if existing):
```text
git pull origin gh-pages
```
Then you can deploy with the following command (which will create a new commit in gh-pages):
```text
nikola github_deploy
```
