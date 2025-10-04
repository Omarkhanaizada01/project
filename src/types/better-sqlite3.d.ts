declare module "better-sqlite3" {
  interface RunResult {
    changes: number;
    lastIntertRowid: number;
    
  }

  interface Statement {
    run(...params: unknown[]): RunResult;
    get<T = unknown>(...params: unknown[]): T | undefined;
    all<T = unknown>(...params: unknown[]): T[];
  }

  class Database {
    constructor(path: string, options?: { readonly?: boolean; fileMustExist?: boolean });
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  export = Database;
}
