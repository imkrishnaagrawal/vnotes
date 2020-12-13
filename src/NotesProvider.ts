import { FileProvider } from './FileProvider';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class NotesProvider implements vscode.TreeDataProvider<TreeItem> {

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
  private fp: FileProvider;

  constructor(private notesRootFolder: string, private notesExtension: string) {
    this.fp = new FileProvider(notesRootFolder, notesExtension);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: TreeItem | undefined): vscode.ProviderResult<TreeItem[]> {
    if (this.fp.pathExists(this.notesRootFolder)) {
      return fs.readdirSync(this.notesRootFolder).filter(i => i.indexOf(this.notesExtension) !== -1).map(i => new TreeItem(vscode.Uri.file(path.join(this.notesRootFolder, i))));
    }
  }


  refresh() {
    this._onDidChangeTreeData.fire();
  }

  async renameNote(uri: vscode.Uri) {
    const newName = await this.showInputBox();
    if (newName) {
      vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups");
      vscode.commands.executeCommand('workbench.action.closeActiveEditor');
      this.fp.renameFile(uri, newName);
      this.refresh();
    }
  }

  deleteNote(uri: vscode.Uri) {
    this.fp.deleteFile(uri);
    this.refresh();
  }

  async showInputBox(): Promise<string | undefined> {
    let value = await vscode.window.showInputBox();
    return value === undefined || value.length < 1 ? undefined : value;
  }

  async newNote(resource: any) {

    const fileName = await this.showInputBox();
    if (fileName) {
      if (this.fp.pathExists(path.join(this.notesRootFolder, `${fileName}.${this.notesExtension}`))) {
        vscode.window.showInformationMessage('File Already Exists');
        return;
      }
      const filePath = this.fp.newFile(fileName);
      this.refresh();
      await this.openNote(vscode.Uri.file(filePath));
    }
  }

  async openNote(resource: vscode.Uri) {

    const doc = (await vscode.window.showTextDocument(resource)).document;
    if (doc) {
      await vscode.commands.executeCommand("workbench.action.closeEditorsInOtherGroups");
      await vscode.commands.executeCommand(`${doc.languageId}.showPreviewToSide`);
      await new Promise(resolve =>
        setTimeout(() => {
          resolve(1);
        }, 420)
      );
      await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
    }
  }
}


class TreeItem extends vscode.TreeItem {
  children: TreeItem[] | undefined;
  contextValue = 'note';
  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'note.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'note.svg')
  };
  constructor(resourceUri: vscode.Uri, children?: TreeItem[]) {
    super(
      resourceUri,
      children === undefined ? vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
    this.command = { command: 'vnotes.openFile', title: "Open File", arguments: [this], };
  }
}