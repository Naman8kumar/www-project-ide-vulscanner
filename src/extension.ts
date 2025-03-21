import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('owasp-vulscanner.runSpectral', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("No active editor found.");
            return;
        }

        const document = editor.document;
        const filePath = document.fileName;

        exec(`npx spectral lint ${filePath}`, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error: ${stderr}`);
                return;
            }
            vscode.window.showInformationMessage(stdout);
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
