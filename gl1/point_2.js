


class Point_2
{
	constructor(params)
	{
		this.params = params;
		this.planeMath = this.initPlaneMath();
		this.geometry_1 = this.cylinderGeometry();
		this.m_default = new THREE.MeshPhongMaterial( {color: 0x00ff00, wireframe: false} );
		this.m_active = new THREE.MeshPhongMaterial( {color: 0xff0000, wireframe: false} );		
		
		this.arrPoint = [];
		
		this.initEvent();	
	}
	

	initEvent()
	{
		let mouseDown = this.mouseDown.bind(this);
		let deleteKeyPoint = this.deleteKeyPoint.bind(this);
		let promise_1 = this.promise_1.bind(this);
		let crPoint = this.crPoint.bind(this);
		
		this.params.container.addEventListener( 'mousedown', mouseDown, false );
		document.addEventListener( 'keydown', deleteKeyPoint, false);
		
		let el = document.querySelector('[nameId="blockButton_1"]');

		let html = '<div class="button1 gradient_1" nameId="point">point 2</div>';					
		let div = document.createElement('div');
		div.innerHTML = html;
		let elem = div.firstChild;
			
		el.append(elem);
		
		elem.onmouseup = function(){ promise_1().then(data=> { crPoint({pos: data.pos, cursor: true, tool: true}); }) }
	}
	
	
	initPlaneMath()
	{
		let geometry = new THREE.PlaneGeometry( 10000, 10000 );		
		let material = new THREE.MeshPhongMaterial( {color: 0xffff00, transparent: true, opacity: 0.5, side: THREE.DoubleSide } );
		material.visible = false; 
		let planeMath = new THREE.Mesh( geometry, material );
		planeMath.rotation.set(-Math.PI/2, 0, 0);	
		scene.add( planeMath );	
		
		return planeMath;
	}
	

	cylinderGeometry(params)
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
	
	

	promise_1()
	{
		let container = this.params.container;
		let rayIntersect = this.rayIntersect.bind(this);
		let planeMath = this.planeMath;
		
		return new Promise((resolve, reject) => 
		{
			document.onmousemove = function(e)
			{ 			
				if(e.target == container) 
				{
					document.onmousemove = null;
					let intersects = rayIntersect( event, planeMath, 'one' );
					if(intersects.length == 0) reject();
					
					resolve({pos: intersects[ 0 ].point});
				}
			}
		});
	}	
	
	mouseDown(event)
	{ 
		this.activePoint({obj: null});
		this.deActivePoint({arr: this.arrPoint});
		
		let rayhit = null;		
		
		if(camOrbit.activeCam == camOrbit.cam2D)
		{
			let ray = this.rayIntersect( event, this.arrPoint, 'arr' );
			if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
		}	

		render();
		
		if(!rayhit) { return; }
		console.log(rayhit.object.userData.id, rayhit.object.userData.tag);
		this.selectPoint({obj: rayhit.object, rayPos: rayhit.point});	
	}
	

	crPoint(params)
	{
		let id = params.id;
		let pos = params.pos;
		let cursor = params.cursor;
		let tool = params.tool;
		
		let obj = new THREE.Mesh( this.geometry_1, this.m_default );
		
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
			
			this.updateLineGeomForPoint({obj: obj});
		}
		
		
		if(!tool)
		{
			let arr = this.arrPoint;	
			arr[arr.length] = obj;		
		}
		
		if(cursor) 
		{
			this.selectPoint({obj: obj, rayPos: obj.position, tool: tool});	
		}
		
		render();
		
