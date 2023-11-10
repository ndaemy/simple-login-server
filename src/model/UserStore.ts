import Database from 'better-sqlite3';

export interface User {
  email: string;
  password: string;
  username: string;
}

class UserStore {
  db;

  constructor() {
    this.db = new Database('database.db', { verbose: console.log });
    this.db.prepare('CREATE TABLE IF NOT EXISTS users (email TEXT, password TEXT, username TEXT)').run();
  }

  create(user: User) {
    const { email, password, username } = user;
    const stmt = this.db.prepare('INSERT INTO users VALUES (?, ?, ?)');
    stmt.run(email, password, username);
    return user;
  }

  findUnique(email: string) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    return user as User;
  }

  getAll() {
    const stmt = this.db.prepare('SELECT * FROM users');
    const users = stmt.all();
    return users as User[];
  }
}

export const userStore = new UserStore();