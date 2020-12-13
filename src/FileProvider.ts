import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class FileProvider {
	constructor(private notesRootFolder: string, private notesExtension: string) {}

	newFile(fileName: string) : string{
	  const filePath = path.join(this.notesRootFolder,`${fileName}.${this.notesExtension}`);
	  if (this.pathExists(filePath)){
		return '';
	  }else{
		fs.closeSync(fs.openSync(filePath, 'w'));
		return filePath;
	  }
	}
	renameFile(uri: vscode.Uri, newName: string) : vscode.Uri{
	  const filePath = uri.fsPath;
	  const dirPath = path.parse(filePath).dir;
	  const newPath = path.join(dirPath, `${newName}.${this.notesExtension}`);
	  fs.renameSync(filePath, newPath);
	  return vscode.Uri.parse(newPath);
	}

	deleteFile(uri: vscode.Uri){
	  fs.unlinkSync(uri.fsPath);
	}

	pathExists(p: string): boolean {
	  try {
		  fs.accessSync(p);
	  } catch (err) {
		return false;
	  }
	  return true;
	}
  }