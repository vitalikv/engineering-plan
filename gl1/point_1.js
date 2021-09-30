


class Point_1
{
	constructor(params)
	{
		this.params = params;
		this.planeMath = this.initPlaneMath();
		this.geometry_1 = this.cylinderGeometry();
		this.m_p_default = new THREE.MeshPhongMaterial( {color: 0x222222, depthTest: false, transparent: true, wireframe: false} );
		this.m_active = new THREE.MeshPhongMaterial( {color: 0xff0000, wireframe: false} );	

		this.m_w_default = new THREE.MeshPhongMaterial( {color: 0xcccccc, wireframe: false} );
		
		this.arrPoint = [];
		this.countId = {};
		this.countId.p = 0;
		this.countId.w = 0;
		
		this.actTool = false;
		
		this.initEvent();	
	}
	

	initEvent()
	{
		
		this.params.container.addEventListener( 'mousedown', (event) => {this.clickScene(event)} );
		
		document.addEventListener( 'keydown', (event) => {this.deleteKeyPoint(event)} );
		

		if(1==1)
		{		
			let el = document.querySelector('[nameId="blockButton_1"]');
			let html = '<div class="button1 gradient_1" nameId="point">point 1</div>';					
			let div = document.createElement('div');
			div.innerHTML = html;
			let elem = div.firstChild;			
			el.append(elem);		
			elem.onmouseup =()=> 
			{ 
				if(camOrbit.activeCam == camOrbit.cam2D)
				{
					this.promise_1().then(data=> { this.crPoint({pos: data.pos, cursor: true, tool: true}); })
				}				 
			}			
		}

		if(1==1)
		{
			let el = document.querySelector('[nameId="blockButton_save_1"]');
			let html = '<div class="button1 gradient_1" nameId="sv">save 1</div>';					
			let div = document.createElement('div');
			div.innerHTML = html;
			let elem = div.firstChild;			
			el.append(elem);		
			elem.onmousedown =()=> { this.saveFile({test: true, file: 'saveTest_1.json'}); }			
		}

		if(1==1)
		{
			let el = document.querySelector('[nameId="blockButton_load_1"]');
			let html = '<div class="button1 gradient_1" nameId="ld">load 1</div>';					
			let div = document.createElement('div');
			div.innerHTML = html;
			let elem = div.firstChild;			
			el.append(elem);		
			elem.onmousedown =()=> { this.loadFile({test: true, file: 'saveTest_1.json'}); }			
		}	
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
		planeMath.position.set( 0, 0, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		
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
	
	// кликнули куда-то в сцену
	clickScene(event)
	{ 
		if(camOrbit.activeCam != camOrbit.cam2D) return;
		if(this.actTool) return;
		
		this.activePoint({obj: null});
		this.deActivePoint({arr: this.arrPoint});
		
		let rayhit = null;		
		
		if(1 == 1)
		{
			let ray = this.rayIntersect( event, this.arrPoint, 'arr' );
			if(!rayhit) { if(ray.length > 0) { rayhit = ray[0]; } }		
		}	

		render();
		
		if(!rayhit) { return; }
		
		let joinP = rayhit.object.userData.point.joinP.map(o => o.userData.id)
		console.log('clickScene', rayhit.object.userData.id, rayhit.object.userData.tag, joinP, rayhit.object.userData.point.joinW);

		this.addEventPoint({obj: rayhit.object, rayPos: rayhit.point});	
	}
	

	crPoint(params)
	{
		let id = params.id;
		let pos = params.pos;
		let cursor = params.cursor;
		let tool = params.tool;
		
		let obj = new THREE.Mesh( this.geometry_1, this.m_p_default );
		
		if(pos) { obj.position.copy( pos );	}

		obj.renderOrder = 1;
		
		
		if(id == undefined) { id = this.countId.p; this.countId.p++; }	
		obj.userData.id = id;	
		obj.userData.tag = 'point';
		obj.userData.active = false;
		obj.userData.point = {};
		
		obj.userData.point.click = {};
		obj.userData.point.click.offset = new THREE.Vector3();
		
		obj.userData.point.joinP = [];
		obj.userData.point.joinW = [];
		
		//obj.visible = (camera == camera2D) ? true : false;


		if(params.joinP)
		{ 
			let arr = params.joinP;
			
			for ( let i = 0; i < arr.length; i++ )
			{ 
				if(!arr[i]) continue;
				
				obj.userData.point.joinP.push(arr[i]);
				arr[i].userData.point.joinP.push(obj);

				this.crWall({p1: obj, p2: arr[i]});
			}	
		}		
		
		scene.add( obj );	
		
		
		
		
		
		if(!tool)
		{	
			this.arrPoint[this.arrPoint.length] = obj;		
		}
		
		if(cursor) 
		{
			this.addEventPoint({obj: obj, rayPos: obj.position, tool: tool});	
		}
		
		render();
		
		return obj;
	}
	
	
	// добавляем события выбранной точке/tool
	addEventPoint(params)
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
			this.actTool = true;			
			
			container.onmousedown =(e)=>
			{ 
				container.onmousemove = null; 
				container.onmousedown = null;  
				this.actTool = false; 
				
				if(e.button == 2)
				{
					this.deletePoint({obj: obj});
					
					camOrbit.stopMove = false;
				}
				else
				{	
					this.finishToolPoint({obj: obj});	
				}
			}
		}
		else
		{
			container.onmouseup =()=>
			{ 
				container.onmousemove = null; 
				container.onmouseup = null; 
				
				camOrbit.stopMove = false;
			}
			
			obj.userData.active = true;
			this.activePoint({obj: obj});		
		}
		
		container.onmousemove =(e)=> { this.pointMove({ event: e, obj: obj }); }
		
		//render();
	}

