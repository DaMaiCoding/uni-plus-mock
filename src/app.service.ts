import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getList(query) {
    const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_page=${query.page}&_limit=${query.limit}`)
    return {
      data: res.data
    }
  }
}
