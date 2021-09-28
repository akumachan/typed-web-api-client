import axios from "axios"

type AllowOneOrMoreOf<T extends object> =
  T | ({
    [ K in keyof T ]:
      { [K2 in Exclude<keyof T, K>]?: undefined }
        & { [_ in K]: T[K] }
  } extends infer $ ? $[keyof $] : never)

type PathPattern = `/${string}`
type MethodList = 'GET' | 'POST' | 'PUT' | 'DELETE'

type ApiScheme = {
  [ path in PathPattern ]: AllowOneOrMoreOf<{
    [ method in MethodList ]: { 
      parameters: unknown;
      response: unknown
    }
  }>;
}

type Path<A extends ApiScheme> = keyof A
type Method<A extends ApiScheme, S extends string | symbol | number> = {
  [I in keyof A]: S extends I ? keyof A[I] extends MethodList ? keyof A[I] : never : never
}[keyof A]
type GetType<A extends ApiScheme, K> = K extends keyof A ? A[K] : undefined

export const ApiClient = (url: `http${string}`) => ({
  service: <T extends ApiScheme>() => {
    return {  
      call: async<
        P extends Path<T>, 
        M extends Method<T, P>, 
        Parameters extends GetType<T[P][M], 'parameters'>,
        Response extends GetType<T[P][M], 'response'>
      >(path: P, method: M, parameters: Parameters): Promise<Response> => {

        const fullPath = `${url}${path as string}`
        const methodName = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' 
        const response = await axios[methodName]<Response>(fullPath, parameters)

        if(response.status === 200) {
          return response.data
        } else {
          throw new Error()
        }
      }
    }
  }
})