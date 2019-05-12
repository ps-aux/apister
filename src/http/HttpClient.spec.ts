import HttpClient from 'src/http/HttpClient'
import { string } from 'src/schema'

it('works', async () => {
  const type = () => ({
    args: {
      foo: string()
    }
  })

  const http = HttpClient({
    baseUrl: 'https://postman-echo.com'
  })
  const body = await http.get('/get', {
    params: {
      foo: 'bar'
    }
  }).expectStatus(200).expectType(type()).data()

  expect(body.args.foo).toBe('bar')
})
