import { User } from '../models/user.model';

export class UserService {
  async findOneById(id: number): Promise<User> {
    return await new Promise(() => new User());
  }
}
