


function initPoint()
{
	infProg.el.canv.addEventListener( 'mousedown', onPointMouseDown, false );
	
	let elPoint = document.querySelector('[nameId="point"]');
	elPoint.onmouseup = function(){ testPromise_2().then(data=> { crPoint({pos: data.pos, cursor: true, tool: true}); }) }

	
	document.addEventListener("keydown", function (e) 
	{ 
		if(e.keyCode == 46) { deletePoint({active: true}); }
	});	
}



function onPointMouseDown(event)
{ 
	selectPointOutLine({obj: null});
	deActivePoint({arr: infProg.scene.construction.point});
	
	let rayhit = null;		
	let arr = infProg.scene.construction;	
	
	if(camOrbit.activeCam == camOrbit.cam2D)
	{
		let ray = rayIntersect( event, arr.point, 'arr' );
		if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
	}	

	if(!rayhit) { return; }
	console.log(rayhit.object.userData.id, rayhit.object.userData.tag);
	clickPointDown({obj: rayhit.object, rayPos: rayhit.point});	
}




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
	
	if(pos) { obj.position.copy( pos );	}

	obj.renderOrder = 1;
	
	
	if(!id) { id = infProg.settings.id; infProg.settings.id++; }	
	obj.userData.id = id;	
	obj.userData.tag = 'point';
	obj.userData.active = false;
	obj.userData.point = {};
	
	obj.userData.point.click = {};
	obj.userData.point.click.offset = new THREE.Vector3();
	
	obj.userData.point.arrP = [];
	obj.userData.point.line = null;
	
	//obj.visible = (camera == camera2D) ? true : false;

	if(params.arrP)
	{
		obj.userData.point.arrP = params.arrP;
	}
	
	obj.userData.point.arrP.push(obj);
	
	scene.add( obj );	
	
	
	if(1 == 1)
	{
		let line = null;
		
		let ind = obj.userData.point.arrP.findIndex(o => o.userData.point.line);
		
		if(ind > -1)
		{
			line = obj.userData.point.arrP[ind].userData.point.line;
		}
		else
		{
			line = new THREE.Line( new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x0000ff }) );
			scene.add( line );						
		}
		
		obj.userData.point.line = line;
		
		updateLineGeomForPoint({obj: obj});
	}
	
	
	if(!tool)
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

				crPoint({pos: obj.position.clone(), cursor: true, tool: true, arrP: obj.userData.point.arrP});				
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
		
		obj.userData.active = true;
		selectPointOutLine({obj: obj});		
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

	updateLineGeomForPoint({obj: obj});
}



function updateLineGeomForPoint(params)
{
	let obj = params.obj;
	
	if(!obj.userData.point.line) return;	
	
	let line = obj.userData.point.line;
	let arrV = obj.userData.point.arrP.map(o => o.position);
	let geometry = new THREE.BufferGeometry().setFromPoints( arrV );		
	line.geometry = geometry;
	
	//line.geometry.verticesNeedUpdate = true; 
	//line.geometry.elementsNeedUpdate = true;	
}



function deletePoint(params)
{
	let active = params.active;
	let obj = params.obj;
	
	if(active)
	{
		let arr = infProg.scene.construction.point;
		
		for( let i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.active) { obj = arr[i]; break; }
		}		
	}
	
	if(!obj) return;
	
	let arrP = obj.userData.point.arrP;
	
	deleteValueFromArrya({arr: infProg.scene.construction.point, obj: obj});	
	deleteValueFromArrya({arr: arrP, obj: obj});
	
	function deleteValueFromArrya(params)
	{
		let arr = params.arr;
		let obj = params.obj;
				
		for(let i = arr.length - 1; i > -1; i--) { if(arr[i] == obj) { arr.splice(i, 1); break; } }
	}
	
	
	
	if(arrP.length == 1)
	{ 
		scene.remove( arrP[0] );
		deleteValueFromArrya({arr: infProg.scene.construction.point, obj: arrP[0]});
		deleteValueFromArrya({arr: arrP, obj: arrP[0]});		
	}
	
	if(arrP.length == 0)
	{ 
		scene.remove( obj.userData.point.line );
	}	

	updateLineGeomForPoint({obj: obj});
		
	scene.remove( obj );
	
	render();
}


function deActivePoint(params)
{
	let arr = params.arr;
	
	for( let i = 0; i < arr.length; i++ )
	{
		arr[i].userData.active = false;
	}
}



function selectPointOutLine(params)
{
	let obj = params.obj;
	
	
	if(obj)
	{
		obj.material = infProg.prefab.mat.p1.clone();
		obj.material.color = new THREE.Color( 0xff0000 );
	}
	else
	{
		let arr = infProg.scene.construction.point;
		
		for( let i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.active) 
			{
				arr[i].material.color = infProg.prefab.mat.p1.color.clone();
			}
		}			
	}
	
}




function savePoint()
{
	let json = [];
	
	let arrP = infProg.scene.construction.point;
	let arrL = [];
	
	for( let i = 0; i < arrP.length; i++ )
	{
		arrL[arrL.length] = arrP[i].userData.point.line;		
	}
	
	arrL = [...new Set(arrL)];	// получаем только уникальные значения 

	for( let i = 0; i < arrL.length; i++ )
	{
		json[i] = {};
		json[i].line = {};  
		json[i].point = [];
		
		let arrP_2 = arrP.filter(o => arrL[i] == o.userData.point.line);
		
		for( let i2 = 0; i2 < arrP_2.length; i2++ )
		{
			json[i].point[i2] = {};
			json[i].point[i2].id = arrP_2[i2].userData.id;
			json[i].point[i2].pos = arrP_2[i2].position;
		}
	}
	
	console.log(json);
	
	return json;
}



function loadPoint(params)
{
	let data = params.data;
	
	if(data.length == 0) return;
	
	for( let i = 0; i < data.length; i++ )
	{
		let arrP = data[i].point;
		let pp = null;
		
		for( let i2 = 0; i2 < arrP.length; i2++ )
		{
			let pos = new THREE.Vector3(arrP[i2].pos.x, arrP[i2].pos.y, arrP[i2].pos.z);
			
			let o = crPoint({id: arrP[i2].id, pos: pos, arrP: pp});

			pp = o.userData.point.arrP;
		}		
	}
	
	
	
}





