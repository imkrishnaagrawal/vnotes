// import { FileExplorer } from './FileProvider';
import { NotesProvider } from './NotesProvider';
import * as vscode from 'vscode';




export function activate(context: vscode.ExtensionContext) {

	const notesLocation = <string>vscode.workspace.getConfiguration().get('notes.notesLocation');
	const notesExtension = <string>vscode.workspace.getConfiguration().get('notes.notesExtension');

	const notesProvider = new NotesProvider(notesLocation, notesExtension === undefined ? 'adoc': notesExtension);

	vscode.window.registerTreeDataProvider('notesView', notesProvider);

	const disposables = [
		vscode.commands.registerCommand('vnotes.newNote', async (resource)=> await notesProvider.newNote(resource)),
		vscode.commands.registerCommand('vnotes.refreshNotes',  (resource: vscode.TreeItem)=>  notesProvider.refresh()),
		vscode.commands.registerCommand('vnotes.openFile', async (resource: vscode.TreeItem)=> resource.resourceUri ? await notesProvider.openNote(resource.resourceUri) : console.error('Open File Handler')),
		vscode.commands.registerCommand('vnotes.renameNote', async (resource: vscode.TreeItem)=> resource.resourceUri ? await notesProvider.renameNote(resource.resourceUri): console.error('Open File Handler')),
		vscode.commands.registerCommand('vnotes.deleteNote', (resource: vscode.TreeItem)=> resource.resourceUri ? notesProvider.deleteNote(resource.resourceUri): console.error('Open File Handler')),
	];

	disposables.forEach((disposable)=> context.subscriptions.push(disposable));


}

export function deactivate() { }
