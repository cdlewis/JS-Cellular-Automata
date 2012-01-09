// Class representing the grid
function Grid( size_x, size_y, canvas_identifier )
{	
	// Store size for future reference
	this.size_x = size_x;
	this.size_y = size_y;
	
	this.generation = 0; // Keep track of generation
	
	// Create 2 dimensional array
	this.ds = Array( this.size_x );
	for( var i = 0; i < this.ds.length; i++ )
	{
		this.ds[ i ] = Array( this.size_y );
		
		// For each location, create a cell
		for( var j = 0; j < this.ds[ i ].length; j++ )
			this.ds[ i ][ j ] = new Cell( i, j );
	}
	
	// Setup the canvas
	this.canvas = document.getElementById( canvas_identifier );
	this.canvas.setAttribute( "width", 10 * this.size_x );
	this.canvas.setAttribute( "height", 10 * this.size_y );
	
	// Clear any existing material off the canvas
	this.context = this.canvas.getContext( "2d" );
	this.context.fillStyle = "rgb(200,0,0)";  
	this.context.fillRect( 0, 0, 10 * this.size_x, 10 * this.size_y );
		
	this.draw = function()
	{
		// Keep track of where we are on the canvas
		var current_x = 0;
		var current_y = 0;
		
		for( var i = 0; i < this.size_x; i++ )
		{
			for( var j = 0; j < this.size_y; j++ )
			{
				if( this.ds[ i ][ j ].state == "dead" )
					this.context.fillStyle = "rgb(51,51,51)";
				else
					this.context.fillStyle = "rgb(255,160,160)";
				this.context.fillRect( current_x, current_y, 10, 10 );
				
				current_y += 10;
			}
			current_y = 0;
			current_x += 10;
		}

		this.context.fillStyle = "rgb(255,255,255)"; // Set font colour to white
		this.context.font = "bold 14px sans-serif";	 // Set default font
		this.context.fillText( "Generation: " + this.generation, 10, this.size_y * 10 - 10 );
	}
	
	// Set the specified cell to the desired state
	this.set_cell = function( x, y, state )
	{
		if( this.valid_cord( x, y ) )
			this.ds[ x ][ y ].state = state;
		else
			throw "Invalid cell specified for function set_cell. x = " + x + " y = " + y;
	}
	
	// Get a cell with the specified co-ordinates
	this.get_cell = function( x, y )
	{
		if( this.valid_cord( x, y ) )
			return this.ds[ x ][ y ];
		else
			throw "Invalid cell specified for function get_cell. x = " + x + " y = " + y;
	}

	// Returns true of the co-ordinates specified are valid
	this.valid_cord = function( x, y )
	{
		if( x >= 0 && x < this.size_x && y >= 0 && y < this.size_y )
			return true;
		else
			return false;
	}
	
	// Finds the states of neighbouring cells
	this.get_neighbours = function( cell )
	{
		// Store local copies of functions
		var valid_cord = this.valid_cord;
		var get_cell = this.get_cell;
		var neighbours = Array();
		
		var results = { "alive" : 0, "dead" : 0 }; // Keep track of living and dead cells
		
		// Co-ordinates for surrounding cells
		var cords = [ [ cell.cord_x - 1, cell.cord_y - 1 ], // Top-left
					  [ cell.cord_x,     cell.cord_y - 1 ], // Top-middle
					  [ cell.cord_x + 1, cell.cord_y - 1 ], // Top right
					  [ cell.cord_x - 1, cell.cord_y     ], // Middle-left
					  [ cell.cord_x + 1, cell.cord_y     ], // Middle-right
					  [ cell.cord_x - 1, cell.cord_y + 1 ], // Bottom-left
					  [ cell.cord_x,     cell.cord_y + 1 ], // Bottom-middle
					  [ cell.cord_x + 1, cell.cord_y + 1 ]  // Bottom-right
					];
		
		for( var i = 0; i < cords.length; i++ )
		{
			// If valid then find the cell and add it to the array
			if( this.valid_cord( cords[ i ][ 0 ], cords[ i ][ 1 ] ) )
				neighbours.push( this.get_cell( cords[ i ][ 0 ], cords[ i ][ 1 ] ) );
		}

		// Calculate the total number of dead/alive cells
		results.alive = filter( function( x ) { return ( x.state == "alive" ); }, neighbours ).length;
		results.dead  = filter( function( x ) { return ( x.state == "dead" ); }, neighbours ).length;

		return results;
	}
	
	// Update the grid
	this.update = function()
	{
		for( var i = 0; i < this.size_x; i++ )
		{
			for( var j = 0; j < this.size_y; j++ )
			{
				var specific_cell = this.get_cell( i, j );
				var states = this.get_neighbours( specific_cell );

				// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
				if( specific_cell.state == "alive" && states.alive < 2 )
					specific_cell.new_state( "dead" );
				// Any live cell with more than three live neighbours dies, as if by overcrowding.
				else if( specific_cell.state == "alive" && states.alive > 3 )
					specific_cell.new_state( "dead" );
				// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
				else if( specific_cell.state == "dead" && states.alive == 3 )
					specific_cell.new_state( "alive" );
			}
		}
		
		// Make the new states active
		for( var i = 0; i < this.ds.length; i++ )
			for( var j = 0; j < this.ds[ i ].length; j++ )
				this.get_cell( i, j ).update();
		
		this.generation += 1; // Increment the generation
	}
	
	this.step = function()
	{
		this.update();
		this.draw();
	}
}

// Class representing each cell
function Cell( x, y )
{
	// Cell co-ordinates in the grid
	this.cord_x = x;
	this.cord_y = y;
	this.state = "dead";
	
	// Used for tracking updates to cell
	this.next_state = false;
	this.updated = false;
	
	// At the next update, replace the current state with the specified one
	this.new_state = function( state )
	{
		this.next_state = state;
		this.updated = true;
	}
	
	// If the state is waiting to be updated then do so now
	this.update = function()
	{
		if( this.updated == true )
		{
			this.state = this.next_state;
			this.next_state = false;
			this.updated = false;
		}
	}
}