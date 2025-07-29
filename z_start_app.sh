# START BY RUNNING THIS SCRIPT (should launch the app)
git init 

git add .
git commit -m "initial commit"
gh auth login # Authenticate with GitHub CLI
gh repo create REMOTE-REPO-NAME --public --source=. --remote=origin --push --web
git push -u origin master
gh repo edit --default-branch master
git push origin --delete main 
# if you forget to rename REMOTE-REPO-NAME, you can run: gh repo rename NEW-REPO-NAME

npm install
npm run dev