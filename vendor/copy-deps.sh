#!/usr/bin/env bash
set -euo pipefail

function copy-dep {
    package="${1}"
    path="${2}"
    dest="${3}"

    cp "./node_modules/${package}/${path}" "../dist/vendor/${dest}"
}

mkdir -p ../dist/vendor

copy-dep "mithril" "mithril.min.js" "mithril.js"
copy-dep "fast-json-patch" "dist/fast-json-patch.min.js" "fast-json-patch.js"
copy-dep "hyperactiv" "dist/index.js" "hyperactiv.js"
copy-dep "dropbox" "dist/Dropbox-sdk.min.js" "dropbox-sdk.js"
