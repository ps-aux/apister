import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { validateAgainstSchema } from 'src/schema/validate'
import { ApiHttpClient, HttpResponse } from 'src/index'



type PromiseExpect = (res: AxiosResponse) => void

type ExpectingPromise = Promise<any> & {
    expect: (x: PromiseExpect) => ExpectingPromise
}

const toExpecting = (p: Promise<AxiosResponse>): ExpectingPromise => {
    const ap = p as ExpectingPromise
    ap.expect = (pe: PromiseExpect) => {
        const neu = p.then(r => {
            pe(r)
            return r
        })
        return toExpecting(neu)
    }
    return ap
}

const toHttpResponse = (p: ExpectingPromise, ctx: any): HttpResponse => {
    // @ts-ignore
    const res = p as HttpResponse

    res.expectStatus = status => {
        const id = ctx.expectId
        const r = p.expect(r => {
            // Another status check was registered afterwards - has priority
            if (ctx.statusChecker !== id) return
            if (status !== r.status) {
                console.error(r.data)
                throw new Error(
                    `Expected status ${status}, got ${r.status} instead`
                )
            }
        })
        ctx.statusChecker = id

        ctx.expectId++
        return toHttpResponse(r, ctx)
    }

    res.expectType = type => {
        const r = p.expect(r => {
            const error = validateAgainstSchema(r.data, type)
            if (error) throw error
        })
        ctx.expectId++
        return toHttpResponse(r, ctx)
    }

    res.data = () => {
        return p.then(r => r.data)
    }

    return res
}

type HttpClientOpts = {
    baseUrl: string
    interceptor?: (req: AxiosRequestConfig) => AxiosRequestConfig
}

const HttpClient = (opts: HttpClientOpts): ApiHttpClient => {
    const ax = axios.create({
        baseURL: opts.baseUrl,
        validateStatus: () => true
    })

    if (opts.interceptor) ax.interceptors.request.use(opts.interceptor)

    const ctx = {
        expectId: 0
    }

    const convertRes = res => {
        const ep = toExpecting(res)
        return toHttpResponse(ep, ctx).expectStatus(200)
    }

    return {
        get: (url, opts) => convertRes(ax.get(url, opts)),
        post: (url, data) => convertRes(ax.post(url, data)),
        put: (url, data) => convertRes(ax.put(url, data)),
        delete: url => convertRes(ax.delete(url))
    }
}

export default HttpClient