	// закончили действия с Tool Point
	finishToolPoint(params)
	{
		let obj = params.obj;
		
		let o = rayFromObj({obj: obj, arr: this.arrPoint});  
		
		if(o)
		{
			camOrbit.stopMove = false;	
			//-------------
			
			let p = obj.userData.point.joinP;
			let w = obj.userData.point.joinW;
			
			if(p.length == 0)
			{
				this.deletePoint({obj: obj});
				this.crPoint({pos: obj.position.clone(), cursor: true, tool: true, joinP: [o]});
			}
			else
			{
				this.deleteValueFromArrya({arr: p[0].userData.point.joinP, obj: obj});
				this.deleteValueFromArrya({arr: p[0].userData.point.joinW, obj: w[0]});
				w[0].geometry.dispose();
				scene.remove( w[0] );				
				
				scene.remove( obj );

				if(1 == 1)
				{
					p[0].userData.point.joinP.push(o);
					o.userData.point.joinP.push(p[0]);

					this.crWall({p1: p[0], p2: o});			
				}							
			}			
		}
		else
		{
			this.arrPoint[this.arrPoint.length] = obj;
			this.crPoint({pos: obj.position.clone(), cursor: true, tool: true, joinP: [obj]});							
		}

		// пускаем луч и определяем в какой объект упирается
		function rayFromObj(params) 
		{
			let obj = params.obj;
			let arr = params.arr;
			
			obj.updateMatrixWorld();
			obj.geometry.computeBoundingSphere();
			
			let pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
			pos.y = 1;
			
			let ray = new THREE.Raycaster();
			ray.set( pos, new THREE.Vector3(0, -1, 0) );
			
			let intersects = ray.intersectObjects( arr, true );	
			
			let o = null;
			if(intersects.length > 0) { o = intersects[0].object; }			
			
			return o;
		}		
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
		
		pos = this.nearPoint({obj: obj});
		obj.position.copy( pos );
		
		this.updateWall({obj: obj});
		
		render();
	}

