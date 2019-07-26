'use strict';

const
	Request     = require( '../lib/Request' ),
	chai        = require( 'chai' ),
	getInstance = require( './helpers' ).getInstance;

describe( 'API', () => {

	describe( 'Constructor', () => {

		it( 'should throw an error if the url, consumerKey, or consumerSecret are missing', () => {

			let options = {};

			chai.expect( () => {
				getInstance( options, false );
			} ).to.throw( Error );

			options.url = 'https://mock.test';

			options.consumerKey = 'ck_mock';
			chai.expect( () => {
				getInstance( options, false );
			} ).to.throw( Error );

			options.url = 'https://mock.test';

			options.consumerKey = 'ck_mock';
			chai.expect( () => {
				getInstance( options, false );
			} ).to.throw( Error );

		} );

		it( 'should set the default options', () => {

			const api = getInstance();

			chai.assert.equal( api._options.authMethod, 'basic' );
			chai.assert.equal( api._options.wpPrefix, 'wp-json' );
			chai.assert.equal( api._options.wpVersion, 'v2' );
			chai.assert.equal( api._options.version, 'v1' );
			chai.assert.equal( api._options.verifySSL, true );
			chai.assert.equal( api._options.encoding, 'utf8' );
			chai.assert.equal( api._options.port, '' );
			chai.assert.equal( api._options.timeout, undefined );


		} );

		it( 'should set merge options with the default options', () => {

			let options = {};

			options.url = 'https://mock.test';
			options.consumerKey = 'ck_mock';
			options.consumerSecret = 'cs_mock';
			options.port = '8080';
			options.timeout = 60;

			const api = getInstance( options );

			chai.assert.equal( api._options.authMethod, 'basic' );
			chai.assert.equal( api._options.url, options.url );
			chai.assert.equal( api._options.wpPrefix, 'wp-json' );
			chai.assert.equal( api._options.wpVersion, 'v2' );
			chai.assert.equal( api._options.version, 'v1' );
			chai.assert.equal( api._options.consumerKey, options.consumerKey );
			chai.assert.equal( api._options.consumerSecret, options.consumerSecret );
			chai.assert.equal( api._options.verifySSL, true );
			chai.assert.equal( api._options.encoding, 'utf8' );
			chai.assert.equal( api._options.port, options.port );
			chai.assert.equal( api._options.timeout, 60 );

		} );

		it( 'should add the default namespaces', () => {

			const api = getInstance();
			chai.expect( api._namespaces ).to.eql( [ 'llms/v1', 'wp/v2' ] );

			chai.expect( api.llms ).to.be.an.instanceOf( Request );
			chai.expect( api.wp ).to.be.an.instanceOf( Request );

		} );

		it( 'should expose Request methods to the API instance', () => {

			const api = getInstance();

			[ 'get', 'post', 'put', 'delete', 'options' ].forEach( method => {
				chai.expect( api[ method ] ).to.be.a( 'function' );
			} );

		} );

	} );

	describe( 'getOption', () => {

		it( 'should return the value of the class option', () => {

			const api = getInstance();
			api._options.port = '8080';
			chai.expect( api.getOption( 'port' ), '8080' );

			api._options.custom = 'mock';
			chai.expect( api.getOption( 'custom' ), 'mock' );

			api._options.timeout = 60;
			chai.expect( api.getOption( 'timeout' ), 60 );

		} );

	} );

	describe( 'registerNamespace', () => {

		it( 'should add a namespace to the array of available namespaces', () => {

			const api = getInstance();

			api.registerNamespace( 'mock', 'v3' );
			chai.expect( api._namespaces ).to.eql( [ 'llms/v1', 'wp/v2', 'mock/v3' ] );

		} );

		it( 'should register a new instance of Request under the vendor\'s name', () => {

			const api = getInstance();

			api.registerNamespace( 'mock', 'v3' );
			chai.expect( api.mock ).to.be.an.instanceOf( Request );

		} );

	} );

} );
