import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';


export class FileProvider {
  constructor(private notesRootFolder: string, private notesExtension: string) {
    if (!this.pathExists(notesRootFolder)) {
      fs.ensureDirSync(notesRootFolder);
    }
    this.notesRootFolder = notesRootFolder;
  }

  newFile(fileName: string): string {
    const filePath = path.join(
      this.notesRootFolder,
      `${fileName}`
    );
    if (this.pathExists(filePath)) {
      return ''; // File already exists
    } else {
      fs.writeFileSync(filePath, '', 'utf8');
      vscode.window.showInformationMessage(`File created: ${filePath}`);
      return filePath;
    }
  }

  renameFile(uri: vscode.Uri, newName: string): vscode.Uri {
    const filePath = uri.fsPath;
    const dirPath = path.parse(filePath).dir;
    const newPath = path.join(dirPath, `${newName}`);
    fs.renameSync(filePath, newPath);
    return vscode.Uri.file(newPath);
  }

  deleteFile(uri: vscode.Uri): void {
    if (this.pathExists(uri.fsPath)) {
      fs.unlinkSync(uri.fsPath);
    }
  }

  pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
      return true;
    } catch (err) {
      return false;
    }
  }
}
