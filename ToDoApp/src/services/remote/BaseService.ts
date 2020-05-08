import FetchService, {HttpResponse} from './FetchService';
import Config from 'react-native-config';
import {AsyncStorage} from 'react-native';
const defaultHeaders = new Headers();
defaultHeaders.append('Cache-Control', 'no-cache');
defaultHeaders.append('Content-Type', 'application/json');

class BaseService extends FetchService {
  headers: Headers = defaultHeaders;
  baseUrl: string = Config.API_URL;
  baseApiUrl?: string;

  constructor(headers?: [string[]], baseUrl?: string, baseApiUrl?: string) {
    super();
    if (headers && headers.length) {
      this.addHeaders(headers);
    }
    if (baseUrl) {
      this.baseUrl = baseUrl;
    }
    if (baseApiUrl) {
      this.baseApiUrl = baseApiUrl;
    }
  }
  addHeaders(headers: [string[]]) {
    headers.forEach((headerArr: string[]) => {
      this.headers.set(headerArr[0], headerArr[1]);
    });
  }
  async addAuthorizationHeader() {
    const token = await AsyncStorage.getItem('@BarberMe:auth-token');
    this.addHeaders([['Authorization', token || '']]);
  }
  get fullApiUrl() {
    return `${this.baseUrl}/${this.baseApiUrl}`;
  }
}

export default BaseService;
