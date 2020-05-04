<!--
.. title: Install and run Django completely inside Docker
.. slug: install-and-run-django-inside-docker
.. date: 2020-05-03 13:33:57 UTC+02:00
.. tags: Django, Docker, Python, Tech
.. category: Tech
.. link: 
.. description: 
.. type: text
-->

This guide will show you how to install Django inside Docker with docker-compose 
and without installing any dependencies on the host system.
Since there are a few quirks and I have to look it up myself every damn time,
here's a guide hopefully helping me and other the next time.

This guide will:

- help you install the newest version of django inside your docker container
- be independent of your host OS and python version, so you can always get the newest version inside docker
- provide a basic setup of django inside docker with docker-compose to build upon
<!-- TEASER_END -->

# Basic requirements file
Start with a requirements.txt file containing only:
```
django
```
Save it as `requirements.txt`.

# Basic Dockerfile
Firstly, a Dockerfile is needed to set up and run our project.
We'll use a basic version you can expand later.
It uses Python 3.8, installs all dependencies from your `requirements.txt` file,
and then copies your project files into the image.

So copy this in your `Dockerfile`:

```Dockerfile
FROM python:3.8

WORKDIR /code

# copy and install requirements first 
# -> speeds up build if requirements haven't changed
COPY requirements.txt /code/
RUN pip install -r requirements.txt

# copy rest of files
# (not needed since we also mount a volume, 
# but you won't mount in production)
COPY . /code/
```

# Basic docker-compose
In `docker-compose.yml`:

```yaml
version: '3'

services:
  web:
    build: .
    volumes:
      - .:/code/
    command: bash
    tty: True
    ports:
    # external is the port you use on your host, i.e. localhost:8000
    # internal is the port django uses inside the container
    # format: external:internal 
    - "8000:8000"
```

# Running it all
After having set up the above files, run the following steps:

1. Run `docker-compose build` to build the images.
2. Run `docker-compose up` to start the container, leave it running.
3. Run `docker-compose exec web pip freeze > requirements.txt` to pin the installed dependencies to their actual version. `requirements.txt` should now contain version numbers.
4. Run `docker-compose exec web django-admin startproject YOURNAME .` (mind the dot!) to start a new django project in the current directory.
5. Run `sudo chown -R $USER ./` to own the docker-generated files. Otherwise you'll get file permission problems when working with the generated files on your host (outside of docker).
6. Run `docker-compose exec web python ./manage.py runserver 0.0.0.0:8000`.

You should now be able to access a congratulations page at `localhost:8000`.

# Next steps
If you're interested in setting up Django for production, 
feel free to check out my guide on 
[how to set up Django deployment for production](http://karllorey.com/posts/django-production-docker-mod-wsgi/) for the same stack.

# Note: Changing ports
If you want to change the port to access your Django application, 
you only have to change the external port, i.e. the `docker-compose.yml` file.
So to switch to port 80, change the line below `ports:` to
```yaml
ports:
- "80:8000"
```
Then the container can be accessed with `localhost:80` or just `localhost` (as 80 is the default).