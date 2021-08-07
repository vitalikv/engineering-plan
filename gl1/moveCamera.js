


let type_browser = detectBrowser();


// создаем круг (объект), для обозначения куда смотрит камера в 3D режиме
function createCenterCamObj()
{

	let material = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 1, depthTest: false });
	let obj = new THREE.Mesh( new THREE.BoxGeometry(0.07, 0.07, 0.07), material );
	obj.renderOrder = 2;
	//obj.visible = false;
	
	scene.add( obj );
	
	
	return obj;
}



// первоначальные настройки при страте 
function startPosCamera3D(cdm)
{
	camera3D.position.x = 0;
	camera3D.position.y = cdm.radious * Math.sin( cdm.phi * Math.PI / 360 );
	camera3D.position.z = cdm.radious * Math.cos( cdm.theta * Math.PI / 360 ) * Math.cos( cdm.phi * Math.PI / 360 );			
			
	camera3D.lookAt(new THREE.Vector3( 0, 0, 0 ));
	
	camera3D.userData.camera.save.pos = camera3D.position.clone();
	camera3D.userData.camera.save.radius = camera3D.userData.camera.d3.targetO.position.distanceTo(camera3D.position);	
}




function clickSetCamera2D( event, click )
{
	if(infProg.scene.camera != camera2D) return;

	let planeMath = infProg.scene.planeMath;
	
	planeMath.position.set(camera2D.position.x, 0, camera2D.position.z);
	planeMath.rotation.set(-Math.PI/2,0,0);  
	planeMath.updateMatrixWorld();
	
	let intersects = rayIntersect( event, planeMath, 'one' );
	
	infProg.mouse.pos.x = intersects[0].point.x;
	infProg.mouse.pos.y = intersects[0].point.z;	 		
}


function clickSetCamera3D( event, click )
{
	if ( infProg.scene.camera != camera3D ) { return; }
	
	infProg.mouse.pos.x = event.clientX;
	infProg.mouse.pos.y = event.clientY;
	
	if ( click == 'left' )				
	{
		//var dir = camera.getWorldDirection();
		let dir = new THREE.Vector3().subVectors( camera3D.userData.camera.d3.targetO.position, camera3D.position ).normalize();
		
		// получаем угол наклона камеры к target (к точке куда она смотрит)
		let dergree = THREE.Math.radToDeg( dir.angleTo(new THREE.Vector3(dir.x, 0, dir.z)) ) * 2;	
		if(dir.y > 0) { dergree *= -1; } 			
		
		// получаем угол направления (на плоскости) камеры к target 
		dir.y = 0; 
		dir.normalize();    			
		
		
		camera3D.userData.camera.d3.theta = THREE.Math.radToDeg( Math.atan2(dir.x, dir.z) - Math.PI ) * 2;
		camera3D.userData.camera.d3.phi = dergree;
	}
	else if ( click == 'right' )		
	{
		let planeMath = infProg.scene.planeMath;
		
		planeMath.position.copy( camera3D.userData.camera.d3.targetO.position );
		
		planeMath.rotation.copy( camera3D.rotation );		
		planeMath.updateMatrixWorld();

		let intersects = rayIntersect( event, planeMath, 'one' );
		if(!intersects[0]) return;
		camera3D.userData.camera.click.pos = intersects[0].point; 		
	}	
}



function cameraMove2D( event ) 
{
	if(infProg.scene.camera != camera2D) return;
	if(infProg.mouse.click.type == '') return;
			
	
	let intersects = rayIntersect( event, infProg.scene.planeMath, 'one' );
	
	camera2D.position.x += infProg.mouse.pos.x - intersects[0].point.x;
	camera2D.position.z += infProg.mouse.pos.y - intersects[0].point.z;	
}


