import {api} from '../http';
import {AxiosResponse} from 'axios';
import { UsersResponse } from '../models/response/usersResponse';

export default class UserSerivce {

    static async fetch(): Promise<AxiosResponse<UsersResponse>> {
        return api.get<UsersResponse>('/api/users')
    }

}