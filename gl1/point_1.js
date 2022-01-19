


class Point_1
{
	constructor(params)
	{
		this.params = params;
		this.planeMath = this.initPlaneMath();
		this.geometry_1 = this.cylinderGeometry();
		this.m_p_default = new THREE.MeshPhongMaterial( {color: 0x222222, depthTest: false, transparent: true, wireframe: false} );
		this.m_active = new THREE.MeshPhongMaterial( {color: 0xff0000, wireframe: false} );	

		this.m_w_default = new THREE.MeshPhongMaterial( {color: 0xe3e3e5, wireframe: false} );
		
		this.line = {};
		this.line.test = this.initLineAxis();
		this.line.axis = {};
		this.line.axis.horiz = this.initLineAxis();
		this.line.axis.vert = this.initLineAxis();
		
		this.countId = {};
		this.countId.p = 0;
		this.countId.w = 0;
		
		this.level = [];		
		this.actLevelId = -1;		
		this.actTool = false;
		
		this.initEvent();

		this.el = {};
		this.el.wrapLevel = document.querySelector('[nameId="wrapLevel"]');
		this.el.listLevel = null;
		this.el.addItemLevel = null;

		this.initLevelHtml();
		this.resetScene();
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
			attrP.array[i + 0] *= 0.5;	// x		
			attrP.array[i + 2] *= 0.5;	// z
			
			let y = attrP.array[i + 1];
			if(y < 0) { attrP.array[i + 1] = 0; }
		}
			
		geometry.attributes.position.needsUpdate = true;
		
		geometry.userData.attrP = geometry.getAttribute('position').clone();
		
