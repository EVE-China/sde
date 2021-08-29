import { Database } from "sqlite3"

export class PromiseDatabase {

  private db:Database;

  constructor(db: Database) {
    this.db = db;
  }

  exec(sql: string) {
    return new Promise<void>((resolve, reject) => {
      this.db.exec(sql, (err) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      })
    });
  }

  run(sql: string) {
    return new Promise<void>((resolve, reject) => {
      this.db.run(sql, err => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  close() {
    return new Promise<void>((resolve, reject) => {
      this.db.close(err => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }
}