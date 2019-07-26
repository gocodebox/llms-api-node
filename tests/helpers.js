/**
 * Test Helpers
 *
 * @since 1.0.0
 * @version 1.0.0
 */

'use strict';

const
	LifterLMS = require( '../lifterlms-api.js' );

/**
 * Retrieve instance of LifterLMS API
 *
 * @since 1.0.0
 *
 * @param object options options to assign to the API instance.
 * @param bool merge if true, merges options with default mock options.
 * @return API
 */
function getInstance( options, merge ) {

	merge = false === merge ? false : true;

	if ( merge ) {

		options = { url: 'https://mock.test',
			consumerKey: 'ck_mock',
			consumerSecret: 'cs_mock',
...options };

	}

	return new LifterLMS( options );
}

module.exports = {
	getInstance: getInstance,
};
