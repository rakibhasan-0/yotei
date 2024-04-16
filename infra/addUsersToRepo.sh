#!/bin/bash

# GitLab server URL and project ID
GITLAB_URL="https://git.cs.umu.se"
PROJECT_ID=""

# Access token for GitLab API
ACCESS_TOKEN=""

# List of usernames to add as developers
usernames=(
  "c21man"
  "c21abl"
  "c21hhn"
  "dv22alo"
  "ens20lpn"
  "id19mrt"
  "c15osn"
  "ens20tbm"
  "c21ndh"
  "dv22cen"
  "id20mhn"
  "c21akn"
  "c21hsn"
  "c16kvn"
  "id20eht"
  "dv22chg"
  "c21cmp"
  "c21inr"
  "ens20sai"
  "c21nsd"
  "c17vsn"
  "c21jen"
  "id20ehm"
  "ens21dhr"
  "c21tln"
  "dv22olt"
  "c21don"
  "c18dus"
  "c19jen"
  "c21eeg"
  "dv22rfg"
  "ens21ljn"
  "oi22nlg"
  "c21tlt"
  "c21ion"
  "ens21mas"
  "c21han"
  "dv18abk"
  "c21jgh"
  "ens19lld"
  "c19ork"
  "willys"
  "ens20ghn"
  "c20mln"
  "dv21tlg"
  "c21gmg"
  "ens22nnn"
  "c21lwg"
)

# Loop through the list of usernames and add them as developers to the project
for user in "${usernames[@]}"; do
  # Retrieve the user_id for the current user
  user_id=$(curl --header "PRIVATE-TOKEN: $ACCESS_TOKEN" "${GITLAB_URL}/api/v4/users?username=${user}" | jq -r '.[0].id')

  # Add the user as a developer to the project
  curl --request POST --header "PRIVATE-TOKEN: $ACCESS_TOKEN" "${GITLAB_URL}/api/v4/projects/${PROJECT_ID}/members" --form "user_id=${user_id}" --form "access_level=30"

  # Output success message
  echo "Added user ${user} with user_id ${user_id} as a developer to project ${PROJECT_ID}"
done
