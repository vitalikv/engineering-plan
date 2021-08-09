

function crCylinderGeom(params)
{	
	let geometry = new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 18 );
	
	let attrP = geometry.getAttribute('position');
	
	for( let i = 0; i < attrP.array.length; i+=3 ) 
	{
		//attrP.array[i + 0] *= 0.5;		
		//attrP.array[i + 2] *= 0.5;
		
		let y = attrP.array[i + 1];
		if(y < 0) { attrP.array[i + 1] = 0; }
	}
		
	geometry.attributes.position.needsUpdate = true;
	
	return geometry;
}



function crPoint(params)
{
	let id = params.id;
	let pos = params.pos;
	
	let obj = new THREE.Mesh( infProg.prefab.geom.p1, infProg.prefab.mat.p1 );
	obj.position.copy( pos );		

	obj.renderOrder = 1;
	
	obj.w = [];
	obj.p = [];
	obj.start = [];		
	obj.zone = [];
	obj.zoneP = [];
	
	
	if(!id) { id = infProg.settings.id; infProg.settings.id++; }	
	obj.userData.id = id;	
	obj.userData.tag = 'point';
	obj.userData.point = {};
	//obj.userData.point.color = point.material.color.clone();
	obj.userData.point.cross = null;
	obj.userData.point.type = null;
	obj.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	//obj.visible = (camera == camera2D) ? true : false;	
	
	scene.add( obj );	
	
	let arr = infProg.scene.construction.point;
	
	arr[arr.length] = obj;
	
	infProg.scene.selectO = obj;
	
	return obj;
}



function movePoint( event, obj )
{	
	let intersects = rayIntersect( event, infProg.scene.planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, new THREE.Vector3() );				
	pos.y = 0; 
	
	obj.position.copy( pos );	
}





