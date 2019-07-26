/**
 * Main API class
 *
 * @since 1.0.0
 * @version 1.0.0
 */

'use strict';

const
	Request   = require( './Request' ),
	camelCase = require( 'lodash.camelcase' ),
	utils     = require( './utils' );

/**
 * LifterLMS REST API Wrapper
 *
 * @since 1.0.0
 *
 * @param obj options {
 *    An object of configuration options
 *
 *    @type string url (Required) The URL of the WordPress site where LifterLMS is installed.
 *    @type string consumerKey (Required) Consumer API Key.
 *    @type string consumerSecret (Required) Consumer API Secret.
 *    @type string authMethod Define the authorization method used, "basic" (default) or "headers".
 *    @type bool wpPrefix Define a custom REST API URL prefix to support custom prefixes defined via the `rest_url_prefix` filter.
 *    @type string wpVersion Define the WP Core REST API version to use (default v2).
 *    @type string version LifterLMS REST API version.
 *    @type bool verifySSL Verify SSL certificates. Disable when testing with self-signed certificates.
 *    @type string encoding Encoding. Defaults to utf8.
 *    @type string port Support urls with ports, eg: `8080`.
 *    @type int timeout Defines the request timeout (in seconds).
 * }
 */
function API( options ) {

	if ( ! ( this instanceof API ) ) {
		return new API( options );
	}

		options = options || {};

		// Required options.
	[ 'url', 'consumerKey', 'consumerSecret' ].forEach( function( option ) {
		if ( ! options[ option ] ) {
			throw new Error( option + ' is required' );
		}
	} );

	this.version = '0.0.1';
	this._options = {};
	this._namespaces = [];

	this._setOptions( options );

	this.registerNamespace( 'llms', this.getOption( 'version' ) );
	this.registerNamespace( 'wp', this.getOption( 'wpVersion' ) );

	this._unprefixCore();

}

/**
 * Registers all LifterLMS core Request methods with the main api instance so they can be accessed without the vendor prefix.
 *
 * @since 1.0.0
 *
 * @return void
 */
API.prototype._unprefixCore = function() {

	const methods = Object.getPrototypeOf( this.llms );
	Object.keys( methods ).forEach( name => {
		if ( 0 !== name.indexOf( '_' ) && 'function' === typeof methods[ name ] ) {
			this[ name ] = function() {
				this.llms[ name ].apply( this.llms, arguments );
			};
		}
	} );

};

/**
 * Set options.
 *
 * @since 1.0.0
 *
 * @param obj options object. See definition for `api()` for more details.
 * @return void
 */
API.prototype._setOptions = function( options ) {

	this._options = {
		url            : options.url,
		consumerKey    : options.consumerKey,
		consumerSecret : options.consumerSecret,
		authMethod     : options.authMethod || 'basic',
		wpPrefix       : options.wpPrefix || 'wp-json',
		wpVersion      : options.wpVersion || 'v2',
		version        : options.version || 'v1',
		verifySSL      : false === options.verifySSL ? false : true,
		encoding       : options.encoding || 'utf8',
		port           : options.port || '',
		timeout        : options.timeout,
	};

};

/**
 * Retrieve a class option.
 *
 * @since 1.0.0
 *
 * @param string key Option name.
 * @return mixed
 */
API.prototype.getOption = function( key ) {
	return this._options[ key ];
};

/**
 * Register a custom namespace that can be utilized for accessing WP Rest API endpoints for 3rd party vendors.
 *
 * @since 1.0.0
 *
 * @see {Reference}
 * @link {URL}
 *
 * @param string vendor Vendor prefix.
 * @param string version Vendor API version.
 * @return void
 */
API.prototype.registerNamespace = function( vendor, version ) {
	const ns = utils.trailingSlashIt( vendor ) + version;
	if ( -1 === this._namespaces.indexOf( ns ) ) {
		this._namespaces.push( ns );
		this[ camelCase( vendor ) ] = new Request( this, ns );
	}
};

module.exports = API;