		return obj;
	}
	
	
	selectPoint(params)
	{
		let rayPos = params.rayPos;	
		let obj = params.obj;	

			
		obj.userData.point.click.offset = new THREE.Vector3().subVectors( obj.position, rayPos );
		
		this.planeMath.position.set( 0, rayPos.y, 0 );
		this.planeMath.rotation.set(-Math.PI/2, 0, 0);	

		camOrbit.stopMove = true;
		
		let container = this.params.container;
		
		if(params.tool)
		{
			let crPoint = this.crPoint.bind(this);
			let deletePoint = this.deletePoint.bind(this);
			let arrPoint = this.arrPoint;
			
			container.onmousedown = function(e)
			{ 
				container.onmousemove = null; 
				container.onmousedown = null;  
			
				if(e.button == 2)
				{
					deletePoint({obj: obj});
					
					camOrbit.stopMove = false;
				}
				else
				{					
					arrPoint[arrPoint.length] = obj;

					crPoint({pos: obj.position.clone(), cursor: true, tool: true, arrP: obj.userData.point.arrP});				
				}
			}
		}
		else
		{
			container.onmouseup = function()
			{ 
				container.onmousemove = null; 
				container.onmouseup = null; 
				
				camOrbit.stopMove = false;
			}
			
			obj.userData.active = true;
			this.activePoint({obj: obj});		
		}
		
		let pointMove = this.pointMove.bind(this);
		
		container.onmousemove = function(e){ pointMove({ event: e, obj: obj }); }
		
		render();
	}

	
	pointMove(params)
	{	
		let event = params.event;
		let obj = params.obj;
		
		let intersects = this.rayIntersect( event, this.planeMath, 'one' ); 
		
		if(intersects.length == 0) return;
		
		let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, obj.userData.point.click.offset );				
		pos.y = 0; 
		
		obj.position.copy( pos );

		this.updateLineGeomForPoint({obj: obj});
		
		render();
	}


	updateLineGeomForPoint(params)
	{
		let obj = params.obj;
		
		if(!obj.userData.point.line) return;	
		
		let line = obj.userData.point.line;
		let arrV = obj.userData.point.arrP.map(o => o.position);
		let geometry = new THREE.BufferGeometry().setFromPoints( arrV );
		
		line.geometry.dispose();		
		line.geometry = geometry;
		
		//line.geometry.verticesNeedUpdate = true; 
		//line.geometry.elementsNeedUpdate = true;	
	}


	deActivePoint(params)
	{
		let arr = params.arr;
		
		for( let i = 0; i < arr.length; i++ )
		{
			arr[i].userData.active = false;
		}
	}



	activePoint(params)
	{
		let obj = params.obj;
		
		
		if(obj)
		{
			obj.material = this.m_active;
		}
		else
		{
			let arr = this.arrPoint;
			
			for( let i = 0; i < arr.length; i++ )
			{
				if(arr[i].userData.active) 
				{
					arr[i].material = this.m_default;
				}
			}			
		}
		
	}
	
	

	deleteKeyPoint(event)
	{ 
		if(event.keyCode == 46) { this.deletePoint({active: true}); }
	}
	
	
	deletePoint(params)
	{
		let active = params.active;
		let obj = params.obj;
		
		if(active)
		{
			let arr = this.arrPoint;
			
			for( let i = 0; i < arr.length; i++ )
			{
				if(arr[i].userData.active) { obj = arr[i]; break; }
			}		
		}
		
		if(!obj) return;
		
		let arrP = obj.userData.point.arrP;
		
		this.deleteValueFromArrya({arr: this.arrPoint, obj: obj});	
		this.deleteValueFromArrya({arr: arrP, obj: obj});


		if(arrP.length == 1)
		{ 
			scene.remove( arrP[0] );
			this.deleteValueFromArrya({arr: this.arrPoint, obj: arrP[0]});
			this.deleteValueFromArrya({arr: arrP, obj: arrP[0]});		
		}
		
		if(arrP.length == 0)
		{ 
			obj.userData.point.line.geometry.dispose();
			scene.remove( obj.userData.point.line );
		}	

		this.updateLineGeomForPoint({obj: obj});
			
		scene.remove( obj );
		
		render();
	}
	
	
	deleteValueFromArrya(params)
	{
		let arr = params.arr;
		let obj = params.obj;
				
		for(let i = arr.length - 1; i > -1; i--) { if(arr[i] == obj) { arr.splice(i, 1); break; } }
	}
	

	savePoint()
	{
		let arrP = this.arrPoint;
		
		if(arrP.length == 0) return [];
		
		let json = [];
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



	loadPoint(params)
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
				
				let o = this.crPoint({id: arrP[i2].id, pos: pos, arrP: pp});

				pp = o.userData.point.arrP;
			}		
		}
	}


	rayIntersect( event, obj, t ) 
	{		
		let container = this.params.container; 

		let mouse = getMousePosition( event );
		
		function getMousePosition( event )
		{
			let x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
			let y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;	
			
			return new THREE.Vector2(x, y);
		}
		
		let raycaster = new THREE.Raycaster()
		raycaster.setFromCamera( mouse, infProg.scene.camera );
		
		let intersects = null;
		if(t == 'one'){ intersects = raycaster.intersectObject( obj ); } 
		else if(t == 'arr'){ intersects = raycaster.intersectObjects( obj, true ); }
		
		return intersects;
	}

}




































