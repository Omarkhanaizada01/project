declare module "better-sqlite3" {
  interface DatabaseOptions {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (...params: any[]) => void;
  }

  interface Statement {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): unknown;
    all(...params: any[]): unknown[];
    iterate(...params: any[]): IterableIterator<unknown>;
    pluck(toggleState?: boolean): this;
    expand(toggleState?: boolean): this;
    raw(toggleState?: boolean): this;
    bind(...params: any[]): this;
  }

  class Database {
    constructor(path: string, options?: DatabaseOptions);
    prepare(sql: string): Statement;
    exec(sql: string): void;
    close(): void;
  }

  export = Database;
}
