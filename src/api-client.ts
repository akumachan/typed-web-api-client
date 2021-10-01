import axios, { AxiosResponse } from "axios"

type AllowOneOrMoreOf<T extends object> =
  T | ({
    [ K in keyof T ]:
      { [K2 in Exclude<keyof T, K>]?: undefined }
        & { [_ in K]: T[K] }
  } extends infer $ ? $[keyof $] : never)

type PathPattern = `/${string}`
type MethodList = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Path<A extends ApiScheme> = keyof A
type Method<A extends ApiScheme, S extends string | symbol | number> = {
  [I in keyof A]: S extends I ? keyof A[I] extends MethodList ? keyof A[I] : never : never
}[keyof A]
type GetType<A extends ApiScheme, K> = K extends keyof A ? A[K] : undefined

export type ApiScheme = {
  [ path in PathPattern ]: AllowOneOrMoreOf<{
    [ method in MethodList ]: { 
      parameters: unknown;
      response: unknown
    }
  }>;
}
export type HttpResponse<T> = Pick<AxiosResponse<T>, 'data' | 'status' | 'statusText'>

export class ApiClient {
  constructor(private url: `http${string}`) {}
  service<T extends ApiScheme>() {
    return {  
      call: async<
        P extends Path<T>, 
        M extends Method<T, P>, 
        ApiParameters extends GetType<T[P][M], 'parameters'>,
        ApiResponse extends GetType<T[P][M], 'response'>
      >(path: P, method: M, parameters: ApiParameters): Promise<HttpResponse<ApiResponse>> => {

        const fullPath = `${this.url}${path as string}`
        type MethodTypeForAxios = 'get' | 'post' | 'put' | 'delete'
        const methodName = method.toLowerCase() as MethodTypeForAxios

        return axios[methodName]<ApiResponse>(fullPath, parameters)
      }
    }
  }
}

export const ApiClient2 = (url: `http${string}`) => ({
  service: <T extends ApiScheme>() => {
    return {  
      call: async<
        P extends Path<T>, 
        M extends Method<T, P>, 
        ApiParameters extends GetType<T[P][M], 'parameters'>,
        ApiResponse extends GetType<T[P][M], 'response'>
      >(path: P, method: M, parameters: ApiParameters): Promise<HttpResponse<ApiResponse>> => {

        const fullPath = `${url}${path as string}`
        const methodName = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' 
        return axios[methodName]<ApiResponse>(fullPath, parameters)
      }
    }
  }
})