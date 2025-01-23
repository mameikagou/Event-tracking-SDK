
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 基础响应格式
// 响应状态码枚举
export enum ResponseCode {
    SUCCESS = 200,           // 成功
    BAD_REQUEST = 400,      // 请求参数错误
    UNAUTHORIZED = 401,     // 未授权
    FORBIDDEN = 403,        // 禁止访问
    NOT_FOUND = 404,        // 资源不存在
    INTERNAL_ERROR = 500,   // 服务器内部错误
}

// 响应消息映射
export const ResponseMessage = {
    [ResponseCode.SUCCESS]: '操作成功',
    [ResponseCode.BAD_REQUEST]: '请求参数错误',
    [ResponseCode.UNAUTHORIZED]: '未授权',
    [ResponseCode.FORBIDDEN]: '禁止访问',
    [ResponseCode.NOT_FOUND]: '资源不存在',
    [ResponseCode.INTERNAL_ERROR]: '服务器内部错误',
}

// 基础响应接口
export interface BaseResponse<T = any> {
    code: ResponseCode;          // 状态码
    message: string;            // 提示信息
    data?: T;                   // 响应数据
    timestamp?: number;         // 时间戳
    requestId?: string;         // 请求ID，用于追踪
}


// 创建请求类
class HttpRequest {
  // axios 实例
  private instance: AxiosInstance;
  
  constructor(config?: AxiosRequestConfig) {
    // 创建 axios 实例
    this.instance = axios.create({
      baseURL: process.env.API_BASE_URL,
      timeout: 10000,
      ...config
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        // 2xx 范围内的状态码都会触发该函数
        const { data } = response;
        if (data.code !== 200) {
          // 业务错误处理
          return Promise.reject(new Error(data.message));
        }
        return data;
      },
      (error) => {
        // 超出 2xx 范围的状态码都会触发该函数
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // 未授权，跳转到登录页
              // router.push('/login');
              break;
            case 403:
              // 权限不足
              break;
            case 404:
              // 请求的资源不存在
              break;
            case 500:
              // 服务器错误
              break;
            default:
              break;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // GET 请求
  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return this.instance.get(url, config);
  }

  // POST 请求
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return this.instance.post(url, data, config);
  }

  // PUT 请求
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // DELETE 请求
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    return this.instance.delete(url, config);
  }
}

// 导出请求实例
export const http = new HttpRequest();

// 使用示例：
interface User {
  id: number;
  name: string;
  email: string;
}

// 获取用户信息
export const getUserInfo = (id: number) => {
  return http.get<User>(`/user/${id}`);
};

// 创建用户
export const createUser = (data: Omit<User, 'id'>) => {
  return http.post<User>('/user', data);
};

// 更新用户
export const updateUser = (id: number, data: Partial<User>) => {
  return http.put<User>(`/user/${id}`, data);
};

// 删除用户
export const deleteUser = (id: number) => {
  return http.delete(`/user/${id}`);
};

/* 使用方式：
async function fetchUserData() {
  try {
    const response = await getUserInfo(1);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

async function createNewUser() {
  try {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    const response = await createUser(newUser);
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
}
*/