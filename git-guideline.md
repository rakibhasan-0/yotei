<h1>Yotei Git Workflow</h1>

Yotei's git is divided into four repositories.
- Backend - This repository holds the codebase and all documentation for the backend.
- Frontend - This repository holds the codebase and all documentation for the frontend.
- Infrastructure - This repository holds the config files, including the docker compose file.
- Documentation - This repository holds all user documentation.

<h3>Working on a ticket</h3>
<h6>Creating a branch</h6>
When working on a ticket the developer should branch to a devloper branch with 

`git switch -c <branch_name>`

The branch name needs to be `[ticket_number]_[squad-name]`, e.g `21_kraken`. This should be followed, as it will simplify managing branches.
To see all available branches use the command:

`git branch`

Push the branch to origin with the command: 

`git push -u origin [branch_name]` 

Example:
`git push -u origin 21_kraken`

When working on a feature branch remember to commit **often** and make sure to push to the feature branch at the **end of the day**.

<h6>Fetch and pull from a created branch</h6>
First create a local branch with a reasonable name
`git switch -c <branch_name>`

After this you want to associate it with the ticket branch created on the remote repository
`git branch --set-upstream-to=origin/<branch_name_to_fetch>`

Now you are ready to pull.

<h6>Done with ticket</h6>
When the feature has been implemented and is ready to be integrated into the main branch, the devloper should rebase the developer branch with the main branch using the command

`git rebase main`

If any conflicts arise the rebase will stop and leave conflict markers on the conflicting areas. The developer can then use 

`git diff`

This will locate the markers (<<<<<<), and the developer can then fix these conflicts. The next step will be

`git add < filename >`

To add each file with a resolved conflict, then use the command

`git rebase --continue`  

To continue with the rebase. Alternatively the developer could abort the rebase with the command

`git rebase --abort`

If the rebase was successful, a merge request should be sent using the gitlab website. The following template should be used when creating a new merge resuest via the website.
- Title - `<branch_name>`
- Description - 
        
        <Trello ticket link>
        <Description, a breif description about what has been implemented and how it has been done.> 
Always remeber to check both "Delete source branch" and "Squash commits".
The merge resuest can only be approved by a DevOps however DevOps will not be obliged to review the code. Instead always assign one reviewer (not a DevOps) of your choice to review the merge, if no reviwer has been appointed DevOps will not approve the merge request regardless of content. 

### Example of merge request:
![Exempel på merge request](images/git.png)

If a reviewer has been assigned and has approved the merge a DevOps will approve the merge request and the updated main branch will be automatically deployed on the test server.

After the merge a Squash commit will be produced with the following format.

    %{title}

    Merge branch '%{source_branch}' into '%{target_branch}'

    Reviewed by %{reviewed_by}
    Approved by %{approved_by}

    Description
    %{description}

    Branch commits
    %{all_commits}


## Gitikett
- Help eachother.
- Make sure to commit often.
- Always `pull` from **main** before creating a new branch.
- Always `rebase` before creating a merge request to **main** branch.
- At the end of the day, `push` changes to your feature branch, in case you are sick/not available the day after, such that another member of the squad can continue working on the feature.



                
    
