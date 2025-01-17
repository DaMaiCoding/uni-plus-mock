import { Request, BadRequestException, Body, Controller, Get, Inject, Post, Req, UnauthorizedException, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';

const users = [
  { username: 'uniLin', password: '111111', email: 'xxx@xxx.com' },
]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  @Inject(JwtService)
  private jwtService: JwtService

  /* get 测试 */
  @Get('getTest')
  getTest(@Query() query: any) {
    return {
      code: 0,
      data: {
        userName: "uni-lin",
        userId: "sfc151512135155",
        accessToken: "sd15f1as15d61as1fd5",
        refreshToken: "1s5d1f51as5df61a5f5d16",
        query,
      },
      msg: 'success',
    }
  }

  /* post 测试 */
  @Post('postTest')
  postTest(@Query() query: any, @Body() data: Body) {
    return {
      code: 0,
      data: {
        userName: "uni-lin",
        userId: "sfc151512135155",
        accessToken: "sd15f1as15d61as1fd5",
        refreshToken: "1s5d1f51as5df61a5f5d16",
        data,
        query,
      },
      msg: 'success',
    }
  }

  /* 登录接口，获取 token */
  @Post('login')
  login(@Body() userDto: UserDto) {
    const user = users.find(item => item.username === userDto.username);

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    if (user.password !== userDto.password) {
      throw new BadRequestException("密码错误");
    }

    const accessToken = this.jwtService.sign({
      username: user.username,
      email: user.email
    }, {
      expiresIn: '0.5h'
    });

    const refreshToken = this.jwtService.sign({
      username: user.username
    }, {
      expiresIn: '7d'
    })

    return {
      data: {
        userInfo: {
          username: user.username,
          email: user.email
        },
        accessToken,
        refreshToken
      }
    };
  }

  /* 获取用户信息 */
  @Get('userInfo')
  getUserInfo(@Req() req: Request) {
    const authorization = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }
    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      return {
        data: [
          { name: 'book1' },
          { name: 'book2' },
          { name: 'book3' },
          { name: 'book4' },
          { name: 'book5' },
        ]
      };
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }

  /* 刷新 token */
  @Get('refresh')
  refresh(@Query('refreshToken') token: string) {
    try {
      const data = this.jwtService.verify(token);

      const user = users.find(item => item.username === data.username);

      const accessToken = this.jwtService.sign({
        username: user.username,
        email: user.email
      }, {
        expiresIn: '0.5h'
      });

      const refreshToken = this.jwtService.sign({
        username: user.username
      }, {
        expiresIn: '7d'
      })

      return {
        data: {
          code: 200,
          accessToken,
          refreshToken
        }
      };

    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }

}
