# Git Submodules

## Contents

1. [Overview](#overview)
2. [Adding a new submodule](#adding-a-new-submodule)
3. [Removing an existing submodule](#removing-an-existing-submodule)
4. [Updating a submodule](#updating-a-submodule)
5. [Initializing all submodules](#initializing-all-submodules)
6. [Resetting all submodules](#)

## Overview

Git submodules are a means of including one or more repositories inside of another while still maintaining them as separate git projects. This is useful for shared libraries/components or forked dependencies which require development and maintenance within the context of the parent project.

Git submodules are defined in the `.gitmodules` file as well as in the `submodules` array of `package.json`.

### .gitmodules

```
[submodule "lv-authorization"]
	path = lv-authorization
	url = ../web-common-authorization.git
	branch = 1.0.16
[submodule "lv-converter"]
	path = lv-converter
	url = ../web-common-converter.git
	branch = 1.2.3
```

### package.json

```
"submodules": [
  {
    "path": "lv-authorization",
    "url": "../web-common-authorization.git",
    "branch": "1.0.16"
  },
  {
    "path": "lv-converter",
    "url": "../web-common-converter.git",
    "branch": "1.2.3"
  }
]
```

In order to simplify working with git submodules, this repository provides several scripts for the most common actions:

## Adding a new submodule

### Description

To add a new submodule, use the `_gitSubmoduleAdd` script or `npm run submodule:add`.
The script writes a submodule config object into the `submodules` array in `package.json`. Then it adds the submodule with `git`, sets it to the specified branch/tag/commit, updates and checks out the latest changes. It then adds the submodule as an npm dependency, and finally, runs `npm install` inside the submodule itself to install its dependencies. 
The script takes three arguments:

| Argument | Description                                                                                                                 |
|----------|-----------------------------------------------------------------------------------------------------------------------------|
| Url      | The url of the submodule repo. Can be relative to the parent, e.g. ../my-submodule.git                                      |
| Path     | The path inside the parent project at which to clone the submodule. Also used as the submodule's name in the parent project |
| Branch   | The revision inside the submodule to check out. Can be a branch, tag, or commit SHA                                         |

### Example

```shell
node _gitSubmoduleAdd ../web-common-authorization lv-authorization 1.0.16
// or
npm run submodule:add ../web-common-authorization lv-authorization 1.0.16
```

The above commands will clone the web-common-authorization repository into lv-authorization inside the parent project, checked out at the tag 1.0.23.


## Removing an existing submodule

### Description

To remove an existing submodule, use the `_gitSubmoduleRemove` script or `npm run submodule:remove`.
The script de-initializes the submodule and uninstalls it as an npm dependency. Then it removes the submodule from `.git/modules`, as well as removing the clone of the submodule in the parent project entirely. 
The script takes one arguments:

| Argument | Description                                                      |
|----------|------------------------------------------------------------------|
| Path     | The path inside the parent project to remove the submodule from. |

### Example

```shell
node _gitSubmoduleRemove lv-authorization
// or
npm run submodule:remove lv-authorization
```

The above commands will entirely remove lv-authorization from the parent project.


## Updating a submodule

### Description

To initialize the project's submodules, use the `_gitSubmoduleInit` script or `npm run submodule:init`.
The script recurses over the `submodules` array in `package.json` and adds or updates each submodule according to it's configuration. The result is all the submodules being cloned and checked out at their defined revisions.
The script takes no arguments.

### Example

```shell
node _gitSubmoduleUpdate lv-authorization 1.0.17
// or
npm run submodule:update lv-authorization 1.0.17
```

The above commands will checkout the revision 1.0.17 in lv-authorization and update the submodule config in `package.json` and `.gitmodules` with this value.

#### Console output

```
node _gitSubmoduleUpdate lv-authorization 1.0.17
Previous HEAD position was b35f5c4 LV-24432: Data Cleanup - by Project Status (#21)
HEAD is now at 830e0b7 LV-24328 Added step_type to AuthorizationResource (#22)
From https://github.com/locusview/web-common-authorization
 * tag               1.0.17     -> FETCH_HEAD
Already up to date.

> lv-authorization@1.0.17 prepare /Users/oriy/Code/locusweb-client/lv-authorization
> husky install

husky - Git hooks installed
...

 --- .gitmodules contents ---
[submodule "lv-authorization"]
        path = lv-authorization
        url = ../web-common-authorization.git
        branch = 1.0.17,
        ignore: all
[submodule "lv-converter"]
        path = lv-converter
        url = ../web-common-converter.git
        branch = 1.2.3,
        ignore: all


 --- git submodules ---
+830e0b7015f076804085655f5bb6d8d7b2c7a185 lv-authorization (1.0.17)
 553b94e34dd4e57621b1aa64c289564b50311cb0 lv-converter (1.2.3)
```

<pre>
<b>diff --git a/.gitmodules b/.gitmodules
index 5d9966a53..214f2427e 100644
--- a/.gitmodules
+++ b/.gitmodules
<span style="color:teal">@@ -1,7 +1,7 @@</span></b>

[submodule "lv-authorization"]
        path = lv-authorization
        url = ../web-common-authorization.git
        branch = <span style="color:red">[-1.0.16-]</span><span style="color:green">{+1.0.17+}</span>,
        ignore: all
[submodule "lv-converter"]
        path = lv-converter
        url = ../web-common-converter.git


<b>diff --git a/package.json b/package.json
index a2eea4de2..762455cf5 100644
--- a/package.json
+++ b/package.json
<span style="color:teal">@@ -144,7 +144,7 @@</span></b>

    {
      "path": "lv-authorization",
      "url": "../web-common-authorization.git",
      "branch": <span style="color:red">[-"1.0.16"-]</span><span style="color:green">{+"1.0.17"+}</span>,
      "ignore": "all"
    },
    {
      "path": "lv-converter",

</pre>

## Initializing all submodules

### Description

To initialize the project's submodules, use the `_gitSubmoduleInit` script or `npm run submodule:init`.
The script recurses over the `submodules` array in `package.json` and adds or updates each submodule according to it's configuration. The result is all the submodules being cloned and checked out at their defined revisions.
The script takes no arguments.

### Example

```shell
node _gitSubmoduleInit
// or
npm run submodule:init
```