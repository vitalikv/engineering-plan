







//-------------

function getMousePosition( event )
{
	let x = ( ( event.clientX - infProg.el.canv.offsetLeft ) / infProg.el.canv.clientWidth ) * 2 - 1;
	let y = - ( ( event.clientY - infProg.el.canv.offsetTop ) / infProg.el.canv.clientHeight ) * 2 + 1;	
	
	return new THREE.Vector2(x, y);
}

	

function rayIntersect( event, obj, t ) 
{
	let mouse = getMousePosition( event );
	
	let raycaster = new THREE.Raycaster();
	
	raycaster.setFromCamera( mouse, infProg.scene.camera );
	
	let intersects = null;
	if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
	else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
	
	return intersects;
}











