# sketch-to-json-plugin

## Installation

- [Download](../../releases/latest/download/sketch-to-json-plugin.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on sketch-to-json-plugin.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage
Basicly, select a group of items and then use this plugin to convert this group into a JSON file
![image](https://github.com/Dramalf/sketch-to-json-plugin/assets/43701793/eb65214d-7c40-4298-a749-64acd67942c9)


Moreover,you can add a `_pic` suffix after non-image elements, and the exported JSON will add a url attribute for that element, containing the base64 image information of the element.
![image](https://github.com/Dramalf/sketch-to-json-plugin/assets/43701793/cd675cae-714c-4e10-9a31-bb9b5b5029d6)

For the complete data structure, please refer to the `sketch-export.json` file.The coverImage attribute in the JSON structure is the base64 information of the cover image of the Sketch page, and the layersData attribute is the tree structure of its grouped layers.


