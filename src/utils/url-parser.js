export class UrlParser {
  buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;

    const pathWithParams = path.replaceAll(
      routeParametersRegex,
      "(?<$1>[a-z0-9-_]+)"
    );

    const pathRegex = new RegExp(`^${pathWithParams}(?<queryParams>\\?(.*))?$`);

    return pathRegex;
  }

  extractQueryParams(query) {
    return query
      .substr(1)
      .split("&")
      .reduce((queryParams, param) => {
        const [key, value] = param.split("=");

        queryParams[key] = value;

        return queryParams;
      }, {});
  }
}
