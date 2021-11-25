import axios from 'axios';
import { HttpGetClient } from '.';

export class AxiosHttpClient {
  async get(agrs: HttpGetClient.Params): Promise<any> {
    const result = await axios.get(agrs.url, { params: agrs.params });

    return result.data;
  }
}
