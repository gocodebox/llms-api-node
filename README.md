LifterLMS REST API Wrapper - Node.js
------------------------------------

[![CircleCI](https://circleci.com/gh/gocodebox/llms-api-node.svg?style=svg)](https://circleci.com/gh/gocodebox/llms-api-node)
[![Maintainability](https://api.codeclimate.com/v1/badges/1bb172a399b0e272fc05/maintainability)](https://codeclimate.com/github/gocodebox/llms-api-node/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1bb172a399b0e272fc05/test_coverage)](https://codeclimate.com/github/gocodebox/llms-api-node/test_coverage)

Node.js wrapper for the LifterLMS REST API

[CHANGELOG](./CHANGELOG.md)

## Installation

```
npm install --save llms-api-node
```

## Setup and Configuration

```js
const api = require( 'llms-api-node' );

// Authenticate and configure the API.
const llms = new api( {
  url: 'https://mysite.tld',
  consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXX',
  consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
} );
```

### Configuration Options

| Option            | Type      | Required | Description                                                                                              |
|-------------------|-----------|----------|----------------------------------------------------------------------------------------------------------|
| `url`             | `string`  | yes      | The URL of the WordPress site where LifterLMS is installed. Example: https://mysite.tld                  |
| `consumerKey`     | `string`  | yes      | Your API consumer key                                                                                    |
| `consumerSecret`  | `string`  | yes      | Your API consumer secret                                                                                 |
| `authMethod`      | `string`  | no       | Define the authorization method used. Accepts "basic" (default) or "headers".                            |
| `version`         | `string`  | no       | LifterLMS REST API version. Default: "v1".                                                               |
| `verifySsl`       | `bool`    | no       | Verify SSL certificates. Disable when testing with self-signed certificates. Default: `true`.            |
| `encoding`        | `string`  | no       | Encoding. Default: "utf-8".                                                                              |
| `port`            | `string`  | no       | Provide support for URLs with ports, eg: `8080`.                                                         |
| `timeout`         | `int`     | no       | Define the request timeout (in seconds).                                                                 |
| `wpPrefix`        | `string`  | no       | Define a custom REST API URL prefix to support custom prefixes defined via the `rest_url_prefix` filter. |
| `wpVersion`       | `string`  | no       | Define the WP Core REST API version to use. Default: "v2".                                               |

## Example Usage

### Requests using async (promified) methods.

```js
llms.getAsync( '/courses' ).then( response => {
  if ( 200 !== response.statusCode ) {
    throw new Error( 'Error!' );
  }
  return JSON.parse( response.body );
} );
```

### Requests using regular methods.

```js
llms.get( '/courses', function( err, data, res ) ) {
  if ( err ) {
    throw new Error( err );
  }
  return JSON.parse( data );
}
```

## Releasing

+ Commit and push changes
+ Bump version with `npm version`
+ Push changes and push tags `git push origin master && git push --tags`
+ CircleCI automatically publishes to npm when tags are created.
