/* My own little piece of Haskell */

function map( array, action )
{
	for( var i = 0; i < array.length; ++i )
		action( array[ i ] );
}

function filter( condition, array )
{
	var result = [];
	map( array, function( element )
	{
		if( condition( element ) )
			result.push( element );
	} );

	return result;
}

haskell_loaded = true; // Notify other scripts that haskell.js has loaded