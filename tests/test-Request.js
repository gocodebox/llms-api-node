/**
 * Test Request Class
 *
 * @since 1.0.0
 * @version 1.0.0
 */

'use strict';

const
	Request     = require( '../lib/Request' ),
	chai        = require( 'chai' ),
	nock        = require( 'nock' ),
	getInstance = require( './helpers' ).getInstance;

describe( 'Request', () => {

	describe( 'Constructor', () => {

		it( 'should set class properties', () => {

			const req = new Request( getInstance(), 'llms/v1' );

			chai.expect( req ).to.have.property( 'api' );
			chai.assert.equal( req.namespace, 'llms/v1' );

		} );

	} );

	describe( 'Helpers', () => {

		describe( '_getURL', () => {

			it( 'should build a URL for the LifterLMS Core', () => {

				const
					api = getInstance(),
					req = new Request( api, 'llms/v1' );

				chai.assert.equal( req._getURL( 'courses' ), 'https://ck_mock:cs_mock@mock.test/wp-json/llms/v1/courses' );

			} );

			it( 'should build a URL for the WordPress Core', () => {

				const
					api = getInstance(),
					req = new Request( api, 'wp/v2' );

				chai.assert.equal( req._getURL( 'posts' ), 'https://ck_mock:cs_mock@mock.test/wp-json/wp/v2/posts' );

			} );


			it( 'should build a URL with a port', () => {

				const
					api = getInstance( { port: '8080' } ),
					req = new Request( api, 'llms/v1' );

				chai.assert.equal( req._getURL( 'courses' ), 'https://ck_mock:cs_mock@mock.test:8080/wp-json/llms/v1/courses' );

			} );

			it( 'should build a URL without Authorization', () => {

				const
					api = getInstance( { authMethod: 'headers' } ),
					req = new Request( api, 'llms/v1' );

				chai.assert.equal( req._getURL( 'courses' ), 'https://mock.test/wp-json/llms/v1/courses' );

			} );

			it( 'should accept an endpoint with or without a leading slash', () => {

				const
					api = getInstance(),
					req = new Request( api, 'llms/v1' );

				chai.assert.equal( req._getURL( 'courses' ), 'https://ck_mock:cs_mock@mock.test/wp-json/llms/v1/courses' );
				chai.assert.equal( req._getURL( '/courses' ), 'https://ck_mock:cs_mock@mock.test/wp-json/llms/v1/courses' );

			} );


		} );

		describe( '_getRequestArgs', () => {

			it( 'should return an object with all required properties', () => {

				const
					api = getInstance(),
					req  = new Request( api, 'llms/v1' ),
					args = req._getRequestArgs( 'GET', 'mock' );

				chai.assert.isString( args.url );
				chai.assert.isString( args.encoding );
				chai.assert.equal( args.method, 'GET' );
				chai.expect( args ).to.have.property( 'timeout' );
				chai.assert.equal( args.headers.Accept, 'application/json' );
				chai.assert.isString( args.headers['User-Agent'] );

				chai.expect( args.headers ).to.not.have.property( 'X-LLMS-CONSUMER-KEY' );
				chai.expect( args.headers ).to.not.have.property( 'X-LLMS-CONSUMER-SECRET' );

			} );

			it( 'should return an object with authorization headers', () => {

				const
					api = getInstance( { authMethod: 'headers' } ),
					req = new Request( api, 'llms/v1' ),
					args = req._getRequestArgs( 'GET', 'mock' );

				chai.assert.isString( args.headers['X-LLMS-CONSUMER-KEY'] );
				chai.assert.isString( args.headers['X-LLMS-CONSUMER-SECRET'] );

			} );

			it( 'should return an object with strictSSL disabled', () => {

				const
					api = getInstance( { verifySSL: false } ),
					req  = new Request( api, 'llms/v1' ),
					args = req._getRequestArgs( 'GET', 'mock' );

				chai.assert.isFalse( args.strictSSL );

			} );

			it( 'should return an object with a JSON body & content type header', () => {

				const
					api  = getInstance(),
					req  = new Request( api, 'llms/v1' ),
					data = { mock: false },
					args = req._getRequestArgs( 'POST', 'mock', data );

				chai.assert.equal( args.body, JSON.stringify( data ) );
				chai.assert.equal( args.headers['Content-Type'], 'application/json' );

			} );

			it( 'should return an object with a query string added to the url', () => {

				const
					api = getInstance(),
					req  = new Request( api, 'llms/v1' ),
					data = { mock: false },
					args = req._getRequestArgs( 'GET', 'mock', data );

				chai.expect( args.url ).to.have.string( '?mock=false' );

			} );

			it( 'should return an object which preserves the query string appended to the endpoint', () => {

				const
					api = getInstance(),
					req  = new Request( api, 'llms/v1' ),
					args = req._getRequestArgs( 'GET', 'mock?mock=false' );

				chai.expect( args.url ).to.have.string( '?mock=false' );

			} );

		} );

	} );

	describe( 'Requests', () => {

		const
			api = getInstance(),
			req = new Request( api, 'llms/v1' ),
			res = { ok: true };

		describe( 'methods', () => {

			beforeEach( () => {
				nock.cleanAll();
			} );

			it( 'should return content for get requests', done => {
				nock( 'https://mock.test/wp-json/llms/v1' ).get( '/courses' ).
					reply( 200, res );

				req.get( 'courses', function( err, data ) {
					chai.expect( err ).to.not.exist;
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for post requests', done => {

				const req_data = { title: 'test' };

				nock( 'https://mock.test/wp-json/llms/v1' ).post( '/courses', req_data ).
					reply( 200, req_data );

				req.post( 'courses', req_data, function( err, data ) {
					chai.expect( err ).to.not.exist;
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for put requests', done => {

				const req_data = { title: 'test' };

				nock( 'https://mock.test/wp-json/llms/v1' ).put( '/courses', req_data ).
					reply( 200, req_data );

				req.put( 'courses', req_data, function( err, data ) {
					chai.expect( err ).to.not.exist;
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for delete requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).delete( '/courses' ).
					reply( 204 );

				req.delete( 'courses', function( err, data ) {
					chai.expect( err ).to.not.exist;
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for options requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).options( '/courses' ).
					reply( 200 );

				req.options( 'courses', function( err, data ) {
					chai.expect( err ).to.not.exist;
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

		} );

		describe( 'methods async', () => {

			beforeEach( () => {
				nock.cleanAll();
			} );

			it( 'should return content for get requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).get( '/courses' ).
					reply( 200, res );

				req.getAsync( 'courses' ).then( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for get requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).get( '/courses?page=1' ).
					reply( 200, res );

				req.getAsync( 'courses', { page: 1 } ).then( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for post requests', done => {

				const req_data = { title: 'test' };

				nock( 'https://mock.test/wp-json/llms/v1' ).post( '/courses', req_data ).
					reply( 200, req_data );

				req.postAsync( 'courses', req_data ).then( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for put requests', done => {

				const req_data = { title: 'test' };

				nock( 'https://mock.test/wp-json/llms/v1' ).put( '/courses', req_data ).
					reply( 200, req_data );

				req.putAsync( 'courses', req_data ).then( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for delete requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).delete( '/courses' ).
					reply( 204 );

				req.deleteAsync( 'courses' ).then( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

			it( 'should return content for options requests', done => {

				nock( 'https://mock.test/wp-json/llms/v1' ).options( '/courses' ).
					reply( 200 );

				req.optionsAsync( 'courses' ).finally( data => {
					chai.expect( data ).be.a.string;
					done();
				} );

			} );

		} );

	} );

} );

