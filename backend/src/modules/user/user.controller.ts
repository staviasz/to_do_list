import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto, LoginDto, RefreshSessionDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post('/refresh')
  refresh(@Body() refreshSessionDto: RefreshSessionDto) {
    return this.userService.refreshSession(refreshSessionDto);
  }
}
