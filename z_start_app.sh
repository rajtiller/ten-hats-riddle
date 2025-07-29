# START BY RUNNING THIS SCRIPT (should launch the app)
git init 

git add .
git commit -m "initial commit"
git checkout -b master
git push -u origin master
gh repo edit --default-branch master
git push origin --delete main 
gh auth login # Authenticate with GitHub CLI
gh repo create Ten-Hats-Riddle --public --source=. --remote=origin --push --web
# if you forget to rename REMOTE-REPO-NAME, you can run: gh repo rename NEW-REPO-NAME

npm install
npm run dev