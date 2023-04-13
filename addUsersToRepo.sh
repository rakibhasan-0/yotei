#!/bin/bash

# GitLab server URL and project ID
GITLAB_URL="https://git.cs.umu.se"
PROJECT_ID=""

# Access token for GitLab API
ACCESS_TOKEN=""

# List of usernames to add as developers
usernames=(
  "et19lad"
  "dv21jin"
  "dv20rjt"
  "id19vnt"
  "c20spm"
  "c18erg"
  "c20isv"
  "ens19amd"
  "ie15enm"
  "dv21aac"
  "c19pbd"
  "ens19ann"
  "dv21lln"
  "c20jlg"
  "oi14jnd"
  "dv21aag"
  "c19vbn"
  "dv21oby"
  "ens19cfd"
  "tfy17efe"
  "dv19jhd"
  "c20lln"
  "dv19mam"
  "c20abm"
  "dv21adt"
  "ens19jln"
  "dv21sln"
  "ens19fpt"
  "c20mtn"
  "id19cbn"
  "c20obn"
  "dv21cgn"
  "dv20ejn"
  "c20alm"
  "dv21wnn"
  "ens20lpi"
  "dv21hbr"
  "oi16jgn"
  "dv20fnh"
  "c20cnr"
  "id19dvd"
  "c20own"
  "dv21jen"
  "c20rjn"
  "id19eln"
  "dv20oll"
  "ens20pld"
  "c20dpg"
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

