



function clickMouseActive(params)
{ 
	if(!infProg.act.rayhit) { return; }

	let rayhit = infProg.act.rayhit;
	let obj = rayhit.object;
	let tag = obj.userData.tag;
	
	
	if(params.type == 'down')
	{  
		if(tag == 'point') { clickPointDown({obj: obj, rayPos: rayhit.point}); }
	}
	else if(params.type == 'up')
	{	
		//if(tag == 'wall' && camera == camera3D ) {  }
	}	

	
}





function clickRayHit(params)
{
	let event = params.event;
	let rayhit = null;	
	
	let arr = infProg.scene.construction;	
	
	if(infProg.scene.camera == camera2D)
	{
		let ray = rayIntersect( event, arr.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}
	
	
	return rayhit;
}



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











