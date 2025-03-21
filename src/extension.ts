import * as vscode from 'vscode';
import { runSpectralLinting } from './spectralLint';

export function activate(context: vscode.ExtensionContext) {
    let spectralDiagnostics = vscode.languages.createDiagnosticCollection("spectral");
    context.subscriptions.push(spectralDiagnostics);

    let disposable = vscode.commands.registerCommand('owasp-vulscanner.runSpectral', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }

        runSpectralLinting(editor.document, spectralDiagnostics);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
