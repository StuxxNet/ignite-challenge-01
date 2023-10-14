import http from 'node:http'
import { routes } from './routes.js'
import { BodyParser } from './utils/body-parser.js'
import { UrlParser } from './utils/url-parser.js'

const urlParser = new UrlParser()

const server = http.createServer(async (req, res) => {
    req = await new BodyParser(req).extractBodyInJson()

    const { url, method } = req

    const route = routes.find(route => {
        return urlParser.buildRoutePath(route.path).test(url) && route.method == method
    })

    if (route) {
        const routeParams = req.url.match(urlParser.buildRoutePath(route.path))

        const {queryParams, ...params } = routeParams.groups

        req.params = params
        req.queryParams = queryParams ? urlParser.extractQueryParams(queryParams) : {}

        return route.handler(req, res)
    }

    return res
        .writeHead(404)
        .end()
})

server.listen(3000)