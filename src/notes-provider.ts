import { FileProvider } from './file-provider';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class NotesProvider implements vscode.TreeDataProvider<TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private fp: FileProvider;

  constructor(private notesRootFolder: string, private notesExtension: string, private autoPreview: boolean, private ignore: string[]) {
    this.fp = new FileProvider(notesRootFolder, notesExtension);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: TreeItem): vscode.ProviderResult<TreeItem[]> {
    if (this.fp.pathExists(this.notesRootFolder)) {
      return fs.readdirSync(this.notesRootFolder)
        .filter(i => i.endsWith(`.${this.notesExtension}`) || !this.ignore.includes(path.extname(i).slice(1))  )
        .map(i => new TreeItem(vscode.Uri.file(path.join(this.notesRootFolder, i))));
    }
    return [];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  async renameNote(uri: vscode.Uri): Promise<void> {
    const newName = await vscode.window.showInputBox({ prompt: 'Enter the new name of the file' , value: path.basename(uri.fsPath)});
    if (newName) {
      if (this.autoPreview === true){
        await vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups");
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
      }
      this.fp.renameFile(uri, newName);
      this.refresh();
      this.openNote(vscode.Uri.file(path.join(this.notesRootFolder, newName)));
    }
  }

  async deleteNote(uri: vscode.Uri): Promise<void> {
    const confirm = await vscode.window.showWarningMessage(
      `Are you sure you want to delete the note: ${path.basename(uri.fsPath)}?`,
      { modal: true },
      'Yes', 'No'
    );

    if (confirm === 'Yes') {
      this.fp.deleteFile(uri);
      this.refresh();
    }
  }

  async showInputBox(prompt: string = 'Enter the name of the note'): Promise<string | undefined> {
    const value = await vscode.window.showInputBox({ prompt });
    return value === undefined || value.trim().length < 1 ? undefined : value.trim();
  }

  async newNote(): Promise<void> {
    let fileName = await vscode.window.showInputBox({ prompt: 'Enter the name of the file to read' });
    if (fileName) {
      if (!fileName.includes('.')) {
        fileName = `${fileName}.${this.notesExtension}`;
      }
      const filePath = path.join(this.notesRootFolder, `${fileName}`);
      if (this.fp.pathExists(filePath)) {
        vscode.window.showInformationMessage('File already exists');
        return;
      }
      this.fp.newFile(fileName);
      this.refresh();
      await this.openNote(vscode.Uri.file(filePath));
    }
  }

  async openNote(resource: vscode.Uri): Promise<void> {
    try {

      if (resource === undefined) {
        resource = vscode.Uri.file(await vscode.window.showInputBox({ prompt: 'Enter the name of the file to read' }) || 'default');
      }
      const doc = await vscode.workspace.openTextDocument(resource);
      const editor = await vscode.window.showTextDocument(doc);
      vscode.window.showInformationMessage(`Auto Preview: ${this.autoPreview ? 'Enabled' : 'Disabled'}`);
      if (this.autoPreview === true) {
        await vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups");
        await vscode.commands.executeCommand(`${editor.document.languageId}.showPreviewToSide`);
        await new Promise(resolve => setTimeout(resolve, 420));
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(`Failed to open note: ${error.message}`);
    }
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(public readonly resourceUri: vscode.Uri, public readonly children?: TreeItem[]) {
    super(
      resourceUri,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded
    );

    this.contextValue = 'note';
    this.iconPath = {
      light: path.join(__filename, '..', '..', 'resources', 'light', 'note.svg'),
      dark: path.join(__filename, '..', '..', 'resources', 'dark', 'note.svg')
    };
    this.command = {
      command: 'extension.openNote',
      title: "Open Note",
      arguments: [resourceUri]
    };
  }
}
