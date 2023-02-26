# LV Test App

For external device & component testing.

## Table of Contents

* [Packages](#packages)
* [Getting Started](#getting-started)
* [Features](#features)
  * [GNSS](#gnss)
  * [BLE](#ble)
  * [USB](#usb)

## Packages

| Project           | Package                                                                                       | Version                                                                                                                                                                              |                                          Links                                           |
|-------------------|-----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------------------------------:|
| **Ionic**         | [`@ionic/angular`](https://www.npmjs.com/package/@ionic/angular)                              | [![version](https://img.shields.io/badge/@ionic/angular-%5E6.1.9-blue)](https://www.npmjs.com/package/@ionic/angular/v/6.1.9)                                                        |                       [Docs](https://ionicframework.com/docs/v6/)                        |
| **Capacitor**     | [`@capacitor/core`](https://www.npmjs.com/package/@capacitor/core)                            | [![version](https://img.shields.io/badge/@capacitor/core-4.7.0-blue)](https://www.npmjs.com/package/@capacitor/core/v/4.7.0)                                                         |                         [Docs](https://capacitorjs.com/docs/v4/)                         |
| **Angular**       | [`@angular/core`](https://www.npmjs.com/package/@angular/core)                                | [![version](https://img.shields.io/badge/@angular/core-^15.0.0-blue)](https://www.npmjs.com/package/@angular/core/v/15.0.0)                                                          |                           [Docs](https://v15.angular.io/docs)                            |
| **Gnss Lib**      | [`locusview/gnss-lib`](https://www.github.com/locusview/gnss-lib)                             | [![version](https://img.shields.io/badge/locusview/gnss--lib-3.3.0-blue)](https://github.com/locusview/gnss-lib/releases/tag/3.3.0)                                                  |             [`README.md`](https://github.com/locusview/gnss-lib//README.md)              |
| **Lv Converter**  | [`locusview/web-common-converter`](https://www.github.com/locusview/web-common-converter)     | [![version](https://img.shields.io/badge/locusview/web--common--converter-1.2.3-blue)](https://github.com/locusview/web-common-converter/releases/tag/untagged-6553b30b9590998c000b) |  [`README.md`](https://github.com/locusview/web-common-converter/blob/1.2.3/README.md)   |
| **Lv Datum**      | [`locusview/web-common-datum`](https://www.github.com/locusview/web-common-datum)             | [![version](https://img.shields.io/badge/locusview/web--common--datum-6.0.0-blue)](https://github.com/locusview/web-common-datum/releases/tag/6.0.0)                                 |    [`README.md`](https://github.com/locusview/web-common-datum/blob/6.0.0/README.md)     |
| **Capacitor BLE** | [`capacitor-community/bluetooth-le`](https://www.github.com/capacitor-community/bluetooth-le) | [![version](https://img.shields.io/badge/capacitor--community/bluetooth--le-^2.1.0-blue)](https://www.npmjs.com/package/@capacitor-community/bluetooth-le/v/2.1.0)                   | [`README.md`](https://github.com/capacitor-community/bluetooth-le/blob/v2.1.0/README.md) |

## Getting Started

In order to run the app you should follow these steps:

1. Clone this repository including it's [submodules](/scripts/git/README.md) with the command `git clone --recursive git@github.com:locusview/lv-test-app.git` OR `git clone --recursive https://github.com/locusview/lv-test-app.git`

> **Note**  
> It is also possible to clone without submodules by omitting the `--recursive` flag.
> The submodules should then be manually initialized by running `npm run submodule:init`

Verify that you (or the team that you are assigned to) have access to all the private repositories in the package.json.

2. Run `npm install`

> **Note**  
> If the repository was not cloned with it's submodules, they will be initialized here during the `preinstall` hook.

3. Run `ionic serve`. The app should be launched in a new tab in the browser.

## Features

### Gnss

The app implements the [Gnss Plugin](https://github.com/locusview/gnss-lib.git) for the purposes of helping in testing external GNSS device connection, RTK connection, as well as testing of the plugin logic and functionality itself, in addition to being a development tool for future development of the plugin.
The functionality supported is the basic set of actions provided by the plugin:

* Listing paired accessories
* Listing avaialble RTK streams
* Connecting/Disconnecting from a selected accessory
* Connecting/Disconnecting from a selected RTK stream
* Fetching info on the connected accessory
* Reading data from the connected accessory
* Rebooting the connected accessory
* Subscribing to connection state events of the connected accessory
* Subscribing to connection state events of the connected RTK stream

As well as some custom functionality:

* Changing the units for displaying the current accuracy (metric or imperial)  
* Viewing the RTK connection duration
* Displaying the current latitude/longitude on a map
* A Datum convertion tool for checking manual conversion outputs

### BLE

The app implements the [Capacitor Community BLE plugin](https://github.com/@capacitor-community/bluetooth-le.git) for the purposes of helping in testing bluetooth accessory connection, in addition to being a development tool for future development of features with bluetooth accessories.
The functionality supported is the basic set of actions provided by the plugin:

* Scanning/discovering available accessories
* Connecting to a discovered accessory
* Listing the available services and characteristics of the connected accessory
* Starting/stopping notifications on a selected characteristic
* Reading data from a selected characteristic
* Writing data to a selected characteristic

### USB

TBD
