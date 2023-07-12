gcloud config set project addictingwordgames
gsutil -m rsync -r ./static gs://static.addictingwordgames.com/static
gcloud app deploy --project addictingwordgames

# deploy index.yaml - dont need this much
gcloud app deploy --project addictingwordgames --no-promote index.yaml
