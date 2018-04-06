# Doxity - Simpleton Version

### Documentation Generator for Solidity Contracts
##### Powered by [Gatsby](https://github.com/gatsbyjs/gatsby)
This project is an attempt to create a working version of the [@digix/doxity project](https://github.com/DigixGlobal/doxity).

Additional assistance in this fix was gleaned from [ProjectWyvern](https://github.com/ProjectWyvern/wyvern-ethereum)

## Getting Started

### Clone (or Fork) this repo

```
git clone https://www.github.com/ryanhendricks/doxity-simpleton.git
```

### Edit the following files to match your Github Repo to use Github Pages

- .doxityrc - no changes needed if you plan to use master branch /docs folder for github pages
- /doxity/config.toml - "linkPrefix = "/doxity-simpleton"" must match your Github Repo
- package.json - the following fields must match your Github Repo to use Github Pages
```
"author": "Ryan Hendricks",
"main": "docs/index.html",
"repository": {
    "type": "git",
    "url": "git+https://github.com/username/repo.git"
  },
"homepage": "https://github.com/RyanHendricks/doxity-simpleton/",
```

## Add Contracts

Copy solidity contracts to the contracts folder

## Build the docs

```bash
# install doxity dependencies
cd doxity-simpleton/doxity
yarn
# return to root dir
cd ..
# install project dependencies from root folder
yarn
# build the docs
doxity build
```

## Push your files to Github and Docs should now be available via Github Pages





For a more in depth look at how this works and for additional commands please see: [Original Readme](https://github.com/DigixGlobal/doxity/blob/master/README.md)


[Demo Site](https://hitchcott.github.io/doxity-demo/docs/MetaCoin/)
