import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10); // Hasheia a senha
    const registration_number = Math.floor(Math.random() * 1000000).toString();

    const newUser = await this.userModel.create({
      ...user,
      password: hashedPassword,
      registration_number,
    });

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const [updated] = await this.userModel.update(user, { where: { id } });
    if (!updated) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.userModel.destroy({ where: { id } });
    if (!deleted) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log(`User with ID ${id} deleted successfully.`);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }
}
