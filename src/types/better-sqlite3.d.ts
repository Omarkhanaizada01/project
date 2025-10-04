declare module "better-sqlite3" {
    class Database {
      constructor(path: string, options?: any);
      prepare(sql: string): any;
      exec(sql: string): void;
      close(): void;
    }
  
    export = Database;
  }
  