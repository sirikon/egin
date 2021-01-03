#!/usr/bin/env bash
set -euo pipefail

sass \
    "${@}" --no-source-map \
    src/style.scss dist/style.css
