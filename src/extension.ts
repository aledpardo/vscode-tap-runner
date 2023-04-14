'use strict';
import * as vscode from 'vscode';

import { TapRunner } from './tapRunner';
import { TapRunnerCodeLensProvider } from './TapRunnerCodeLensProvider';
import { TapRunnerConfig } from './tapRunnerConfig';

export function activate(context: vscode.ExtensionContext): void {
  const config = new TapRunnerConfig();
  const tapRunner = new TapRunner(config);
  const codeLensProvider = new TapRunnerCodeLensProvider(config.codeLensOptions);

  const runTap = vscode.commands.registerCommand(
    'extension.runTap',
    async (argument: Record<string, unknown> | string) => {
      return tapRunner.runCurrentTest(argument);
    }
  );

  const runTapCoverage = vscode.commands.registerCommand(
    'extension.runTapCoverage',
    async (argument: Record<string, unknown> | string) => {
      return tapRunner.runCurrentTest(argument, ['--coverage']);
    }
  );

  const runTapPath = vscode.commands.registerCommand('extension.runTapPath', async (argument: vscode.Uri) =>
    tapRunner.runTestsOnPath(argument.path)
  );
  const runTapAndUpdateSnapshots = vscode.commands.registerCommand('extension.runTapAndUpdateSnapshots', async () => {
    tapRunner.runCurrentTest('', ['-u']);
  });
  const runTapFile = vscode.commands.registerCommand('extension.runTapFile', async () => tapRunner.runCurrentFile());
  const debugTap = vscode.commands.registerCommand(
    'extension.debugTap',
    async (argument: Record<string, unknown> | string) => {
      if (typeof argument === 'string') {
        return tapRunner.debugCurrentTest(argument);
      } else {
        return tapRunner.debugCurrentTest();
      }
    }
  );
  const debugTapPath = vscode.commands.registerCommand('extension.debugTapPath', async (argument: vscode.Uri) =>
    tapRunner.debugTestsOnPath(argument.path)
  );
  const runPrev = vscode.commands.registerCommand('extension.runPrevTap', async () => tapRunner.runPreviousTest());
  const runTapFileWithCoverage = vscode.commands.registerCommand('extension.runTapFileWithCoverage', async () =>
    tapRunner.runCurrentFile(['--coverage'])
  );

  const runTapFileWithWatchMode = vscode.commands.registerCommand('extension.runTapFileWithWatchMode', async () =>
    tapRunner.runCurrentFile(['--watch'])
  );

  const watchTap = vscode.commands.registerCommand(
    'extension.watchTap',
    async (argument: Record<string, unknown> | string) => {
      return tapRunner.runCurrentTest(argument, ['--watch']);
    }
  );

  if (!config.isCodeLensDisabled) {
    const docSelectors: vscode.DocumentFilter[] = [
      {
        pattern: vscode.workspace.getConfiguration().get('taprunner.codeLensSelector'),
      },
    ];
    const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(docSelectors, codeLensProvider);
    context.subscriptions.push(codeLensProviderDisposable);
  }
  context.subscriptions.push(runTap);
  context.subscriptions.push(runTapCoverage);
  context.subscriptions.push(runTapAndUpdateSnapshots);
  context.subscriptions.push(runTapFile);
  context.subscriptions.push(runTapPath);
  context.subscriptions.push(debugTap);
  context.subscriptions.push(debugTapPath);
  context.subscriptions.push(runPrev);
  context.subscriptions.push(runTapFileWithCoverage);
  context.subscriptions.push(runTapFileWithWatchMode);
  context.subscriptions.push(watchTap);
}

export function deactivate(): void {
  // deactivate
}
