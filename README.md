# vscode-tap-runner

Looking for collaborators to help me maintain the project. Please contact me at aledpviola@gmail.com

## Visual Studio Code Marketplace

[VisualStudio Marketplace](https://marketplace.visualstudio.com/items?itemName=aledpardo.vscode-tap-runner)
[Open VSX Registry](https://open-vsx.org/extension/aledpardo/vscode-tap-runner)

## Acknowledgements

The goal of this extension is to provide a similar UX that Tap Runner extension by firsttris to TAP based tests.

This extension is a direct fork/change/publish of the popular Tap Runner by firsttris.

Thanks for the MIT License, I believe I'm able to do this work, but let me know if otherwise, as OSS licensing is tricky for me.

Kudos for him and all maintainers for the awesome extension!

## Features

Simple way to run or debug a specific test
*As it is possible in IntelliJ / Webstorm*

Run & Debug your Tap Tests from

- Context-Menu
- CodeLens
- Command Palette (strg+shift+p)

## Supports

- yarn & vscode workspaces (monorepo)
- dynamic tap config resolution
- yarn 2 pnp
- CRA & and similar abstractions

![Extension Example](https://github.com/firsttris/vscode-tap/raw/master/public/vscode-tap.gif)

## Usage with CRA or similar abstractions

add the following command to settings, to pass commandline arguments

```json
"taprunner.tapCommand": "npm run test --"
```

## Debugging JSX/TSX with CRA

for debugging JST/TSX with CRA you need to have a valid babel and tap config:

to add a `babel.config.js` with at least the following config

```javascript
// babel.config.js
module.exports = {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      "babel-preset-react-app",
    ],
  };
```

add a `tap.config.js` with at least the following config

```javascript
module.exports = {
  transform: {
    '\\.(js|ts|jsx|tsx)$': 'babel-tap',
    '\\.(jpg|jpeg|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|webmanifest|xml)$':
      '<rootDir>/tap/fileTransformer.js'
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy'
  },
}
```

Check that debugger works:
![image](https://user-images.githubusercontent.com/1709260/120468727-d542ae00-c3a1-11eb-85ac-986c35ac167f.png)

## Extension Settings

Tap Runner will work out of the box, with a valid Tap config.
If you have a custom setup use the following options to configure Tap Runner:

| Command | Description |
| --- | --- |
| taprunner.configPath | Tap config path (relative to ${workFolder} e.g. tap-config.json) |
| taprunner.tapPath | Absolute path to tap bin file (e.g. /usr/lib/node_modules/tap/bin/tap.js) |
| taprunner.debugOptions | Add or overwrite vscode debug configurations (only in debug mode) (e.g. `"taprunner.debugOptions": { "args": ["--no-cache"] }`) |
| taprunner.runOptions | Add CLI Options to the Tap Command (e.g. `"taprunner.runOptions": ["--coverage", "--colors"]`) <https://tapjs.io/docs/en/cli> |
| taprunner.tapCommand | Define an alternative Tap command (e.g. for Create React App and similar abstractions) |
| taprunner.disableCodeLens | Disable CodeLens feature |
| taprunner.codeLensSelector | CodeLens will be shown on files matching this pattern (default **/*.{test,spec}.{js,jsx,ts,tsx}) |
| taprunner.codeLens | Choose which CodeLens to enable, default to `["run", "debug"]` |
| taprunner.enableYarnPnpSupport Enable if you are using Yarn 2 with Plug'n'Play |
| taprunner.yarnPnpCommand | Command for debugging with Plug'n'Play defaults to yarn-*.*js |
| taprunner.projectPath | Absolute path to project directory (e.g. /home/me/project/sub-folder) |
| taprunner.changeDirectoryToWorkspaceRoot | Changes directory to workspace root before executing the test |
| taprunner.preserveEditorFocus | Preserve focus on your editor instead of focusing the terminal on test run |
| taprunner.runInExternalNativeTerminal | run in external terminal (requires: npm install ttab -g) |

## Shortcuts

Command Pallette -> Preferences: Open Keyboard Shortcuts (JSON)
the json config file will open
add this:

```javascript
{
  "key": "alt+1",
  "command": "extension.runJest"
},
{
  "key": "alt+2",
  "command": "extension.debugJest"
},
{
  "key": "alt+3",
  "command": "extension.watchJest"
},
{
  "key": "alt+4",
  "command": "extension.runPrevJest"
}
```

## Want to start contributing features?

[Some open topics get you started](https://github.com/firsttris/vscode-tap-runner/issues)

## Steps to run in development mode

- npm install
- Go to Menu "Run" => "Start Debugging"

Another vscode instance will open with the just compiled extension installed.

## Notes from contributors

- Babel compile Issue when starting Debug in JSX/TSX,
  - check the post of @Dot-H <https://github.com/firsttris/vscode-tap-runner/issues/136>
  - <https://github.com/firsttris/vscode-tap-runner/issues/174>

- By default **Tap** finds its config from the `"tap"` attribute in your `package.json` or if you export an object `module.export = {}` in a `tap.config.js` file in your project root directory.
Read More: [Configuring Tap Docs](https://node-tap.org/docs/configuring/)

- If Breakspoints are not working properly, try adding this to vscode config:

```javascript
"taprunner.debugOptions": {
    "args": ["--no-cache"],
    "sourcemaps": "inline",
    "disableOptimisticBPs": true,
}
```
