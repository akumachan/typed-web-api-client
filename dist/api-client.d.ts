declare type AllowOneOrMoreOf<T extends object> = T | ({
    [K in keyof T]: {
        [K2 in Exclude<keyof T, K>]?: undefined;
    } & {
        [_ in K]: T[K];
    };
} extends infer $ ? $[keyof $] : never);
declare type PathPattern = `/${string}`;
declare type MethodList = 'GET' | 'POST' | 'PUT' | 'DELETE';
declare type ApiScheme = {
    [path in PathPattern]: AllowOneOrMoreOf<{
        [method in MethodList]: {
            parameters: unknown;
            response: unknown;
        };
    }>;
};
declare type Method<A extends ApiScheme, S extends string | symbol | number> = {
    [I in keyof A]: S extends I ? keyof A[I] extends MethodList ? keyof A[I] : never : never;
}[keyof A];
declare type GetType<A extends ApiScheme, K> = K extends keyof A ? A[K] : undefined;
export declare const ApiClient: (url: `http${string}/`) => {
    service: <T extends ApiScheme>() => {
        call: <P extends keyof T, M extends Method<T, P>, Parameters_1 extends GetType<T[P][M], "parameters">, Response_1 extends GetType<T[P][M], "response">>(path: P, method: M, parameters: Parameters_1) => Promise<Response_1>;
    };
};
export {};