		return geometry;
	}

	pointScale()
	{
		if(!this.geometry_1){ return; }
		
		let geometry = this.geometry_1;
		
		let attrP = geometry.userData.attrP;
		let attrP_2 = [];
		
		for( let i = 0; i < attrP.array.length; i+=3 ) 
		{
			attrP_2[i + 0] = attrP.array[i + 0] / camOrbit.cam2D.zoom;	// x		
			attrP_2[i + 2] = attrP.array[i + 2] / camOrbit.cam2D.zoom;	// z
			
			attrP_2[i + 1] = attrP.array[i + 1];	// y
		}
		
		geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(attrP_2), 3 ) );	
		geometry.attributes.position.needsUpdate = true;
	}		
	
	initLineAxis()
	{
		let obj = new THREE.Line( new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff0000 }) );		
		scene.add( obj );	
		
		return obj;
	}
	

	promise_1()
	{
		let container = this.params.container;
		let rayIntersect = this.rayIntersect.bind(this);
		
		let planeMath = this.planeMath;
		planeMath.position.set( 0, this.level[this.actLevelId].h1, 0 );
		planeMath.rotation.set(-Math.PI/2, 0, 0);
		planeMath.updateMatrixWorld();
		
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
	
	initLevelHtml()
	{
		let html = 
		`<div nameId="rp_plane_1" style="height: 250px; margin: auto 10px; border: 1px solid #ccc; border-radius: 3px; background-color: #fff;">
			<div nameId="listLevel">
			</div>
			<div nameId="addItemLevel" style="display: flex; margin: 3px 0; padding: 3px; border: 1px solid #ccc; background: #ffffff; cursor: pointer;">	
				<div style="margin: auto 20px; font-family: arial,sans-serif; font-size: 15px; color: #666; text-decoration: none;"> + </div>	
			</div>					
		</div>`;
		
		let div = document.createElement('div');
		div.innerHTML = html;
		let elem = div.firstChild;			
		this.el.wrapLevel.append(elem);

		this.el.listLevel = elem.querySelector('[nameId="listLevel"]');
		this.el.addItemLevel = elem.querySelector('[nameId="addItemLevel"]');

		this.el.addItemLevel.onmousedown =()=> 
		{ 
			this.settingLevel({type: 'add'}); 
		}		
	}

	
	settingLevel(params)
	{
		
		let addItemLevel =(params)=>
		{
			this.actLevelId = params.id;
			selectItemLevel();			
		}
		
		let addLevel =()=>
		{
			let n = this.level.length;
			
			this.level[n] = {};
			this.level[n].pps = [];
			this.level[n].h1 = (n == 0) ? 0 : this.level[n - 1].h2;
			this.level[n].h2 = this.level[n].h1 + 3;
			this.level[n].el = null;
			
			this.actLevelId = n;

			let createItemLevel =(params)=>
			{
				let id = this.actLevelId;
				
				let html = 		
				`<div style="display: flex; margin: 3px 0; padding: 3px; border: 1px solid #ccc; background: #ffffff; cursor: pointer;">
					<div style="display: flex;">
						<div style="margin: auto 20px; font-family: arial,sans-serif; font-size: 15px; color: #666; text-decoration: none;">этаж ${id}</div>
						<div nameId="delete" style="margin: auto 20px auto auto; font-family: arial,sans-serif; font-size: 15px; color: #666; text-decoration: none;">удалить</div>
					</div>
				</div>`;					
			
				let div = document.createElement('div');
				div.innerHTML = html;
				let elem = div.firstChild;			
				this.el.listLevel.append(elem);
			
				elem.onmousedown =()=> { addItemLevel({id: id}); }
				
				let el_delete = elem.querySelector('[nameId="delete"]');		
				el_delete.onmousedown =(e)=> { deleteLevel(); e.stopPropagation(); }
			
				this.level[id].el = elem;
			}
	
			createItemLevel();
			upItemLevel();
			selectItemLevel();			
		}

		let deleteLevel =(params)=>
		{
			if(!params) params = {};
			
			let execute = false;
			
			if(params.reset) { execute = true; }
			if(this.level.length > 1) { execute = true; }
			
			if(execute) 
			{
				let n = this.level.length - 1;
				
				this.level[n].el.remove();

				for( let i = this.level[n].pps.length - 1; i >= 0; i-- )
				{ 
					this.deletePoint({obj: this.level[n].pps[i], reset: true});		
				}		
				
				this.level.pop();
			}

			this.actLevelId = this.level.length - 1;
			
			upItemLevel();
			selectItemLevel();			
		}

		let selectItemLevel =()=>
		{			
			this.level.forEach(item => item.el.style.backgroundColor = '#fff' )
			
			if(this.actLevelId > -1)
			{
				this.level[this.actLevelId].el.style.backgroundColor = 'rgb(167, 207, 242)';
			}					
		}
		
		let upItemLevel =()=>
		{			
			for( let i = 0; i < this.level.length; i++ )
			{
				let el = this.level[i].el.querySelector('[nameId="delete"]');			
				el.onmousedown =(e)=> {  }
				el.style.display = 'none';
			}
			
			if(this.level.length > 1)
			{
				let n = this.level.length - 1;
				let el = this.level[n].el.querySelector('[nameId="delete"]');
				el.onmousedown =(e)=> { deleteLevel(); e.stopPropagation(); }
				el.style.display = '';
			}			
		}		
		
		if(params.type == 'addItemLevel') { addItemLevel({id: params.id}); }
		if(params.type == 'add') { addLevel(); }
		if(params.type == 'delete') { deleteLevel(params); }
		
		console.log(this.actLevelId);
	}
	
	
	getActLevelArrPoint()
	{
		return this.level[this.actLevelId].pps;
	}
	

	getActLevelArrWall()
	{
		let arrW = [];
		let arr = this.getActLevelArrPoint();
		for ( let i = 0; i < arr.length; i++ )
		{
			arrW.push(...arr[i].userData.point.joinW);
		}
		
		arrW = [...new Set(arrW)];
		
		return arrW;
	}
	
	
	// кликнули куда-то в сцену
	clickScene(event)
	{ 
		if(camOrbit.activeCam != camOrbit.cam2D) return;
		if(this.actTool) return;
		
		this.activePoint({obj: null});
		this.deActivePoint({arr: this.getActLevelArrPoint()});
		
		let rayhit = null;		
		
		if(1 == 1)
		{ 
			let ray = this.rayIntersect( event, this.getActLevelArrPoint(), 'arr' );
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
			this.level[this.actLevelId].pps.push(obj);
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


		//------
		let arrPW = [];
		let arr = this.getActLevelArrPoint();
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i] == obj) { continue; }
			
			let joinP = arr[i].userData.point.joinP;
			
			for ( let i2 = 0; i2 < joinP.length; i2++ )
			{
				if(joinP[i2] == obj) continue;
				
				let add = true;
				// проверка на совпадение, если есть то не добавляем в массив
				for ( let i3 = 0; i3 < arrPW.length; i3++ )
				{
					let exsist1 = false;
					let exsist2 = false;
					
					if(arrPW[i3][0] == arr[i] || arrPW[i3][1] == arr[i]){ exsist1 = true; }
					if(arrPW[i3][0] == joinP[i2] || arrPW[i3][1] == joinP[i2]){ exsist2 = true; }
					
					if(exsist1 && exsist2) { add = false; break; }
				}
				
				if(add) arrPW.push( [arr[i], joinP[i2]] );
			}
		}
		
		//------
		
			
		obj.userData.point.click.offset = new THREE.Vector3().subVectors( obj.position, rayPos );
		
		this.planeMath.position.set( 0, obj.position.y, 0 );
		this.planeMath.rotation.set(-Math.PI/2, 0, 0);	
		this.planeMath.updateMatrixWorld();
		
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
				
				this.lineAxis({hide: true});
				
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
				
				this.finishSelectPoint({obj: obj});
				
				detectRoomZone({type: 'changeFormFloor', point: obj});
				
				this.lineAxis({hide: true});
				camOrbit.stopMove = false;
			}
			
			obj.userData.active = true;
			this.activePoint({obj: obj});		
		}
		
		container.onmousemove =(e)=> { this.pointMove({ event: e, obj: obj, arrPW: arrPW }); }


		
		//render();
	}

	
	pointMove(params)
	{	
		let event = params.event;
		let obj = params.obj;
		let arrPW = params.arrPW;
		
		let intersects = this.rayIntersect( event, this.planeMath, 'one' ); 
		
		if(intersects.length == 0) return;
		
		obj.userData.point.click.offset.y = 0;
		let pos = new THREE.Vector3().addVectors( intersects[ 0 ].point, obj.userData.point.click.offset );				
		
		obj.position.copy( pos );
		
		
		this.lineAxis({hide: true});
		let newPos = this.nearPoint({obj: obj});
		
		if(!newPos) { newPos = this.crossPointOnWall({obj: obj, arrPW: arrPW}); }
		
		if(!newPos) { newPos = this.lineAxis({obj: obj}); }
		
		if(newPos) { obj.position.copy( newPos ); }
		
		this.updateWall({obj: obj});
		
		render();
	}

	
	nearPoint(params)
	{
		let obj = params.obj;
		
		let newPos = null;
		let pos = obj.position.clone(); 
		let arr = this.getActLevelArrPoint();
		
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i] == obj) { continue; }		 
			//if(Math.abs(arr[i].position.y - obj.position.y) > 0.01) { continue; }
			
			if(pos.distanceTo( arr[i].position ) > 0.2 / camOrbit.cam2D.zoom)  { continue; }
			
			newPos = arr[i].position.clone();			
			break;
		}

		return newPos;
	}


	crossPointOnWall(params)
	{
		let obj = params.obj;
		
		let newPos = null;		
		let pos = obj.position.clone();
		let arrPW = params.arrPW;

		
		for ( let i = 0; i < arrPW.length; i++ )
		{
			let p1 = arrPW[i][0].position;
			let p2 = arrPW[i][1].position;
			
			let pos2 = custMath.spPoint(p1, p2, pos);
			let cross = custMath.calScal(p1, p2, pos2);

			if(cross)
			{	
				if(new THREE.Vector2(pos.x, pos.z).distanceTo( new THREE.Vector2(pos2.x, pos2.z) ) > 0.2 / camOrbit.cam2D.zoom) { continue; }
				
				let geometry = new THREE.BufferGeometry().setFromPoints( [pos, new THREE.Vector3(pos2.x, pos.y, pos2.z)] );
				
				this.line.test.geometry.dispose();		
				this.line.test.geometry = geometry;
				
				newPos = pos2;
				newPos.y = pos.y;
				
				break;
			}			
		}		
		
		return newPos;
	}
	

	// направляющие X/Z к точекам
	lineAxis(params)
	{ 
		
		if(params.hide)
		{
			this.line.axis.horiz.visible = false;
			this.line.axis.vert.visible = false;
				
			return;
		}
		
		let obj = params.obj;
		
		let newPos = null;
		let pos = obj.position.clone(); 
		let arr = this.getActLevelArrPoint();
		
		let posAxis = {horiz: null, vert: null};
		
		for ( let i = 0; i < arr.length; i++ )
		{
			if(arr[i] == obj) { continue; }		 
			
			let pHoriz = custMath.spPoint(arr[i].position, new THREE.Vector3(1000,0,arr[i].position.z), pos);
			let pVert = custMath.spPoint(arr[i].position, new THREE.Vector3(arr[i].position.x,0,1000), pos);
			
			let horiz = Math.abs( pos.z - pHoriz.z );
			let vert = Math.abs( pos.x - pVert.x );
			
			if(horiz < 0.06 / camOrbit.cam2D.zoom) { posAxis.horiz = pHoriz; }
			if(vert < 0.06 / camOrbit.cam2D.zoom) { posAxis.vert = pVert; }	
			
			
			if(posAxis.horiz && posAxis.vert) { break; }			
		}
		
		
		if(posAxis.horiz || posAxis.vert) { newPos = pos.clone(); }
		
		
		if(posAxis.horiz)
		{
			let line = this.line.axis.horiz;
			let p1 = new THREE.Vector3(-1000, 0, posAxis.horiz.z);
			let p2 = new THREE.Vector3(1000, 0, posAxis.horiz.z);
			
			let geometry = new THREE.BufferGeometry().setFromPoints( [p1, p2] );
			
			line.geometry.dispose();		
			line.geometry = geometry;
			line.visible = true;
			
			newPos.z = posAxis.horiz.z;
		}
		
		if(posAxis.vert)
		{
			let line = this.line.axis.vert;
			let p1 = new THREE.Vector3(posAxis.vert.x, 0, -1000);
			let p2 = new THREE.Vector3(posAxis.vert.x, 0, 1000);
			
			let geometry = new THREE.BufferGeometry().setFromPoints( [p1, p2] );
			
			line.geometry.dispose();		
			line.geometry = geometry;
			line.visible = true;
			
			newPos.x = posAxis.vert.x;
		}


		return newPos;
	}
	

	// закончили действия с Tool Point
	finishToolPoint(params)
	{
		let obj = params.obj;
		
		let o = this.rayFromPointToObj({obj: obj, arr: this.getActLevelArrPoint()});  
		
		// точка состыковалась с точкой
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
				
				this.deleteValueFromArrya({arr: this.getActLevelArrPoint(), obj: obj});
				scene.remove( obj );

				if(1 == 1)
				{
					p[0].userData.point.joinP.push(o);
					o.userData.point.joinP.push(p[0]);

					this.crWall({p1: p[0], p2: o});			
				}							
			}			
		}
		
		let w = {divide: false};
		
		if(!o)
		{			
			w = this.divideWall({obj: obj, tool: true});
		}
		
		if(!o && !w.divide)
		{
			this.level[this.actLevelId].pps.push(obj);
			this.crPoint({pos: obj.position.clone(), cursor: true, tool: true, joinP: [obj]});							
		}
		
		if(o || w.divide)
		{ 
			if(o) { detectRoomZone({type: 'addCheckFloor', point: o}); }
			else if(w.divide) { for( let i = 0; i < w.p.length; i++ ){ detectRoomZone({type: 'addCheckFloor', point: w.p[i]}); } }
		}
	}
	
	
	// закончили действия с перетаскиваемой Point
	finishSelectPoint(params)
	{
		let obj = params.obj;
		
		let o = this.rayFromPointToObj({obj: obj, arr: this.getActLevelArrPoint()});  
		let w2 = {divide: false};
		
		// точка состыковалась с точкой
		if(o)
		{
			detectRoomZone({type: 'deleteFloors', point: obj});
			let p = obj.userData.point.joinP;
			let w = obj.userData.point.joinW;
			
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
			
			this.deleteValueFromArrya({arr: this.getActLevelArrPoint(), obj: obj});
			scene.remove( obj );

			for( let i = 0; i < p.length; i++ )
			{
				if(p[i] == o) continue;
				
				let exsist = p[i].userData.point.joinP.find(point => point == o);
				
				if(!exsist)
				{
					p[i].userData.point.joinP.push(o);
					o.userData.point.joinP.push(p[i]);

					this.crWall({p1: p[i], p2: o});								
				}
			}

			if(o.userData.point.joinP.length == 0)
			{				
				this.deletePoint({obj: o});
			}				
		}
		else
		{
			w2 = this.divideWall({obj: obj});
		}
		
		if(o || w2.divide)
		{
			if(o) { detectRoomZone({type: 'addCheckFloor', point: o}); }
			else if(w2.divide) { for( let i = 0; i < w2.p.length; i++ ){ detectRoomZone({type: 'addCheckFloor', point: w2.p[i]}); } }
		}
	}	
	
	// пускаем луч из точки на что-то в сцене
	rayFromPointToObj(params) 
	{
		let obj = params.obj;
		let arr = params.arr;
		
		obj.updateMatrixWorld();
		obj.geometry.computeBoundingSphere();
		
		let pos = obj.localToWorld( obj.geometry.boundingSphere.center.clone() );
		pos.y += 10;
		
		let arr2 = []
		for( let i = 0; i < arr.length; i++ )
		{
			if(arr[i] != obj) arr2.push(arr[i]);
		}		
		
		let ray = new THREE.Raycaster();
		ray.set( pos, new THREE.Vector3(0, -1, 0) );
		
		let intersects = ray.intersectObjects( arr2, true );	
		
		let o = null;
		if(intersects.length > 0) { o = intersects[0].object; }			
		
		return o;
	}	
	
	
	crWall(params)
	{
		let id = params.id;		
		
		let p1 = params.p1;
		let p2 = params.p2;
			
		
		let obj = new THREE.Mesh( new THREE.BufferGeometry(), this.m_w_default );	

		if(id == undefined) { id = this.countId.w; this.countId.w++; }	
		obj.userData.id = id;
		obj.userData.tag = 'wall';		
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
		geometry.translate(0, p1.position.y, 0);

		return geometry;
	}
	
	
	// если точка пересеклась со стеной, то делим стену
	divideWall(params)
	{
		let obj = params.obj;
		let tool = params.tool;
		
		let arr = [];		
		let arrW = this.getActLevelArrWall();
		let jW = obj.userData.point.joinW;

		for ( let i = 0; i < arrW.length; i++ )
		{
			let add = true;
			
			for ( let i2 = 0; i2 < jW.length; i2++ )
			{
				if(arrW[i] == jW[i2]) { add = false; continue; }					
			}				
			
			if(add) arr.push(arrW[i]);
		}
		

		let wall = this.rayFromPointToObj({obj: obj, arr: arr});
		let result = {divide: false, p: []};
		
		if(wall)
		{
			let count = jW.length;
			
			let p = wall.userData.w.joinP;
			
			result.divide = true;
			result.p = p;
			
			this.deleteValueFromArrya({arr: p[0].userData.point.joinP, obj: p[1]});
			this.deleteValueFromArrya({arr: p[1].userData.point.joinP, obj: p[0]});
			
			this.deleteValueFromArrya({arr: p[0].userData.point.joinW, obj: wall});
			this.deleteValueFromArrya({arr: p[1].userData.point.joinW, obj: wall});
			
			wall.geometry.dispose();
			scene.remove( wall );

			for ( let i = 0; i < p.length; i++ )
			{
				detectRoomZone({type: 'deleteFloors', point: p[i]});
			}
			

			for ( let i = 0; i < p.length; i++ )
			{ 
				obj.userData.point.joinP.push(p[i]);
				p[i].userData.point.joinP.push(obj);

				this.crWall({p1: obj, p2: p[i]});
			}

			if(tool) { this.level[this.actLevelId].pps.push(obj); }
			
			if(count == 0 && tool)
			{ 
				this.crPoint({pos: obj.position.clone(), cursor: true, tool: true, joinP: [obj]});
			}
			else 
			{ 
				camOrbit.stopMove = false;
			}				
		}

		return result;
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
			let arr = this.getActLevelArrPoint();
			
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
	
	
	deletePoint(params = {})
	{
		let active = params.active;
		let obj = params.obj;
		let reset = (params.reset) ? true : false;
		
		if(active)
		{
			let arr = this.getActLevelArrPoint();
			
			for( let i = 0; i < arr.length; i++ )
			{
				if(arr[i].userData.active) { obj = arr[i]; break; }
			}		
		}
		
		if(!obj) return;
				
		
		let p = obj.userData.point.joinP;
		let w = obj.userData.point.joinW;
						
		
		if(p.length > 2 && !reset) return;
		
		detectRoomZone({type: 'deleteFloors', point: obj});
		
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
			
			this.deleteValueFromArrya({arr: this.getActLevelArrPoint(), obj: arr[i]});
			scene.remove( arr[i] );
		}			
		
		if(!reset)
		{
			for( let i = 0; i < p.length; i++ ){ detectRoomZone({type: 'addCheckFloor', point: p[i]}); }
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
		let n = this.level.length;
		
		for( let i = n - 1; i >= 0; i-- )
		{
			this.settingLevel({type: 'delete', reset: true});		
		}				
	
		this.countId.p = 0;
		this.countId.w = 0;
		
		this.actLevelId = -1;		
		this.settingLevel({type: 'add'});

		this.actTool = false;
		
		console.log(this.level);		
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
		let json = {};
		json.level = [];
		
		for( let i = 0; i < this.level.length; i++ )
		{
			let f = this.level[i];
			
			json.level[i] = {};
			json.level[i].point = [];
			
			for( let i2 = 0; i2 < f.pps.length; i2++ )
			{ 
				json.level[i].point[i2] = {};
				json.level[i].point[i2].id = f.pps[i2].userData.id;
				json.level[i].point[i2].pos = f.pps[i2].position;
				
				json.level[i].point[i2].joinP = f.pps[i2].userData.point.joinP.map(o => o.userData.id);		
			}			
		}
		
		return json;
	}

	
	
	async loadFile(params)
	{
		let file = params.file;
		
		if(params.test)
		{
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
		let maxId = -1;
		
		for( let i = 0; i < json.level.length; i++ )
		{
			let f = json.level[i];
			
			if(i > 0) 
			{ 
				this.settingLevel({type: 'add'});
			}
			
			for( let i2 = 0; i2 < f.point.length; i2++ )
			{
				let point = f.point[i2];			
				
				let pos = new THREE.Vector3(point.pos.x, point.pos.y, point.pos.z);
				
				let joinP = point.joinP.map(id => { return this.findObj({arr: this.getActLevelArrPoint(), id: id}); })			
				
				let o = this.crPoint({id: point.id, pos: pos, joinP: joinP});

				if(maxId < point.id) { maxId = point.id; }
			}			
		}
		
		
		detectRoomZone({type: 'createFloors'});
		
		this.settingLevel({type: 'addItemLevel', id: 0});
		//let arrId = json.point.map(o => o.id);
		//let maxId = Math.max(...arrId);
		
		this.countId.p = maxId + 1; 
		console.log(this.countId.p);
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


let listActFucn =
{
	addLevel() 
	{
		pointClass_1.settingLevel({type: 'add'});
	},
	
	deleteLevel()
	{
		pointClass_1.settingLevel({type: 'delete'});		
	}	
}



function funcToFucn(name, params) 
{
	if (typeof listActFucn[name] === 'function') { listActFucn[name](params); }
}



class Floor_1
{
	constructor(params)
	{
		this.params = params;	
		
		this.arr = {};		
	}
	
}


let arrFC = [];
// создаем пол 
function detectRoomZone(params = {})
{
	let type = params.type;
		
	
	if(type == 'createFloors') { createFloors(); }
	if(type == 'addCheckFloor') { addCheckFloor({point: params.point}); }
	if(type == 'changeFormFloor') { changeFormFloor({point: params.point}); }
	if(type == 'deleteFloors') { deleteFloors({point: params.point}); }
	
	

	
	function createFloors()
	{
		let level = pointClass_1.level;
		
		for( let i = 0; i < level.length; i++ )
		{
			for( let i2 = 0; i2 < level[i].pps.length; i2++ )
			{ 
				addCheckFloor({point: level[i].pps[i2]});
			}		
		}
	}	
	


	// ищем замкнутый контур
	function getContour(params)
	{
		let arr = params.arr;
		let pNew = params.point;
		
		let pPrev = arr[arr.length - 1];
		arr[arr.length] = pNew;
		
		let arrD = [];
		let dir1 = new THREE.Vector3().subVectors( pNew.position, pPrev.position ).normalize();	
		
		for( let i = 0; i < pNew.userData.point.joinP.length; i++ )
		{
			let pNext = pNew.userData.point.joinP[i];
			
			if(pNext == pPrev) continue;		
			if(pNext.userData.point.joinP.length < 2) continue;
			
			let dir2 = new THREE.Vector3().subVectors( pNext.position, pNew.position ).normalize();
			
			
			let d = (pNext.position.x - pPrev.position.x) * (pNew.position.z - pPrev.position.z) - (pNext.position.z - pPrev.position.z) * (pNew.position.x - pPrev.position.x);
			
			let angle = dir1.angleTo( dir2 );
			
			if(d > 0){ angle *= -1; }
			//console.log(THREE.MathUtils.radToDeg(angle));
			arrD[arrD.length] = { point: pNext, angle: angle};
			
			if(!custMath.isNumeric(angle)) { return arr; }
		}	
		
		
		if(arrD.length > 0)
		{ 
			arrD.sort(function (a, b) { return a.angle - b.angle; });
			
			if(arr[0] != arrD[0].point) 
			{ 
				arr = getContour({arr: arr, point: arrD[0].point}); 
			}
			else 
			{ 
				arr[arr.length] = arrD[0].point; 
			}						
		}
		else
		{
			arr = [];
		}
		
		return arr;
	}


	//площадь многоугольника (нужно чтобы понять положительное значение или отрецательное, для того чтобы понять напрвление по часовой или проитв часовой)
	function checkClockWise( arrP )
	{  
		let res = 0;
		let n = arrP.length;
		let p1, p2, p3;
		
		for (i = 0; i < n; i++) 
		{
			p1 = arrP[i].position;
			
			if (i == 0)
			{
				p2 = arrP[n-1].position;
				p3 = arrP[i+1].position;					
			}
			else if (i == n-1)
			{
				p2 = arrP[i-1].position;
				p3 = arrP[0].position;			
			}
			else
			{
				p2 = arrP[i-1].position;
				p3 = arrP[i+1].position;			
			}
			
			res += p1.x * (p2.z - p3.z);
		}
		
		
		res = res / 2;
		res = Math.round(res * 10) / 10;
		
		return res;
	}


	// проверяем если зона с такими же точками
	function detectSameZone(params)
	{
		let arrP = params.arrP;
		let arrFC = params.arrFC;
		let exsist = false;

				
		for( let i = 0; i < arrFC.length; i++ )
		{
			let arr = arrFC[i].userData.floor.arrP;
			
			if(arr.length !== arrP.length) continue;
			
			let count = 0;
			
			for( let i2 = 0; i2 < arr.length - 1; i2++ )
			{
				for( let i3 = 0; i3 < arrP.length - 1; i3++ )
				{
					if(arr[i2] == arrP[i3])
					{
						count++;
						break;
					}
				}			
			}
						
			if(count == arrP.length - 1) 
			{  
				exsist = true; 
				break; 
			}
		}
		
		return exsist;
	}
	


	function addCheckFloor(params)
	{
		let p1 = params.point;

		let joinP = p1.userData.point.joinP;
		
		for( let i2 = 0; i2 < joinP.length; i2++ )
		{
			let p2 = joinP[i2];
			
			if(p2.userData.point.joinP.length < 2) continue;
			
			let arr = getContour({arr: [p1], point: p2});

			if(arr.length == 0) continue;
			if(arr[0] != arr[arr.length - 1]) continue;	
			if(checkClockWise( arr ) <= 0) continue;
			if(detectSameZone({arrP: arr, arrFC: arrFC})) continue;
			
			let obj = crFloor({arrP: arr});
			
			arrFC.push(obj);
			
			let arrP2_id = arr.map(o => o.userData.id);
			console.log(arrP2_id);
		}
		
	}



	function crFloor(params)
	{
		let id = params.id;					
		
		let color = new THREE.Color( 0xffffff ).setHex( Math.random() * 0xffffff );
		
		let obj = new THREE.Mesh( new THREE.BufferGeometry(), new THREE.MeshPhongMaterial({color: color, wireframe: false}) );	

		//if(id == undefined) { id = this.countId.w; this.countId.w++; }	
		//obj.userData.id = id;
		obj.userData.tag = 'floor';	
		obj.userData.floor = {};		
		obj.userData.floor.arrP = params.arrP;				
		//obj.userData.active = false;		

		updateGeomFloor({obj: obj});
		
		if(params.arrP[0]) obj.position.y = params.arrP[0].position.y;
		
		scene.add( obj );		
		
		render();
		
		return obj;
	}
	
	
	function updateGeomFloor(params)
	{
		let obj = params.obj;
		obj.geometry.dispose();
		
		let arrP = obj.userData.floor.arrP;
		let arr = [];
		
		for( let i = 0; i < arrP.length - 1; i++ ) 
		{  
			arr[i] = new THREE.Vector2( arrP[i].position.x, arrP[i].position.z );		
		}	
		
		let shape = new THREE.Shape( arr );
		let geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 0.05 } );
		geometry.rotateX(Math.PI/2);
		
		obj.geometry = geometry;
	}



	function changeFormFloor(params)
	{
		let point = params.point;
		
		let arr = findFloors({point: point});
		
		for( let i = 0; i < arr.length; i++ )
		{
			updateGeomFloor({obj: arr[i]});
		}
		
		render();
	}
	

	function findFloors(params)
	{
		let point = params.point;
		
		let arr = [];
		
		for( let i = 0; i < arrFC.length; i++ )
		{
			let arrP = arrFC[i].userData.floor.arrP;
			
			let ind = arrP.findIndex(o => o == point);
			
			if(ind > -1)
			{
				arr.push(arrFC[i]);
				
				let arrP2_id = arrP.map(o => o.userData.id);
				console.log(arrP2_id);				
			}
		}
		
		return arr;
	}	
	

	function deleteFloors(params)
	{ 
		let point = params.point;
		
		let arr = findFloors({point: point});
		
		for( let i = 0; i < arr.length; i++ )
		{
			arr[i].geometry.dispose();
			scene.remove( arr[i] );	
			
			pointClass_1.deleteValueFromArrya({arr: arrFC, obj: arr[i]});
		}
		
		console.log('arrFC', arrFC.length);
	}
	
	
}



























