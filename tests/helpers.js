'use strict';

const
	LifterLMS = require( '../index.js' );

/**
 * Retrieve instance of LifterLMS API
 *
 * @since [version]
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
