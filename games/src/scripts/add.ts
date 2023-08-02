import { GameDefinition } from "../models";
import { v4 as uuid } from "uuid";
import fs from "fs";
import * as yaml from "js-yaml";
import { input } from "@inquirer/prompts";
import _ from "lodash";

const displayName = await input({
  message: "Display name for the community",
  validate: (val) => !!val,
});
const identifier = await input({
  message: "Identifier for the community (slug)",
  default: _.kebabCase(displayName),
  validate: (val) => !!val && val == _.kebabCase(val),
});

const game: GameDefinition = {
  uuid: uuid(),
  label: identifier,
  meta: {
    displayName,
    iconUrl: "None",
  },
  distributions: [],
  // TODO: Enable once consumers implemented
  // r2modman: {
  //   internalFolderName: name,
  //   dataFolderName: name,
  //   settingsIdentifier: name,
  //   packageIndex: `https://thunderstore.io/c/${name}/api/v1/package/`,
  //   exclusionsUrl:
  //     "https://raw.githubusercontent.com/ebkr/r2modmanPlus/master/modExclusions.md",
  //   steamFolderName: name,
  //   exeNames: [`${name}.exe`],
  //   gameInstancetype: "game",
  //   gameSelectionDisplayMode: "visible",
  //   modLoaderPackages: [],
  //   installRules: [],
  // },
  thunderstore: {
    displayName,
    categories: {
      mods: { label: "Mods" },
      modpacks: { label: "Modpacks" },
      tools: { label: "Tools" },
      libraries: { label: "Libraries" },
      misc: { label: "Misc" },
      audio: { label: "Audio" },
    },
    sections: {
      mods: {
        name: "Mods",
        excludeCategories: ["modpacks"],
      },
      modpacks: {
        name: "Modpacks",
        requireCategories: ["modpacks"],
      },
    },
  },
};

const path = `./data/${identifier}.yml`;
if (fs.existsSync(path)) {
  throw new Error(`${path} already exists`);
}
fs.writeFileSync(
  path,
  yaml.dump(game, {
    quotingType: '"',
    forceQuotes: true,
  })
);
