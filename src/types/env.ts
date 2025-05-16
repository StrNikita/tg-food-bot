import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  readonly POSTGRES_USER: string;

  @IsString()
  @IsNotEmpty()
  readonly POSTGRES_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  readonly POSTGRES_DB: string;

  @IsString()
  @IsNotEmpty()
  readonly POSTGRES_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  readonly POSTGRES_PORT: number;

  @IsNumber()
  @IsNotEmpty()
  readonly SERVER_PORT: number;

  @IsString()
  @IsNotEmpty()
  readonly TELEGRAM_BOT_TOKEN: string;
}
