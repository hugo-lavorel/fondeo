#!/bin/bash
set -e

TARGET=${1:-all}

deploy_api() {
  echo "Deploying API..."
  (cd api && railway up --detach)
  echo "API deployed."
}

deploy_web() {
  echo "Deploying web..."
  (cd web && railway up --detach)
  echo "Web deployed."
}

case $TARGET in
  api)
    deploy_api
    ;;
  web)
    deploy_web
    ;;
  all)
    deploy_api
    deploy_web
    ;;
  *)
    echo "Usage: ./deploy.sh [api|web|all]"
    exit 1
    ;;
esac
