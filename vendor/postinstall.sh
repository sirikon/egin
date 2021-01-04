#!/usr/bin/env bash
set -euo pipefail

function main {
    copy-deps
    download-jasmine
}

function download-jasmine {
    JASMINE_VERSION="3.6.0"
    mkdir -p ../test/out
    (
        cd ../test/out
        rm -rf ./vendor
        rm -rf ./ziparchive
        mkdir -p ./vendor
        mkdir -p ./ziparchive

        curl -Lo "./ziparchive/jasmine.zip" \
            "https://github.com/jasmine/jasmine/releases/download/v${JASMINE_VERSION}/jasmine-standalone-${JASMINE_VERSION}.zip"
        cd ./ziparchive
        unzip "jasmine.zip"
        rm "jasmine.zip"
        cd ..
        mv "./ziparchive/lib/jasmine-${JASMINE_VERSION}/"* "./vendor"
        
        rm -rf ./ziparchive
    )
}

function copy-deps {
    mkdir -p ../dist/vendor
    (cd ../dist/vendor && rm -rf *)
    copy-dep "mithril" "mithril.min.js" "mithril.js"
    copy-dep "fast-json-patch" "dist/fast-json-patch.min.js" "fast-json-patch.js"
    copy-dep "hyperactiv" "dist/index.js" "hyperactiv.js"
    copy-dep "dropbox" "dist/Dropbox-sdk.min.js" "dropbox-sdk.js"
}

function copy-dep {
    package="${1}"
    path="${2}"
    dest="${3}"

    cp "./node_modules/${package}/${path}" "../dist/vendor/${dest}"
}

main
