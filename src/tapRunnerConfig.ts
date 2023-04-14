import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { normalizePath, quote, validateCodeLensOptions, CodeLensOption, isNodeExecuteAbleFile } from './util';

export class TapRunnerConfig {
  /**
   * The command that runs tap.
   * Defaults to: node "node_modules/.bin/tap"
   */
  public get tapCommand(): string {
    // custom
    const tapCommand: string = vscode.workspace.getConfiguration().get('taprunner.tapCommand');
    if (tapCommand) {
      return tapCommand;
    }

    // default
    if (this.isYarnPnpSupportEnabled) {
      return `yarn tap`;
    }
    return `npx tap`;
  }

  public get changeDirectoryToWorkspaceRoot(): boolean {
    return vscode.workspace.getConfiguration().get('taprunner.changeDirectoryToWorkspaceRoot');
  }

  public get preserveEditorFocus(): boolean {
    return vscode.workspace.getConfiguration().get('taprunner.preserveEditorFocus') || false;
  }

  public get tapBinPath(): string {
    // custom
    let tapPath: string = vscode.workspace.getConfiguration().get('taprunner.tapPath');
    if (tapPath) {
      return tapPath;
    }

    // default
    const fallbackRelativeTapBinPath = 'node_modules/tap/bin/run.js';
    const mayRelativeTapBin = ['node_modules/.bin/tap', 'node_modules/tap/bin/run.js'];
    const cwd = this.cwd;

    tapPath = mayRelativeTapBin.find((relativeTapBin) => isNodeExecuteAbleFile(path.join(cwd, relativeTapBin)));
    tapPath = tapPath || path.join(cwd, fallbackRelativeTapBinPath);

    return normalizePath(tapPath);
  }

  public get projectPath(): string {
    return vscode.workspace.getConfiguration().get('taprunner.projectPath') || this.currentWorkspaceFolderPath;
  }

  public get cwd(): string {
    return (
      vscode.workspace.getConfiguration().get('taprunner.projectPath') ||
      this.currentPackagePath ||
      this.currentWorkspaceFolderPath
    );
  }

  private get currentPackagePath() {
    let currentFolderPath: string = path.dirname(vscode.window.activeTextEditor.document.fileName);
    do {
      // Try to find where tap is installed relatively to the current opened file.
      // Do not assume that tap is always installed at the root of the opened project, this is not the case
      // such as in multi-module projects.
      const pkg = path.join(currentFolderPath, 'package.json');
      const tap = path.join(currentFolderPath, 'node_modules', 'tap');
      if (fs.existsSync(pkg) && fs.existsSync(tap)) {
        return currentFolderPath;
      }
      currentFolderPath = path.join(currentFolderPath, '..');
    } while (currentFolderPath !== this.currentWorkspaceFolderPath);

    return '';
  }

  public get currentWorkspaceFolderPath(): string {
    const editor = vscode.window.activeTextEditor;
    return vscode.workspace.getWorkspaceFolder(editor.document.uri).uri.fsPath;
  }

  public get tapConfigPath(): string {
    // custom
    const configPath: string = vscode.workspace.getConfiguration().get('taprunner.configPath');
    if (!configPath) {
      return this.findConfigPath();
    }

    // default
    return normalizePath(path.join(this.currentWorkspaceFolderPath, configPath));
  }

  getTapConfigPath(targetPath: string): string {
    // custom
    const configPath: string = vscode.workspace.getConfiguration().get('taprunner.configPath');
    if (!configPath) {
      return this.findConfigPath(targetPath);
    }

    // default
    return normalizePath(path.join(this.currentWorkspaceFolderPath, configPath));
  }

  private findConfigPath(targetPath?: string): string {
    let currentFolderPath: string = targetPath || path.dirname(vscode.window.activeTextEditor.document.fileName);
    let currentFolderConfigPath: string;
    do {
      for (const configFilename of ['tap.config.js', 'tap.config.ts']) {
        currentFolderConfigPath = path.join(currentFolderPath, configFilename);

        if (fs.existsSync(currentFolderConfigPath)) {
          return currentFolderConfigPath;
        }
      }
      currentFolderPath = path.join(currentFolderPath, '..');
    } while (currentFolderPath !== this.currentWorkspaceFolderPath);
    return '';
  }

  public get runOptions(): string[] | null {
    const runOptions = vscode.workspace.getConfiguration().get('taprunner.runOptions');
    if (runOptions) {
      if (Array.isArray(runOptions)) {
        return runOptions;
      } else {
        vscode.window.showWarningMessage(
          'Please check your vscode settings. "taprunner.runOptions" must be an Array. '
        );
      }
    }
    return null;
  }

  public get debugOptions(): Partial<vscode.DebugConfiguration> {
    const debugOptions = vscode.workspace.getConfiguration().get('taprunner.debugOptions');
    if (debugOptions) {
      return debugOptions;
    }

    // default
    return {};
  }

  public get isCodeLensDisabled(): boolean {
    const isCodeLensDisabled: boolean = vscode.workspace.getConfiguration().get('taprunner.disableCodeLens');
    return isCodeLensDisabled ? isCodeLensDisabled : false;
  }

  public get isRunInExternalNativeTerminal(): boolean {
    const isRunInExternalNativeTerminal: boolean = vscode.workspace
      .getConfiguration()
      .get('taprunner.runInOutsideTerminal');
    return isRunInExternalNativeTerminal ? isRunInExternalNativeTerminal : false;
  }

  public get codeLensOptions(): CodeLensOption[] {
    const codeLensOptions = vscode.workspace.getConfiguration().get('taprunner.codeLens');
    if (Array.isArray(codeLensOptions)) {
      return validateCodeLensOptions(codeLensOptions);
    }
    return [];
  }

  public get isYarnPnpSupportEnabled(): boolean {
    const isYarnPnp: boolean = vscode.workspace.getConfiguration().get('taprunner.enableYarnPnpSupport');
    return isYarnPnp ? isYarnPnp : false;
  }
  public get getYarnPnpCommand(): string {
    const yarnPnpCommand: string = vscode.workspace.getConfiguration().get('taprunner.yarnPnpCommand');
    return yarnPnpCommand;
  }
}
