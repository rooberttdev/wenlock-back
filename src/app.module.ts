import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'dpg-crv52l08fa8c73cr9rtg-a',
      port: 5432,
      username: 'root',
      password: 'vuqzbjTkBz17fe8pUiSyO189ZuhQarQ8',
      database: 'wenlock',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
  ],
})
//teste
export class AppModule {}
