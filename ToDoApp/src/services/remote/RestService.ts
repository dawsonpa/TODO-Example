import BaseService from './BaseService';
import {EntitySchema} from "typeorm";

export interface IRestService<T> {
  createOne: (body: T) => Promise<T | null | undefined>;
  getAll: () => Promise<T[] | null | undefined>;
  getOne: (id: string | number) => Promise<T | null | undefined>;
  updateOne: (id: string | number, body: T) => Promise<T | null | undefined>;
  deleteOne: (id: string | number) => Promise<T | string | null | undefined>;
}

class RestService<T> extends BaseService implements IRestService<any> {
  constructor(entity: EntitySchema<T>, baseApiUrl: string, baseUrl?: string) {
    super(undefined, baseUrl, baseApiUrl);
  }
  async createOne(body: T) {
    await this.addAuthorizationHeader();
    const response =  await this.post<T>(this.fullApiUrl, body, {headers: this.headers});
    return response.parsedBody;
  }
  async getAll() {
    await this.addAuthorizationHeader();
    const response = await this.get<T[]>(`${this.fullApiUrl}`, {headers: this.headers});
    return response.parsedBody;
  }
  async getOne(id: string | number) {
    await this.addAuthorizationHeader();
    const response = await this.get<T>(`${this.fullApiUrl}/${id}`, {headers: this.headers});
    return response.parsedBody
  }
  async updateOne(id: string | number, body: T) {
    await this.addAuthorizationHeader();
    const response = await this.put<T>(`${this.fullApiUrl}/${id}`, body, {
      headers: this.headers,
    });

    return response.parsedBody
  }
  async deleteOne(id: string | number) {
    await this.addAuthorizationHeader();
    await this.delete<string>(`${this.fullApiUrl}/${id}`, {
      headers: this.headers,
    });

    return 'deleted';
  }
}

export default RestService;
