#!/bin/bash

current_branch=$(git rev-parse --abbrev-ref HEAD)

if [ "$current_branch" != "release" ]; then
  echo "Error: Current branch not 'release'. Release impossible you are on '$current_branch'."
  exit 1
fi

echo "Current branch — 'release'."
exit 0
