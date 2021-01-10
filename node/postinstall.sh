#!/usr/bin/env bash
set -euo pipefail

function main {
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

main
