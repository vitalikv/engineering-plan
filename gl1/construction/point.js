

let elPoint = document.querySelector('[nameId="point"]');
elPoint.onmouseup = function(){ testPromise_2().then(data=> { crPoint({pos: data.pos, cursor: true, tool: true}); }) }


function testPromise_2()
{
	return new Promise((resolve, reject) => 
	{
		document.onmousemove = function(e)
		{ 			
			if(e.target == infProg.el.canv) 
			{
				document.onmousemove = null;
				let intersects = rayIntersect( event, infProg.scene.planeMath, 'one' );
				if(intersects.length == 0) reject();
				
				resolve({pos: intersects[ 0 ].point});
			}
		}
	});
}



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
	let cursor = params.cursor;
	let tool = params.tool;
	
	let obj = new THREE.Mesh( infProg.prefab.geom.p1, infProg.prefab.mat.p1 );
	
	if(pos) obj.position.copy( pos );		

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
	
	obj.userData.point.click = {};
	obj.userData.point.click.offset = new THREE.Vector3();
	//obj.userData.point.color = point.material.color.clone();
	obj.userData.point.cross = null;
	obj.userData.point.type = null;
	obj.userData.point.last = { pos : obj.position.clone(), cdm : '', cross : null };
	
	//obj.visible = (camera == camera2D) ? true : false;	
	
	scene.add( obj );	
	
	
	if(!params.tool)
	{
		let arr = infProg.scene.construction.point;	
		arr[arr.length] = obj;		
	}
	
	if(cursor) 
	{
		clickPointDown({obj: obj, rayPos: obj.position, tool: tool});	
	}
	
	render();
	
	return obj;
}



function clickPointDown(params)
{
	let rayPos = params.rayPos;	
	let obj = params.obj;	


	obj.userData.point.click.offset = new THREE.Vector3().subVectors( obj.position, rayPos );
	
	infProg.scene.planeMath.position.set( 0, rayPos.y, 0 );
	infProg.scene.planeMath.rotation.set(-Math.PI/2, 0, 0);	

	infProg.act.stopCam = true;
	
		
	if(params.tool)
	{
		infProg.el.canv.onmousedown = function(e)
		{ 
			infProg.el.canv.onmousemove = null; 
			infProg.el.canv.onmousedown = null;  
		
			if(e.button == 2)
			{
				deletePoint({obj: obj});
			}
			else
			{				
				let arr = infProg.scene.construction.point;	
				arr[arr.length] = obj;

				crPoint({pos: obj.position.clone(), cursor: true, tool: true});				
			}
		}
	}
	else
	{
		infProg.el.canv.onmouseup = function()
		{ 
			infProg.el.canv.onmousemove = null; 
			infProg.el.canv.onmouseup = null; 
		}
	}
	
	infProg.el.canv.onmousemove = function(e){ clickPointMove({ event: e, obj: obj }); }
	
}



function clickPointMove(params)
{	
	let event = params.event;
	let obj = params.obj;
	
	let intersects = rayIntersect( event, infProg.scene.planeMath, 'one' ); 
	
	if(intersects.length == 0) return;
	
	let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, obj.userData.point.click.offset );				
	pos.y = 0; 
	
	obj.position.copy( pos );	
}



function clickPointUp(params)
{
	infProg.act.stopCam = false
}


function deletePoint(params)
{
	let obj = params.obj;
	
	deleteValueFromArrya({arr: infProg.scene.construction.point, obj: obj});
	scene.remove( obj );
}


// удаление значения из массива 
function deleteValueFromArrya(params)
{
	let arr = params.arr;
	let obj = params.obj;
	
	console.log(arr.length);
	for(let i = arr.length - 1; i > -1; i--) { if(arr[i] == obj) { arr.splice(i, 1); break; } }
	console.log(arr.length);
}






