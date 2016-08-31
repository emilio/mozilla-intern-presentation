
.PHONY: all
all: potential.index.html

# index.pdf: index.md Makefile
# 	pandoc --from=markdown --latex-engine=xelatex --to=beamer $< -o $@ -s

potential.index.html: index.md Makefile
	pandoc --from=markdown --to=revealjs $< -o $@ -s
