import * as vscode from 'vscode';
import { NotesProvider } from './notes-provider';
import { resolveHome } from './utils';

export function activate(context: vscode.ExtensionContext) {
  const notesLocation = <string>vscode.workspace.getConfiguration().get('vnotes.notesLocation');
  let notesExtension = <string>vscode.workspace.getConfiguration().get('vnotes.notesDefaultExtension');
  if (notesExtension.startsWith('.')) {
    notesExtension = notesExtension.slice(1);
  }
  const ignoredExtensions = <string>vscode.workspace.getConfiguration().get('vnotes.ignoredExtensions');
  const ignore = ignoredExtensions.split(',').map(extension => extension.startsWith('.') ? extension.slice(1) : extension);
  const autoPreview = <boolean>vscode.workspace.getConfiguration().get('vnotes.openPreview');

  const notesProvider = new NotesProvider(resolveHome(notesLocation), notesExtension, autoPreview, ignore);

  vscode.window.registerTreeDataProvider('notesView', notesProvider);
  const disposables = [
    vscode.commands.registerCommand('extension.refreshNotes',  ()=>  notesProvider.refresh()),
    vscode.commands.registerCommand('extension.newNote', async () => await notesProvider.newNote()),
		vscode.commands.registerCommand('extension.renameNote', async (resource: vscode.TreeItem)=> resource.resourceUri ?  notesProvider.renameNote(resource.resourceUri): console.error('Open File Handler')),
		vscode.commands.registerCommand('extension.deleteNote', async (resource: vscode.TreeItem) => resource.resourceUri ?  notesProvider.deleteNote(resource.resourceUri): console.error('Open File Handler')),
		vscode.commands.registerCommand('extension.openNote', async (resourceUri: vscode.Uri)=>   notesProvider.openNote(resourceUri)),
	];
  disposables.forEach((disposable)=> context.subscriptions.push(disposable));

}


export function deactivate() {}
