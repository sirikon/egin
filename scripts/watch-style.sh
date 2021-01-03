#!/usr/bin/env bash
set -euo pipefail

sass \
    --watch --no-source-map \
    src/style.scss dist/style.css
