#!/bin/bash

# GitLab server URL and project ID
GITLAB_URL="https://git.cs.umu.se"
PROJECT_ID="10668"

# Access token for GitLab API
ACCESS_TOKEN="TgniYd2mE587TipJfpK9"

# List of usernames to add as developers
usernames=(
  "dv22alo"
  "id19mrt"
  "c15osn"
  "ens20tbm"
  "c21ndh"
  "dv22cen"
  "c21akn"
  "c16kvn"
  "dv22chg"
  "c21cmp"
  "c21inr"
  "ens20sai"
  "c17vsn"
  "c21jen"
  "id20ehm"
  "ens21dhr"
  "dv22olt"
  "c21don"
  "c18dus"
  "dv22rfg"
  "ens21ljn"
  "oi22nlg"
  "c21tlt"
  "c21ion"
  "ens21mas"
  "c21han"
  "dv18abk"
  "ens19lld"
  "willys"
  "ens20ghn"
  "c20mln"
  "dv21tlg"
  "ens22nnn"
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
