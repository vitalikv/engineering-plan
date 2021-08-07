

let long_click = false;
let lastClickTime = 0;
let catchTime = 0.30;



function onDocumentMouseDown( event ) 
{
	long_click = false;
	lastClickTime = new Date().getTime();
	infProg.mouse.click.down = true;
	infProg.mouse.click.move = false;
	
	switch ( event.button ) 
	{
		case 0: infProg.mouse.click.type = 'left'; break;
		case 1: infProg.mouse.click.type = 'right'; break;
		case 2: infProg.mouse.click.type = 'right'; break;
	}	
	
	if(event.changedTouches)
	{
		event.clientX = event.targetTouches[0].clientX;
		event.clientY = event.targetTouches[0].clientY;
		infProg.mouse.click.type = 'left';	
	}	

	
	clickSetCamera2D( event, infProg.mouse.click.type );
	clickSetCamera3D( event, infProg.mouse.click.type );
	
	infProg.rayhit = null;	
				
	//var ray = rayIntersect( event, infProject.obj, 'one' );
	
	//if(ray.length > 0) { infProject.rayhit = ray[0]; }	
	
	//clickObj();
	
	render();
}





function onDocumentMouseMove( event ) 
{ 
	if(event.changedTouches)
	{
		event.clientX = event.targetTouches[0].clientX;
		event.clientY = event.targetTouches[0].clientY;
	}
		
	
	if ( !long_click ) { long_click = ( lastClickTime - new Date().getTime() < catchTime ) ? true : false; }
	
	
	if (infProg.scene.camera == camera2D) { cameraMove2D( event ); }
	else if (infProg.scene.camera == camera3D) { cameraMove3D( event ); }	
	
	if(infProg.mouse.click.down && !infProg.mouse.click.move)
	{
		infProg.mouse.click.move = true;
	}	
	
	render();
}


function onDocumentMouseUp( event )  
{	
	infProg.mouse.click.type = '';
	
	if(!infProg.mouse.click.move) 
	{ 

	}	
	
	
	render();
	
	infProg.mouse.click.down = false;
	infProg.mouse.click.move = false;		
}



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



