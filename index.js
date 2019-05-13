import axios from 'axios';
import joi from 'joi';

const validateAgainstSchema = (obj, schema) => {
  if (!obj) return new Error('No value to validate. Maybe HTTP response is empty?');
  const res = joi.validate(obj, schema, {
    allowUnknown: true,
    presence: 'required',
    abortEarly: false // All errors

  });
  return res.error;
};

const toExpecting = p => {
  const ap = p;

  ap.expect = pe => {
    const neu = p.then(r => {
      pe(r);
      return r;
    });
    return toExpecting(neu);
  };

  return ap;
};

const toHttpResponse = (p, ctx) => {
  // @ts-ignore
  const res = p;

  res.expectStatus = status => {
    const id = ctx.expectId;
    const r = p.expect(r => {
      // Another status check was registered afterwards - has priority
      if (ctx.statusChecker !== id) return;

      if (status !== r.status) {
        console.error(r.data);
        throw new Error(`Expected status ${status}, got ${r.status} instead`);
      }
    });
    ctx.statusChecker = id;
    ctx.expectId++;
    return toHttpResponse(r, ctx);
  };

  res.expectType = type => {
    const r = p.expect(r => {
      const error = validateAgainstSchema(r.data, type);
      if (error) throw error;
    });
    ctx.expectId++;
    return toHttpResponse(r, ctx);
  };

  res.data = () => {
    return p.then(r => r.data);
  };

  return res;
};

const HttpClient = opts => {
  const ax = axios.create({
    baseURL: opts.baseUrl,
    validateStatus: () => true
  });
  if (opts.interceptor) ax.interceptors.request.use(opts.interceptor);
  const ctx = {
    expectId: 0
  };

  const convertRes = res => {
    const ep = toExpecting(res);
    return toHttpResponse(ep, ctx).expectStatus(200);
  };

  return {
    get: (url, opts) => convertRes(ax.get(url, opts)),
    post: (url, data) => convertRes(ax.post(url, data)),
    put: (url, data) => convertRes(ax.put(url, data)),
    delete: url => convertRes(ax.delete(url))
  };
};

var hh = 123;

console.log(hh);
const ApiHttpClient = HttpClient;

export { ApiHttpClient };