	nearPoint(params)
	{
		let obj = params.obj;
		
		let pos = obj.position.clone(); 
		let arr = this.arrPoint;
		
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i] == obj) { continue; }		 
			
			if(pos.distanceTo( arr[i].position ) < 0.2 / camOrbit.cam2D.zoom) 
			{ 
				pos = arr[i].position.clone();
				//obj.userData.point.cross = point = obj_point[i];
				break;
			}	
		}

		return pos;
	}

	crWall(params)
	{
		let id = params.id;		
		
		let p1 = params.p1;
		let p2 = params.p2;
			
		
		let obj = new THREE.Mesh( new THREE.BufferGeometry(), this.m_w_default );	

		if(id == undefined) { id = this.countId.w; this.countId.w++; }	
		obj.userData.id = id;	
		obj.userData.active = false;		
		
		obj.userData.click = {};
		obj.userData.click.offset = new THREE.Vector3();
		
		obj.userData.w = {};
		obj.userData.w.joinP = [p1, p2];

		
		scene.add( obj );
		
		p1.userData.point.joinW.push(obj);
		p2.userData.point.joinW.push(obj);  
		
		console.log('crWall', p1.userData.id, p2.userData.id, p1.userData.point.joinW, p2.userData.point.joinW);
		
		this.updateWall({obj: p1});
	}
	

	updateWall(params)
	{
		let obj = params.obj;
		
		if(obj.userData.point.joinW.length == 0) return;	
		
		let arrW = obj.userData.point.joinW;
		
		for( let i = 0; i < arrW.length; i++ )
		{
			let geometry = this.updateGeomWall({p1: arrW[i].userData.w.joinP[0], p2: arrW[i].userData.w.joinP[1]});
			arrW[i].geometry.dispose();
			arrW[i].geometry = geometry;
		}
		
		
		//line.geometry.verticesNeedUpdate = true; 
		//line.geometry.elementsNeedUpdate = true;	
	}


	updateGeomWall(params)
	{
		let p1 = params.p1;
		let p2 = params.p2;
		
		
		let dir = new THREE.Vector2(p1.position.z - p2.position.z, p1.position.x - p2.position.x).normalize();	// перпендикуляр
		let width = 0.02;
		let offsetL = new THREE.Vector2(dir.x * -width, dir.y * -width);
		let offsetR = new THREE.Vector2(dir.x * width, dir.y * width);
		
		let arr = [];
		
		arr[arr.length] = new THREE.Vector2( p1.position.x, -p1.position.z).add(offsetR);
		arr[arr.length] = new THREE.Vector2( p1.position.x, -p1.position.z + 0 );
		arr[arr.length] = new THREE.Vector2( p1.position.x, -p1.position.z).add(offsetL);
		arr[arr.length] = new THREE.Vector2( p2.position.x, -p2.position.z).add(offsetL);
		arr[arr.length] = new THREE.Vector2( p2.position.x, -p2.position.z + 0 );
		arr[arr.length] = new THREE.Vector2( p2.position.x, -p2.position.z).add(offsetR);

		
		
		let shape = new THREE.Shape( arr );
		let geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 3 } );
		geometry.rotateX(-Math.PI/2);

		return geometry;
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
					arr[i].material = this.m_p_default;
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
		let reset = (params.reset) ? true : false;
		
		if(active)
		{
			let arr = this.arrPoint;
			
			for( let i = 0; i < arr.length; i++ )
			{
				if(arr[i].userData.active) { obj = arr[i]; break; }
			}		
		}
		
		if(!obj) return;
		
		let p = obj.userData.point.joinP;
		let w = obj.userData.point.joinW;
		
		if(p.length > 2 && !reset) return;
		
		for( let i = 0; i < p.length; i++ )
		{			
			this.deleteValueFromArrya({arr: p[i].userData.point.joinP, obj: obj});

			for( let i2 = 0; i2 < w.length; i2++ )
			{
				this.deleteValueFromArrya({arr: p[i].userData.point.joinW, obj: w[i2]});
				w[i2].geometry.dispose();
				scene.remove( w[i2] );				
			}
		}
		
		obj.userData.point.joinP = [];
		obj.userData.point.joinW = [];
		
		if(p.length == 2 && !reset)
		{
			let exsist1 = p[0].userData.point.joinP.find(point => point == p[1]);
			let exsist2 = p[1].userData.point.joinP.find(point => point == p[0]);
			
			// когда удалем точку из треугольника стен, чтобы не создавать стену в стене
			if(!exsist1 && !exsist2) 
			{
				p[0].userData.point.joinP.push(p[1]);
				p[1].userData.point.joinP.push(p[0]);

				this.crWall({p1: p[0], p2: p[1]});							
			}
		}
		
		let arr = [...p, obj];  
		
		for( let i = 0; i < arr.length; i++ )
		{
			if(arr[i].userData.point.joinP.length > 0) continue;
			
			this.deleteValueFromArrya({arr: this.arrPoint, obj: arr[i]});
			scene.remove( arr[i] );
		}			
		
		
		render();
	}
	
	
	deleteValueFromArrya(params)
	{
		let arr = params.arr;
		let obj = params.obj;
				
		for(let i = arr.length - 1; i > -1; i--) { if(arr[i] == obj) { arr.splice(i, 1); break; } }
	}
	
	
	resetScene()
	{
		let arr = this.arrPoint;
		
		for( let i = arr.length - 1; i >= 0; i-- )
		{
			this.deletePoint({obj: arr[i], reset: true});
		}
	
		this.countId.p = 0;
		this.arrPoint = [];
	}

	async saveFile(params)
	{
		let file = params.file;

		
		let json = this.savePoint();		
		let data = JSON.stringify( json );
		
		if(params.test)
		{
			// сохраняем в папку
			let url = infProg.path+'saveLoad/savePhp.php';			
			
			let response = await fetch(url, 
			{
				method: 'POST',
				body: 'myarray='+encodeURIComponent(data)+'&file='+file,
				headers: 
				{	
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
				},				
			});
			
			let inf = await response.json();

			console.log(inf);
			
			return true;
		}		
	}


	savePoint()
	{
		let arrP = this.arrPoint;		
		
		let json = {};
		json.point = [];
		
		for( let i = 0; i < arrP.length; i++ )
		{ 
			json.point[i] = {};
			json.point[i].id = arrP[i].userData.id;
			json.point[i].pos = arrP[i].position;
			
			json.point[i].joinP = arrP[i].userData.point.joinP.map(o => o.userData.id);		
		}
		
		return json;
	}

	
	
	async loadFile(params)
	{
		let file = params.file;
		
		if(params.test)
		{
			// сохраняем в папку
			let url = infProg.path + 't/' + file;			
			
			let response = await fetch(url, 
			{
				method: 'GET',
				headers: 
				{	
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
				},				
			});
			
			let inf = await response.json();

			console.log(inf);
			
			this.loadPoint({json: inf});
			
			return true;
		}		
	}
	
	loadPoint(params)
	{
		this.resetScene();
		
		let json = params.json;
		
		for( let i = 0; i < json.point.length; i++ )
		{
			let point = json.point[i];			
			
			let pos = new THREE.Vector3(point.pos.x, point.pos.y, point.pos.z);
			
			let joinP = point.joinP.map(id => { return this.findObj({arr: this.arrPoint, id: id}); })			
			
			let o = this.crPoint({id: point.id, pos: pos, joinP: joinP});		
		}
		
		let arrId = json.point.map(o => o.id);
		let maxId = Math.max(...arrId);
		
		this.countId.p = maxId + 1;  
	}
	
	
	findObj(params)
	{
		let id = params.id;
		let arr = params.arr;
		
		for ( let i = 0; i < arr.length; i++ )
		{ 
			if(arr[i].userData.id == id){ return arr[i]; } 
		}	
		
		return null;
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




































