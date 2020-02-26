<!--
.. title: How to set up Black with Debian, PyCharm, and IdeaVim
.. slug: set-up-black-pycharm-ideavim
.. date: 2019-07-28 10:30:13 UTC+01:00
.. tags: Python, Black, Docker, Pycharm, IdeaVim, Tech
.. category: Tech
.. link: 
.. description: 
.. type: text
-->

I've come to like the code formatter [Black](https://black.readthedocs.io/en/stable/index.html) for Python.
It's opinionated, deterministic and thus very minimalistic.
And since I'm using it on more and more projects, I wanted to integrate it into my workflow.

So usually, you just install Black globally via `pip3 install black`.
But since I use Debian which still ships with Python 3.5
this yielded some smaller challenges as Black only runs under Python 3.6+.
This post is a small tutorial on how you can use Black on Debian and integrate it into the command line, PyCharm, and IdeaVim.
<!-- TEASER_END -->

## Challenge 1: Python 3.6+ on Debian
Since Debian currently ships with Python 3.5, I needed to get Python 3.6 running somehow.
While installing [Anaconda](https://www.anaconda.com/distribution/) or [Python 3.6+ manually](https://www.python.org/downloads/)
are other solutions [might](https://community.hortonworks.com/idea/212478/independent-python-vs-anaconda-python.html) [work](https://unix.stackexchange.com/q/332641),
I decided to simply use Docker, as this is what I use for my regular development anyhow.
Simplest solution was to use an existing docker image,
namely [jbbarth's docker-black](https://github.com/jbbarth/docker-black),
which allows you to mount the current working directory into a (newly created) container, format the desired file, and throw the container away afterwards.
Sounds more complicated than it is, you just run one single command et voila.
This method has the additional benefit that it adheres to any [pyproject.toml](https://github.com/psf/black#pyprojecttoml) which can store configuration like line length.
There's also a more sleek image at [cytopia/docker-black](https://github.com/cytopia/docker-black) which might take less space.

So to run black irrespective of your local Python installation via `black main.py`,
you run
```text
docker run --rm -v $(pwd):/code jbbarth/black main.py
```
This creates a new container, mounts the current working directory into `/code` and formats `main.py`.
Afterwards, the `--rm` flag will delete the container as well as the created volume.
So far, so good, but as this command is quote long, I had to build an alias to invoke it quickly as a next step.

## Challenge 2: Black from command line
So to avoid the cumbersome docker syntax each time, you now want an alias to just run `black main.py` everywhere.
To do this, you have to map the black command to your black running inside docker.
You can do this by adding
```text
black() { docker run --rm -v $(pwd):/code jbbarth/black $*; }
```
to your bashrc or zshrc.
After opening a new terminal, you should now be able to invoke the black formatter inside docker by running `black ...`.

## Challenge 3: Black in PyCharm
To now integrate this setup into PyCharm,
you have to slightly adapt the [offical installation instructions](https://black.readthedocs.io/en/stable/editor_integration.html#pycharm-intellij-idea).
Go to `File -> Settings -> Tools -> External Tools`.
Click the + icon to add a new external tool with the following values:

* Name: `Black`
* Description: `Black code formatter`
* Program: `/usr/bin/docker`
* Arguments: `run --rm -v $FilePath$:/$FilePath$ jbbarth/black "$FilePath$"`
* Working directory: `$ProjectFileDir$`

Test it by running it with an opened python file via `Tools -> External Tools -> Black`.
After you made sure it works, re-open it again and untick `open console` to avoid a new console at every run.
You can basically mirror this guide to install a file watcher
that formats on every save (see [the docs](https://black.readthedocs.io/en/stable/editor_integration.html#pycharm-intellij-idea)).

Note: As you can see, this only mounts the current file and thus does not adhere to any config files.
The same applies for the next step as it builds upon this one.

## Challenge 4: Black in IdeaVim
Now for the bonus part: to trigger this setup quickly from within IdeaVim and format the current file with a single command,
equivalent to the [regular vim plugin](https://black.readthedocs.io/en/stable/editor_integration.html#vim),
we have to map the `:Black` command to our external command in PyCharm.
To do this, we edit our `.ideavimrc` file where all IdeaVim configuration is stored,
and add the following line:
```text
command Black action Tool_External Tools_Black
```

Now typing `:Black` will re-format the current file.

## Summary
This tutorial showed you one way to include Black into you daily development (esp. on Debian).
If you have any questions or feedback, hit me up on Twitter [@karllorey](https://twitter.com/karllorey)
or any of the other platforms listed below.

## Notes
### Deleting all docker containers of a specific image
If you want to remove all containers derived from a specific image, e.g. if you forgot to add the --rm flag:
```text
docker rm $(docker ps -a --filter ancestor=jbbarth/black -q)
```
