import { ApiHttpClient } from 'build'

it('library importer properly', async () => {
    const http = ApiHttpClient({
        baseUrl: 'https://google.com'
    })

    await http.get('/')

})