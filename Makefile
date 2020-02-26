.RECIPEPREFIX = >

all: build

build:
> nikola build

open:
> xdg-open output/index.html