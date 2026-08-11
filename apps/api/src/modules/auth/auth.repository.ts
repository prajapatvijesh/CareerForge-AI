import { User, IUser } from './user.model';

export class AuthRepository {
  public async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select('+password');
    }
    return query.exec();
  }

  public async findById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  public async findByRefreshToken(token: string): Promise<IUser | null> {
    return User.findOne({ refreshToken: token }).exec();
  }

  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  public async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: token }).exec();
  }
}
