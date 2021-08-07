

function crCylinderGM(params)
{	
	const geometry = new THREE.CylinderGeometry( 0.2, 0.2, 0.1, 18 );
	const material = new THREE.MeshPhongMaterial( {color: 0xffff00, wireframe: false} );
	
	const cylinder = new THREE.Mesh( geometry, material );
	scene.add( cylinder );
	
	let attrP = geometry.getAttribute('position');
	
	for( let i = 0; i < attrP.array.length; i+=3 ) 
	{
		//attrP.array[i + 0] *= 0.5;		
		//attrP.array[i + 2] *= 0.5;
		
		let y = attrP.array[i + 1];
		if(y < 0) { attrP.array[i + 1] = 0; console.log(i+1); }
	}
		
	cylinder.geometry.attributes.position.needsUpdate = true;
	
	console.log(attrP);
}



function crPoint( pos, id )
{
	var point = obj_point[obj_point.length] = new THREE.Mesh( infProject.tools.point.geometry, infProject.tools.point.material.clone() );
	point.position.copy( pos );		

	point.renderOrder = 1;
	
	point.w = [];
	point.p = [];
	point.start = [];		
	point.zone = [];
	point.zoneP = [];
	
	
	if(id == 0) { id = countId; countId++; }	
	point.userData.id = id;	
	point.userData.tag = 'point';
	point.userData.point = {};
	point.userData.point.color = point.material.color.clone();
	point.userData.point.cross = null;
	point.userData.point.type = null;
	point.userData.point.last = { pos : pos.clone(), cdm : '', cross : null };
	
	point.visible = (camera == cameraTop) ? true : false;	
	
	scene.add( point );	
	
	return point;
}





