#!/bin/sh

# used for extracting versions from git commit description.
# will append `staging-` before version is found.

REPO=${1?No repository provided.}; shift
TEXT=${1?No commit message provided.}; shift

PATTERN="\[$REPO:\s*([^] ]*)\s*\]"

VERSION=$(echo "$TEXT" | sed -rn "s/.*$PATTERN.*/\1/p")
echo ${VERSION:+staging-}${VERSION:=latest}
