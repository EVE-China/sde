https://developers.eveonline.com/docs/services/static-data/#automation

# Automation

For automated access to the SDE:

- Latest Build Number: [developers.eveonline.com/static-data/tranquility/latest.jsonl](https://developers.eveonline.com/static-data/tranquility/latest.jsonl)
  - The latest build number is in the record with the key sde.
- Data URLs: https://developers.eveonline.com/static-data/tranquility/eve-online-static-data-<build-number>-<variant>.zip.
- Changes: https://developers.eveonline.com/static-data/tranquility/changes/<build-number>.jsonl
  - This contains the list of changes. The record with key _meta contains lastBuildNumber, referring to the previous SDE.

Lastly, there are a few short-hand URLs to always fetch the latest version. This will redirect to the URL with the latest build number.

- JSON Lines: [developers.eveonline.com/static-data/eve-online-static-data-latest-jsonl.zip](https://developers.eveonline.com/static-data/eve-online-static-data-latest-jsonl.zip)
- YAML: [developers.eveonline.com/static-data/eve-online-static-data-latest-yaml.zip](https://developers.eveonline.com/static-data/eve-online-static-data-latest-yaml.zip)