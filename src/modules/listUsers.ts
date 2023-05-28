import { User } from "@app/modules";

declare global {
  var listUsers: ListUsers;
}

export class ListUsers extends Map<number, User> {
  constructor() {
    super();
    globalThis.listUsers = this;
  }
}
