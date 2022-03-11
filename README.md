# karllorey.com

The [personal website of Karl Lorey](https://karllorey.com). That would be me.
Built with minimalism in mind, Next.js, and Taildwind.

- based on next.js' [blog starter](https://github.com/vercel/next.js/tree/bc0816f936213f81d2fae4cad8f15c9dd1087d1c/examples/blog-starter)
- locally hosted fonts with Fontsource

## Test it
Run it locally with docker:
```
docker-compse build
docker-compose up

// although dependencies are installed, 
// this will make sure to add node_modules to your working directory
// so the IDE and commands work properly
docker-compose exec app npm install
```

## Deployment
Deployment is done via Github Pages, see .github/workflows.
To set up:
- point your domain to Github servers
- set CNAME file in public
- enable gh-pages deployment
- set up access token used in deploy.yml