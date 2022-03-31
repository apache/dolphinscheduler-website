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

# Codebase Repository
PROJECT_NAME="dolphinscheduler"
# TODO
PROJECT_BRANCH_NAME="migrate-dev-docs-to-main"
PROJECT_WEBSITE_NAME="${PROJECT_NAME}-website"
PROJECT_WEBSITE_BRANCH_NAME="history-docs"

# Repository Website(current) Directory And Files
SWAP_DIR="${SOURCE_PATH}/swap"
PROJECT_SITE_DOC_DIR="${SOURCE_PATH}/docs"
PROJECT_DIR="${SWAP_DIR}/${PROJECT_NAME}"
PROJECT_WEBSITE_DIR="${SWAP_DIR}/${PROJECT_WEBSITE_NAME}"

declare -a versions=(
"1.2.0" "1.2.1" "1.3.1" "1.3.2" "1.3.3" "1.3.4" "1.3.5" "1.3.6" "1.3.8" "1.3.9"
"2.0.0" "2.0.1" "2.0.2" "2.0.3" "2.0.5"
)


# Choose the protocol for git communication to server, default is HTTP because it do not requests password or secret key,
# run command `export PROTOCOL_MODE=ssh` in terminal change protocol to SSH which in is faster and stable in many cases,
# such as local development where we already have RSA public key.
if [ "${PROTOCOL_MODE:-HTTP}" == "ssh" ]; then
    PROJECT_REPO="git@github.com:apache/${PROJECT_NAME}.git"
    PROJECT_WEBSITE_REPO="git@github.com:apache/${PROJECT_WEBSITE_NAME}.git"
else
    PROJECT_REPO="https://github.com/apache/${PROJECT_NAME}.git"
    PROJECT_WEBSITE_REPO="https://github.com/apache/${PROJECT_WEBSITE_NAME}.git"
fi

##############################################################
#
# Rebuild specific directory, if directory exists, will remove
# it before create it, otherwise create it directly. It
# supports one or more parameters.
#
# Arguments:
#
#   <path...>: One or more directories want to rebuild
#
##############################################################
function rebuild_dirs() {
    for dir in "$@"; do
        echo "  ---> Rebuild directory ${dir}"
        if [ -d "${dir}" ]; then
          rm -rf "${dir}"
        fi
        mkdir -p "${dir}"
    done
}

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
# Clone repository to target directory, it will only support
# clone one depth. Supported two or three parameters, if you
# want to clone into specific directory you should provider
# the third parameter.
#
# Arguments:
#
#   repo: The link of the repository you want to clone
#   branch: The branch to clone
#   path: Optional parameter, The directory to keep the clone
#         content
#
##############################################################
function clone_repo() {
    if [ "$#" -eq 2 ]; then
        local repo="${1}"
        local path="${2}"

        echo "  ---> Start clone repository ${repo} to directory ${path}"
        git clone --depth 1 "${repo}" "${path}"
    elif [ "$#" -eq 3 ]; then
        local repo="${1}"
        local branch="${2}"
        local path="${3}"

        echo "  ---> Start clone repository ${repo} branch ${branch} to directory ${path}"
        git clone --depth 1 --branch "${branch}" "${repo}" "${path}"
    else
        echo "Illegal number of parameters. Only support parameters number of 2 or 3 but get $#."
        exit 1
    fi
}

##############################################################
#
# Replace images path in markdown documents, the source path
# in repo `apache/incubator-seatunnel` is like `images/<name>.png`
# and we should replace it to `images_en/<name>.png`
#
# Arguments:
#
#   replace_dir: The directory to replace the img path
#
##############################################################
function replace_images_path(){
  replace_dir=$1
  for file_path in "${replace_dir}"/*; do
    if test -f "${file_path}"; then
      if [ "${file_path##*.}"x = "md"x ] || [ "${file_path##*.}"x = "mdx"x ]; then
        echo "  ---> Replace images path to /doc/image_en in ${file_path}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
          sed -E -i '' "s/(\.\.\/)*images/\/image_en/g" "${file_path}"
        else
          sed -E -i "s/(\.\.\/)*images/\/image_en/g" "${file_path}"
        fi
      fi
    else
      replace_images_path "${file_path}"
    fi
  done
}

##############################################################
#
# Main project to do prepare job to debug and build our web
#
##############################################################
function prepare_docs() {
    echo "===>>> Start prepare document."

    echo "===>>> Prepare directories and files"
    echo "  ---> Rebuild docsite directory which need for docsite build."
    rebuild_dirs "${SOURCE_PATH}/docs" "${SWAP_DIR}"

    echo "===>>> Clone repository."
    echo "  ---> Clone history documents from ${PROJECT_WEBSITE_REPO} branch ${PROJECT_WEBSITE_BRANCH_NAME}."
    clone_repo "${PROJECT_WEBSITE_REPO}" "${PROJECT_WEBSITE_BRANCH_NAME}" "${PROJECT_WEBSITE_DIR}"
    echo "  ---> Clone dev documents from ${PROJECT_REPO} branch ${PROJECT_BRANCH_NAME}."
    clone_repo "${PROJECT_REPO}" "${PROJECT_BRANCH_NAME}" "${PROJECT_DIR}"

    echo "===>>> Sync content from cloned repository."
    echo "  ---> Sync history content."
    for version in "${versions[@]}"; do
        echo "   --> Sync version ${version} content"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/docs/en" "${PROJECT_SITE_DOC_DIR}/en-us/${version}/user_doc"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/docs/zh" "${PROJECT_SITE_DOC_DIR}/zh-cn/${version}/user_doc"
        echo "  ---> Sync version ${version} configs."
        local config_file_stem="docs${version//./-}"
        rsync_wrapper "${PROJECT_WEBSITE_DIR}/docs/${version}/configs/${config_file_stem}.js" "${SOURCE_PATH}/site_config/${config_file_stem}.js"
    done
    echo "  ---> Sync history img."
    rsync_wrapper "${PROJECT_WEBSITE_DIR}/img"/ "${SOURCE_PATH}/img"

    echo "  ---> Sync dev content."
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

    echo "===>>> End prepare document."
}

prepare_docs
