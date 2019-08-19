/**
 * Main Request class
 *
 * @since 1.0.0
 * @version 1.0.3
 */

'use strict';

const
	_request = require( 'request' ),
	promise  = require( 'bluebird' ),
	utils    = require( './utils' ),
	qs       = require( 'querystring' ),
	isEmpty  = require( 'lodash.isempty' ),
	URL      = require( 'url' ).URL;

/**
 * Constructor
 *
 * @since 1.0.0
 *
 * @param API api API Instance.
 * @param string namespace Vendor string (eg "llms/v1").
 */
function Request( api, namespace ) {

	this.api = api;
	this.namespace = namespace;

}

/**
 * Build a full URL for a request.
 *
 * @since 1.0.0
 * @since 1.0.3 Allow endpoints to be submitted with or without a leading forward slash.
 *
 * @param string Endpoint path.
 * @return string
 */
Request.prototype._getURL = function( endpoint ) {

	let url = utils.trailingSlashIt( this.api.getOption( 'url' ) );
	url += utils.trailingSlashIt( this.api.getOption( 'wpPrefix' ) );
	url += utils.trailingSlashIt( this.namespace );
	url += '/' === endpoint[0] ? endpoint.substr( 1 ) : endpoint;

	if ( 'basic' === this.api.getOption( 'authMethod' ) ) {
		url = new URL( url );
		url.username = this.api.getOption( 'consumerKey' );
		url.password = this.api.getOption( 'consumerSecret' );
		url = url.toString();
	}

	if ( '' !== this.api.getOption( 'port' ) ) {
		url = new URL( url );
		url.port = this.api.getOption( 'port' );
		url = url.toString();
	}

	return url;

};

/**
 * Build arguments to pass with a request
 *
 * @since 1.0.0
 *
 * @param string method HTTP method.
 * @param string endpoint Request endpoint.
 * @param obj data Request data.
 * @return obj
 */
Request.prototype._getRequestArgs = function( method, endpoint, data ) {

	let args = {
		url: this._getURL( endpoint ),
		method: method,
		encoding: this.api.getOption( 'encoding' ),
		timeout: this.api.getOption( 'timeout' ),
		headers: {
			Accept: 'application/json',
			'User-Agent': 'LifterLMS API Client-Node.js/' + this.api.version,
		},
	};

	if ( 'headers' === this.api.getOption( 'authMethod' ) ) {
		args.headers[ 'X-LLMS-CONSUMER-KEY' ] = this.api.getOption( 'consumerKey' );
		args.headers[ 'X-LLMS-CONSUMER-SECRET'] = this.api.getOption( 'consumerSecret' );
	}

	if ( ! this.api.getOption( 'verifySSL' ) ) {
		args.strictSSL = false;
	}

	if ( ! isEmpty( data ) ) {
		if ( 'GET' === method ) {
			args.url += '?' + qs.stringify( data );
		} else {
			args.headers['Content-Type'] = 'application/json';
			args.body = JSON.stringify( data );
		}
	}

	return args;

};

/**
 * Preform requests.
 *
 * @since 1.0.0
 *
 * @see {Reference}
 * @link {URL}
 *
 * @param string method Request method.
 * @param string endpoint Endpoint.
 * @param obj|function|null data_or_callback Request data, query string parameters, or callback function.
 * @param function callback Callback function.
 * @return obj
 */
Request.prototype._request = function( method, endpoint, data_or_callback, callback ) {

	let data = {};
	if ( 'function' === typeof data_or_callback ) {
		callback = data_or_callback;
	} else {
		data = data_or_callback;
	}

	const args = this._getRequestArgs( method, endpoint, data );

	if ( ! callback ) {
		return _request( args );
	}

	return _request( args, callback );

};

/**
 * Preform a GET request.
 *
 * @since 1.0.0
 *
 * @param string endpoint Request endpoint.
 * @param obj|function|null data_or_callback Data (to be converted to query string parameters) or callback function.
 * @param Function callback Callback function.
 * @return obj
 */
Request.prototype.get = function( endpoint, data_or_callback, callback ) {
	return this._request( 'GET', endpoint, data_or_callback, callback );
};

/**
 * Preform a POST request.
 *
 * @since 1.0.0
 *
 * @param string endpoint Request endpoint.
 * @param obj|function|null data Request data.
 * @param Function callback Callback function.
 * @return obj
 */
Request.prototype.post = function( endpoint, data, callback ) {
	return this._request( 'POST', endpoint, data, callback );
};

/**
 * Preform a PUT request.
 *
 * @since 1.0.0
 *
 * @param string endpoint Request endpoint.
 * @param obj|function|null data Request data.
 * @param Function callback Callback function.
 * @return obj
 */
Request.prototype.put = function( endpoint, data, callback ) {
	return this._request( 'PUT', endpoint, data, callback );
};

/**
 * Preform a PATCH request.
 *
 * @since 1.0.4
 *
 * @param string endpoint Request endpoint.
 * @param obj|function|null data Request data.
 * @param Function callback Callback function.
 * @return obj
 */
Request.prototype.patch = function( endpoint, data, callback ) {
	return this._request( 'PATCH', endpoint, data, callback );
};

/**
 * Preform a Delete request.
 *
 * @since 1.0.0
 *
 * @param string endpoint Request endpoint.
 * @param obj|function|null data_or_callback Request data or callback function.
 * @param Function callback Callback function.
 * @return obj
 */
Request.prototype.delete = function( endpoint, data_or_callback, callback ) {
	return this._request( 'DELETE', endpoint, data_or_callback, callback );
};

/**
 * Preform an options request.
 *
 * @since 1.0.0
 *
* @param string endpoint Request endpoint.
* @param Function callback Callback function.
 * @return obj
 */
Request.prototype.options = function( endpoint, callback ) {
	return this._request( 'options', endpoint, null, callback );
};

/**
 * Create promisified versions of the request methods:
 * getAsync, postAsync, putAsync, patchAsync, deleteAsync, optionsAsync
 */
promise.promisifyAll( Request.prototype );

module.exports = Request;
