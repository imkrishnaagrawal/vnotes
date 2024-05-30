import * as os from 'os';
import * as path from 'path';

export function resolveHome(filepath: string): string {
    if (!filepath) {
      return '';
    }

    if (filepath[0] === '~') {
      return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
  }
