export interface User {
  email: string;
  password: string;
  username: string;
}

class UserStore {
  records: User[];

  constructor() {
    this.records = [];
  }

  create(user: User) {
    this.records.push(user);
    return user;
  }

  findUnique(email: string) {
    return this.records.find((user) => user.email === email);
  }

  getAll() {
    return this.records;
  }
}

export const userStore = new UserStore();