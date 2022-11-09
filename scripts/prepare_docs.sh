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

# Choose the protocol for git communication to server, default is HTTP because it do not requests password or secret key,
# run command `export PROTOCOL_MODE=ssh` in terminal change protocol to SSH which in is faster and stable in many cases,
# such as local development where we already have RSA public key.
if [ "${PROTOCOL_MODE:-HTTP}" == "ssh" ]; then
    PROJECT_REPO="git@github.com:${PROJECT_ORG}/${PROJECT_NAME}.git"
    PROJECT_WEBSITE_REPO="git@github.com:${PROJECT_WEBSITE_ORG}/${PROJECT_WEBSITE_NAME}.git"
    PROJECT_PYTHON_REPO="git@github.com:${PROJECT_PYTHON_ORG}/${PROJECT_PYTHON_NAME}.git"
else
    PROJECT_REPO="https://github.com/${PROJECT_ORG}/${PROJECT_NAME}.git"
    PROJECT_WEBSITE_REPO="https://github.com/${PROJECT_WEBSITE_ORG}/${PROJECT_WEBSITE_NAME}.git"
    PROJECT_PYTHON_REPO="https://github.com/${PROJECT_PYTHON_ORG}/${PROJECT_PYTHON_NAME}.git"
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
# in repo `apache/dolphinscheduler` is like `../../img/<name>.png`
# and we should replace it to `/img/<name>.png`
#
# Arguments:
#
#   replace_dir: The directory to replace the img path
#
##############################################################
function replace_images_path() {
  replace_dir=$1
  for file_path in "${replace_dir}"/*; do
    if test -f "${file_path}"; then
      if [ "${file_path##*.}"x = "md"x ] || [ "${file_path##*.}"x = "mdx"x ]; then
        echo "  ---> Replace images path to /image in ${file_path}"
        if [[ "$OSTYPE" == "darwin"* ]]; then
          sed -E -i '' "s/(\.\.\/)+img/\/img/g" "${file_path}"
        else
          sed -E -i "s/(\.\.\/)+img/\/img/g" "${file_path}"
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
    rebuild_dirs "${PROJECT_SITE_DOC_DIR}" "${SWAP_DIR}"

    echo "===>>> Clone repository."
    echo "  ---> Clone history documents from ${PROJECT_WEBSITE_REPO} branch ${PROJECT_WEBSITE_BRANCH_NAME}."
    clone_repo "${PROJECT_WEBSITE_REPO}" "${PROJECT_WEBSITE_BRANCH_NAME}" "${PROJECT_WEBSITE_DIR}"
    echo "  ---> Clone DolphinScheduler latest documents from ${PROJECT_REPO} branch ${PROJECT_BRANCH_NAME}."
    clone_repo "${PROJECT_REPO}" "${PROJECT_BRANCH_NAME}" "${PROJECT_DIR}"
    echo "  ---> Clone Python API latest documents from ${PROJECT_PYTHON_REPO} branch ${PROJECT_PYTHON_BRANCH_NAME}."
    clone_repo "${PROJECT_PYTHON_REPO}" "${PROJECT_PYTHON_BRANCH_NAME}" "${PROJECT_PYTHON_DIR}"

    source "${SOURCE_PATH}/scripts/rsync_content.sh"
    echo "===>>> Sync content from cloned repository."
    echo "  ---> Sync history content."
    rsync_history_docs

    echo "  ---> Sync released document after migrating docs into apache/dolphinscheduler."
    rsync_released_docs

    echo "  ---> Sync latest document in dev branch."
    rsync_latest_docs

    echo "===>>>: Replace images path in ${PROJECT_SITE_DOC_DIR}"
    replace_images_path "${PROJECT_SITE_DOC_DIR}"

    echo "===>>> End prepare document."
}

prepare_docs
