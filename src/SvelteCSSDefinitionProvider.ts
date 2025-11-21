import * as vscode from "vscode";

export class SvelteCssDefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ) {
    const range = document.getWordRangeAtPosition(position, /[\w-]+/);
    if (!range) return null;

    const className = document.getText(range);
    const fullText = document.getText();

    const before = document.getText(
      new vscode.Range(new vscode.Position(position.line, 0), range.start)
    );

    if (!before.includes("class")) return null;

    console.log("class name ", className)
    const styleMatch = this.findInStyleTag(document, fullText, className);
    if (styleMatch) return styleMatch;

    const externalMatch = await this.findInExternalFiles(document, className);
    if (externalMatch) return externalMatch;

    return null;
  }

  private findInStyleTag(
    document: vscode.TextDocument,
    text: string,
    className: string
  ): vscode.Location | null {
    const styleStart = text.indexOf("<style");
    if (styleStart === -1) return null;

    const styleEnd = text.indexOf("</style>");
    const styleContent = text.substring(styleStart, styleEnd);

    const regex = new RegExp(`\\.${className}\\b`);
    const match = regex.exec(styleContent);

    if (!match) return null;

    const absoluteOffset = styleStart + match.index;
    const startPosition = this.getPositionOfOffset(text, absoluteOffset);
    const endPosition = startPosition.translate(0, className.length + 1);

    return new vscode.Location(
      document.uri,
      new vscode.Range(startPosition, endPosition)
    );
  }

  private getPositionOfOffset(text: string, offset: number): vscode.Position {
    const preceding = text.substring(0, offset);
    const lines = preceding.split("\n");
    const line = lines.length - 1;
    const character = lines[lines.length - 1].length;
    return new vscode.Position(line, character);
  }

  private async findInExternalFiles(
    doc: vscode.TextDocument,
    className: string
  ) {
    const files = await vscode.workspace.findFiles("**/*.{css,scss}");

    for (const file of files) {
      const content = (await vscode.workspace.openTextDocument(file)).getText();
      const regex = new RegExp(`\\.${className}\\b`);
      const match = regex.exec(content);

      if (match) {
        const position = new vscode.Position(
          content.substring(0, match.index).split("\n").length - 1,
          0
        );
        return new vscode.Location(file, position);
      }
    }
  }
}
