import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let codeChest: string[] = [];

export function activate(context: vscode.ExtensionContext) {
    let addToCodeChest = vscode.commands.registerCommand('extension.addToCodeChest', async () => {
        const files = await vscode.window.showOpenDialog({
            canSelectMany: true,
            openLabel: 'Add to CodeChest || Añadir al CodeCofre'
        });

        if (!files || files.length === 0) {
            vscode.window.showWarningMessage('No files selected.  || No hay archivos seleccionados');
            return;
        }

        for (const file of files) {
            codeChest.push(file.fsPath);
            vscode.window.showInformationMessage(`Added ${path.basename(file.fsPath)} to CodeChest.`);
        }
    });

    let copyFromCodeChest = vscode.commands.registerCommand('extension.copyFromCodeChest', () => {
        if (codeChest.length === 0) {
            vscode.window.showWarningMessage('CodeChest is empty. || El CodeCofre esta vacio!');
            return;
        }

        let content = '';
        for (const filePath of codeChest) {
            const fileName = path.basename(filePath);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            content += `// ${fileName}\n${fileContent}\n\n`;
        }

        const workspacePath = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
        const savePath = path.join(workspacePath || '', 'YourCodeChest.txt');
        fs.writeFileSync(savePath, content);
        vscode.window.showInformationMessage(`Files content copied from CodeChest to ${savePath} || Todo copiado al CodeCofre`);

        codeChest = [];
    });

    context.subscriptions.push(addToCodeChest, copyFromCodeChest);
}
