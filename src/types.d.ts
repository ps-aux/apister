
export type HttpResponse = Promise<any> & {
    expectStatus: (status: number) => HttpResponse
    expectType: (type: any) => HttpResponse
    data: () => Promise<any>
}

export type ApiHttpClient = {
    get: (url: string, opts?: any) => HttpResponse
    post: (url: string, data: any) => HttpResponse
    put: (url: string, data: any) => HttpResponse
    delete: (url: string) => HttpResponse
}
