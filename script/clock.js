/* Wrapper class for setInterval designed to encapsulate the creation and
 * modification of timers
 */

function Clock( string, duration )
{
	this.string = string;
	this.duration = duration;
	this.original_duration = duration;
	
	this.start = function()
	{
		this.timer = setInterval( this.string, this.duration );
	}
	
	this.stop = function()
	{
		clearInterval( this.timer );
	}
	
	this.faster = function()
	{
		this.stop();
		this.duration -= 50;
		this.start();
	}
	
	this.slower = function()
	{
		this.stop();
		this.duration += 50;
		this.start();
	}
	
	this.new_speed = function( speed )
	{
		this.stop();
		this.duration = speed;
		this.start();
	}
	
	this.reset = function()
	{
		this.stop();
		this.duration = this.original_duration;
		this.start();
	}
}