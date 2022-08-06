#!/usr/bin/env bash

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

set -euo pipefail

SOURCE_PATH="$(cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")" )" && pwd)"

source "${SOURCE_PATH}/scripts/conf.sh"

##############################################################
#
# Sync command wrapper about copy from content from src to
# dest. It will create a directory for dest to make sure the
# rsync, and support rsync options.
#
# Arguments:
#
#   src: rsync source parameter
#   dest: rsync destent parameter
#   rsync options: rsync command options
#
##############################################################
function rsync_wrapper() {
    local src="${1}"
    local dest="${2}"
    local dir_flag=""
    # Create directory
    if [ -d "${src}" ]; then
        mkdir -p "${dest}"
        dir_flag="/"
    else
        mkdir -p "$(dirname "${dest}")"
    fi
    if [ "$#" -eq 2 ]; then
        rsync -av ${src}${dir_flag} "${dest}"
    else
        rsync -av ${3} ${src}${dir_flag} "${dest}"
    fi
}

##############################################################
#
# Rsync history document, from cloned repo
# apache/dolphinscheduler-website branch `history-docs`, to
# directory `docs` and `img`.
#
##############################################################
function rsync_history_docs() {
    for version in "${HISTORY_DOCS_VERSIONS[@]}"; do
        echo "   --> Sync version ${version} content"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/docs/en" "${PROJECT_SITE_DOC_DIR}/en-us/${version}/user_doc"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/docs/zh" "${PROJECT_SITE_DOC_DIR}/zh-cn/${version}/user_doc"

        echo "  ---> Sync version ${version} configs."
        local config_file_stem="docs${version//./-}"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/configs/${config_file_stem}.js" "${SOURCE_PATH}/site_config/${config_file_stem}.js"
    done

    echo "  ---> Sync history img in batch mode."
    rsync_wrapper "${PROJECT_WEBSITE_DIR}/img"/ "${SOURCE_PATH}/img"
}

##############################################################
#
# Rsync released document, from cloned repo
# apache/dolphinscheduler tags after we migrate docs to the
# main repo(after 3.0.0-alpha), to directory `docs`, `img` and
# `site_config`.
#
##############################################################
function rsync_released_docs() {
    echo "  ---> Directory change to ${PROJECT_DIR}."
    cd "${PROJECT_DIR}"

    for version_branch in "${DEV_RELEASE_DOCS_VERSIONS[@]}"; do
        local version="${version_branch%%:*}"
        local branch="${version_branch##*:}"

        echo "  ---> Git checkout to version ${version}."
        git fetch origin "${branch}" --no-tags
        git checkout -b "${version}" FETCH_HEAD

        echo "  ---> Sync released version ${version} docs."
        rsync_wrapper "${PROJECT_DIR}/docs/docs/en" "${PROJECT_SITE_DOC_DIR}/en-us/${version}/user_doc" "--exclude=faq.md --exclude=history-versions.md --exclude=development"
        rsync_wrapper "${PROJECT_DIR}/docs/docs/zh" "${PROJECT_SITE_DOC_DIR}/zh-cn/${version}/user_doc" "--exclude=faq.md --exclude=history-versions.md --exclude=development"

        echo "  ---> Sync released version ${version} img."
        rsync_wrapper "${PROJECT_DIR}/docs/img" "${SOURCE_PATH}/img"
        echo "  ---> Sync released version ${version} configs."

        local config_file_stem="docs${version//./-}"
        # To avoid change file `docsdev.js` name each time before release, we change it during our sync process
        rsync_wrapper "${PROJECT_DIR}/docs/configs/docsdev.js" "${SOURCE_PATH}/site_config/${config_file_stem}.js"
    done
}

##############################################################
#
# Rsync released document, from cloned repo
# apache/dolphinscheduler branch `dev`(latest), to directory
# `docs`, `img`, also with rsync config files.
#
##############################################################
function rsync_latest_docs() {
    echo "  ---> Directory change to ${PROJECT_DIR}."
    cd "${PROJECT_DIR}"
    echo "  ---> Git checkout to version ${PROJECT_BRANCH_NAME}."
    git checkout "${PROJECT_BRANCH_NAME}"

    echo "  ---> Sync dev docs."
    rsync_wrapper "${PROJECT_DIR}/docs/docs/en" "${PROJECT_SITE_DOC_DIR}/en-us/dev/user_doc" "--exclude=faq.md --exclude=history-versions.md"
    rsync_wrapper "${PROJECT_DIR}/docs/docs/en/*.md" "${PROJECT_SITE_DOC_DIR}/en-us/release"
    rsync_wrapper "${PROJECT_DIR}/docs/docs/zh" "${PROJECT_SITE_DOC_DIR}/zh-cn/dev/user_doc" "--exclude=faq.md --exclude=history-versions.md"
    rsync_wrapper "${PROJECT_DIR}/docs/docs/zh/*.md" "${PROJECT_SITE_DOC_DIR}/zh-cn/release"

    echo "  ---> Sync dev img."
    rsync_wrapper "${PROJECT_DIR}/docs/img" "${SOURCE_PATH}/img"

    echo "  ---> Sync dev configs."
    rsync_wrapper "${PROJECT_DIR}/docs/configs/site.js" "${SOURCE_PATH}/site_config/site.js"
    rsync_wrapper "${PROJECT_DIR}/docs/configs/index.md.jsx" "${SOURCE_PATH}/src/pages/docs/index.md.jsx"
    rsync_wrapper "${PROJECT_DIR}/docs/configs/docsdev.js" "${SOURCE_PATH}/site_config/docsdev.js"
}
