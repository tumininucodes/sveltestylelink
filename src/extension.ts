import * as vscode from 'vscode';
import { SvelteCssDefinitionProvider } from './SvelteCSSDefinitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log("Svelte Class Navigator activated");

    const selector: vscode.DocumentSelector = [
        { language: "svelte", scheme: "file" }
    ];

    const provider = new SvelteCssDefinitionProvider();

    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(selector, provider)
    );
}

export function deactivate() {}
