# vNotes
## Features

vnote is simple extension allow user to create notes and store them at single location anywhere on the system.


## Requirements
  vnote support different types of files like markdown and asciidoc. based on type of notes you're using support plugins needs be installed.
  * [AsciiDoc Extension](https://marketplace.visualstudio.com/items?itemName=asciidoctor.asciidoctor-vscode)
  * [Markdown Extension](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one
  )

## Extension Settings

This extension contributes the following settings `settings.json`:

* `vnote.notesLocation`: set the location for the notes. `default` is `~/vnote`
* `vnote.notesDefaultExtension`: set file type `default` is `md`
* `vnote.openPreview`: if set extension will try to open preview (preview extensions are not included)
* `vnote.ignoredExtensions`: by default notes explorer now list all files in vnotes folder however you can add extensions to ignoreExtensions to ignore them. eg. `vnote.ignoredExtensions:'ts,js'`

## Release Notes

* `vnotes.notesExtension` is now deprecated in favour of `vnote.notesDefaultExtension`. now you can create files with any extension when creating files.
* changing default behavior of only list files with `vnotes.notesExtension` and now its list all extensions. files can be ignored using `vnote.ignoredExtensions` option.
* rename input have old filename as default value.

### 0.2.0

Beta release of extension support asciidoc and markdown with auto-preview.

### [Patreon](https://www.patreon.com/imkrishnaagrawal)

**Enjoy!**
