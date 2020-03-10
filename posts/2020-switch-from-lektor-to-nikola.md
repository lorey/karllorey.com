<!--
.. title: Switching from Lektor to Nikola (static site generators)
.. slug: switch-from-lektor-to-nikola
.. date: 2020-03-10 17:03:35 UTC+01:00
.. tags: Python, Lektor, Nikola, Tech
.. category: Tech 
.. link: 
.. description: 
.. type: text
.. status:
-->

I decided to migrate this website/blog from Lektor to Nikola.
Both are static site generators 
implemented in Python 
that allow you to generate a static, secure, and maintenance-free website/blog.
Here is my experience, why I did it, how to do it, and what to expect.
In short: While I liked Lektor for its simplicity,
it lacked several features I needed.
So far, Nikola has these features and many more
which is why I'm very happy to have switched.
Read the rest of the pros and cons here.
<!-- TEASER_END -->

# Background: Static Site Generators
Both Lektor and Nikola are Static Site Generators (SSG) implemented in Python.
You basically create everything on your computer and the the generator generates HTML
which can be hosted on GitHub or almost everywhere without any hassle.
Besides, it's blazing fast, secure, and needs no server configuration/maintenance.
Find an overview at [Full Stack Python](https://www.fullstackpython.com/static-site-generator.html).

# Lektor vs. Nikola
When I created this website, I chose Lektor for it's simplicity.
Compared to Wordpress, which I had used before, it was easy to set up and maintain.

## Why not Lektor?
* to little default markup: the site did not rank for quite some time which might be due to litte semantic markup
* it especially misses several essential features to rank and make the site visible 
  * no RSS feed by default which allows search engines to discover new posts quickly
  * no meta tags which would enable nice previews on social media (OpenGraph for Facebook, etc.)
* default directory structure: blog posts in Lektor all have an own folder containing a file named contents.lr.
  While this looks trivial and helps with structuring files belonging to a post, I simply did not like it too much.
* Lektor does not use regular virtualenv environments which just makes stuff a little trickier to understand
* the ecosystem is small, there are not many plugins, and development seems to have halted

## Why Nikola?
Again, this is highly opinionated.

* most-active repository compared to [Lektor](https://github.com/lektor/lektor), [Pelican](https://github.com/getpelican/pelican), [MkDocs](https://github.com/mkdocs/mkdocs/), [mynt](https://github.com/Anomareh/mynt), and other static site generators in Python
* seamless integration of blog posts and regular pages
* clear documentation
* lots(!) of features and configuration options
* RSS feeds, tags, categories, blog archives, etc.
* themes with semantic HTML 

# Switching from Lektor to Nikola
I basically set up a clean Nikola project and then adapted my old content.
Here's what I did with a rough time estimation:

* Reading the docs and getting started (30m)
* Setting up a clean project within my existing repo (30m)
* Renaming articles and sites (15m)
* adding Nikola-specific markdown headers (5m per site/article)
* formatting code blocks to leverage syntax highlighting and fixing markdown errors (30m)
* integrating my existing theme into Nikola (2h)
* setting up deployment on Travis CI (30m)

# What I like so far
* a lot of functionality with sane defaults
* whole transition took me less than one day, no weird errors, no frustration
* clean structure that enables (even hierarchical) posts and pages without any issues
* super fast deployment setup with github (took me one minute)
* great default/base templates with mako or jinja as a templating engine that can be adapted really easily

# What I don't like so far
* The config file is huge and includes a lot of documentation, basically very similar to Django.
  While I like to configure stuff, it's hard to find settings and understand all implications.
* Lektor has an amazing concept to define own models, I haven't figured out how to do something similar in Nikola, e.g. for my [CV](/founder).
* There are not many templates available. I've also found my template to be quite messy and without clean syntax.
* There's a plugin system heavily relying on [doit](https://pydoit.org/) which makes site-creation very efficient but extending as a result rather difficult to understand. For example, I don't know how to insert a list of all subpages into the the current page which should be quite easy.

# Issues
If you're also getting started, here are the issues I ran into.
As I said, not many and not frustrating :)

## Overwriting themes
While there are a few basic and advanced themes you can build upon,
it took me quite some time to find out where these themes can be found.
This is necessary to understand which files there are and which files you need to overwrite to adapt a theme.
Basically most templates you can inherit from can be found at [nikola-themes](https://github.com/getnikola/nikola-themes)
but some basic templates are stored within [Nikola itself](https://github.com/getnikola/nikola/tree/c886ea38f7ee34f1fffb3edae7087694483a999d/nikola/data/themes).
If you've understood this, you basically just copy/paste the files you want to adapt inside your own theme
which works really nice.


## Deployment with existing gh-pages
Since I had previously set up Lektor deployment via GitHub Pages, I already had a `gh-pages` branch.
So when I tried to deploy via `nikola github_deploy`, I got the following error:
```text
To github.com:lorey/karllorey.com.git
 ! [rejected]        gh-pages -> gh-pages (fetch first)
error: failed to push some refs to 'git@github.com:lorey/karllorey.com.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
# ... stacktrace
[2020-02-25T15:12:28Z] ERROR: github_deploy: Failed GitHub deployment -- command ['ghp-import', '-n', '-m', 'Nikola auto commit.\n\nSource commit: 5d74f162affaf80691de1d7c7b0d8728addea96a\nNikola version: 8.0.4', '-p', '-r', 'origin', '-b', 'gh-pages', 'output'] returned 1
```
Obviously, I forgot to pull the gh-pages branch first, so the new commit could be added on top.
After doing a `git pull origin gh-pages`, deploying worked like a charm.

## Deployment with Travis CI
To deploy with Travis CI, there's a great [post on the Nikola blog](https://getnikola.com/blog/automating-nikola-rebuilds-with-travis-ci.html).
What I did not understand at first was the distinction between the `master` and a `src` branch.
So the `src` branch is used for user pages that are deployed into the master branch, i.e. when you have a site pointing to you username, e.g. `lorey.github.io`.
If you do that, you have to use another branch to deploy to avoid an infinite loop (push to master > deploy to master > ...).
Since I use `gh-pages` as the branch containing all the generated HTML, I set up .travis.yml to deploy on pushes to master.
In the `conf.py` I still set:
```python
GITHUB_SOURCE_BRANCH = 'src'
```
Seems to work fine.

Another thing I encountered when setting up Travis CI:
Somehow the travis gem had issues when logging in so `travis login` and `travis enable` did not work.
Maybe because I use an old version or have 2FA enabled.
In the end I just ran `travis encrypt-file id_rsa --add` which worked fine and added a line to .travis.yml
storing the encrypted key.

Doing a `git branch master FETCH_HEAD` inside the .travis.yml failed:
```text
$ git branch master FETCH_HEAD
fatal: A branch named 'master' already exists.
The command "git branch master FETCH_HEAD" failed and exited with 128 during .
```