function cameraMove3D( event )
{ 
	if(camera3D.userData.camera.movePos) return;
	
	if ( infProg.mouse.click.type == 'left' ) 
	{  
		let radious = camera3D.userData.camera.d3.targetO.position.distanceTo( camera3D.position );
		
		let theta = - ( ( event.clientX - infProg.mouse.pos.x ) * 0.5 ) + camera3D.userData.camera.d3.theta;
		let phi = ( ( event.clientY - infProg.mouse.pos.y ) * 0.5 ) + camera3D.userData.camera.d3.phi;
		phi = Math.min( 180, Math.max( -60, phi ) );

		camera3D.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
		camera3D.position.y = radious * Math.sin( phi * Math.PI / 360 );
		camera3D.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );

		camera3D.position.add( camera3D.userData.camera.d3.targetO.position );  
		camera3D.lookAt( camera3D.userData.camera.d3.targetO.position );			
		
		camera3D.userData.camera.d3.targetO.rotation.set( 0, camera3D.rotation.y, 0 );		
	}
	
	if ( infProg.mouse.click.type == 'right' )    
	{
		let intersects = rayIntersect( event, infProg.scene.planeMath, 'one' );
		if(!intersects[0]) return;
		let offset = new THREE.Vector3().subVectors( camera3D.userData.camera.click.pos, intersects[0].point );
		camera3D.position.add( offset );
		camera3D.userData.camera.d3.targetO.position.add( offset );			
	}			 
	
}





function onDocumentMouseWheel( e )
{
	
	let delta = e.wheelDelta ? e.wheelDelta / 120 : e.detail ? e.detail / 3 : 0;

	if ( type_browser == 'Chrome' || type_browser == 'Opera' ) { delta = -delta; }
	
	
	if(infProg.scene.camera == camera2D) 
	{ 
		cameraZoom2D( delta ); 
	}
	else if(infProg.scene.camera == camera3D) 
	{ 
		cameraZoom3D( delta, 1 ); 
	}	
	
	render();
}



function cameraZoom2D( delta )
{
	let zoom = camera2D.zoom - ( delta * 0.1 * ( camera2D.zoom / 2 ) );
	
	camera2D.zoom = zoom;
	camera2D.updateProjectionMatrix();		
}


function cameraZoom3D( delta, z )
{
	let vect = ( delta < 0 ) ? z : -z;

	let pos1 = camera3D.userData.camera.d3.targetO.position;
	let pos2 = camera3D.position.clone();
	
	let dir = new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize();
	dir = new THREE.Vector3().addScaledVector( dir, vect );
	dir.addScalar( 0.001 );
	let pos3 = new THREE.Vector3().addVectors( camera3D.position, dir );	


	let qt = quaternionDirection( new THREE.Vector3().subVectors( pos1, camera3D.position ).normalize() );
	let v1 = localTransformPoint( new THREE.Vector3().subVectors( pos1, pos3 ), qt );


	let offset = new THREE.Vector3().subVectors( pos3, pos2 );
	pos2 = new THREE.Vector3().addVectors( pos1, offset );

	let centerCam_2 = pos1.clone();
	
	if ( delta < 0 ) { if ( pos2.y >= 0 ) { centerCam_2.copy( pos2 ); } }
	
	if ( v1.z >= 0.05) 
	{ 
		camera3D.userData.camera.d3.targetO.position.copy(centerCam_2);
		camera3D.position.copy( pos3 ); 	
	}			
}







function detectBrowser()
{
	let ua = navigator.userAgent;

	if ( ua.search( /MSIE/ ) > 0 ) return 'Explorer';
	if ( ua.search( /Firefox/ ) > 0 ) return 'Firefox';
	if ( ua.search( /Opera/ ) > 0 ) return 'Opera';
	if ( ua.search( /Chrome/ ) > 0 ) return 'Chrome';
	if ( ua.search( /Safari/ ) > 0 ) return 'Safari';
	if ( ua.search( /Konqueror/ ) > 0 ) return 'Konqueror';
	if ( ua.search( /Iceweasel/ ) > 0 ) return 'Debian';
	if ( ua.search( /SeaMonkey/ ) > 0 ) return 'SeaMonkey';

	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
	if ( ua.search( /Gecko/ ) > 0 ) return 'Gecko';

	// а может это вообще поисковый робот
	return 'Search Bot';
}



