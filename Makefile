.RECIPEPREFIX = >

.PHONY: all build open

all: build open

build:
> nikola build

open:
> xdg-open output/index.html