/**
 * Test Utility Functions
 *
 * @since 1.0.0
 * @version 1.0.0
 */

'use strict';

const
	utils = require( '../lib/utils' ),
	chai  = require( 'chai' );

describe( 'Utilities', () => {

	describe( 'trailingSlashIt', () => {

		it( 'should return a string with a trailing slash', () => {

			chai.assert.equal( utils.trailingSlashIt( 'https://mock.test' ), 'https://mock.test/' );
			chai.assert.equal( utils.trailingSlashIt( 'https://mock.test/' ), 'https://mock.test/' );

			chai.assert.equal( utils.trailingSlashIt( 'string' ), 'string/' );
			chai.assert.equal( utils.trailingSlashIt( 'string/' ), 'string/' );

		} );

	} );

} );
