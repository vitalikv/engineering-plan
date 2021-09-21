

class wallCCC
{
	constructor(params)
	{
		this.params = params;	
	}
	
	initTestWall()
	{
		let meshA = this.testWall();
		let meshB = this.testBox();
		
		render();
		
		this.recompute({meshA: meshA, meshB: meshB});
	}
	
	testWall(params)
	{	
		let arr = [];
		
		arr[arr.length] = new THREE.Vector2 ( -2, 0.2 );
		arr[arr.length] = new THREE.Vector2 ( -2, 0 );
		arr[arr.length] = new THREE.Vector2 ( -2, -0.2 );
		arr[arr.length] = new THREE.Vector2 ( 2, -0.2 );
		arr[arr.length] = new THREE.Vector2 ( 2, 0 );
		arr[arr.length] = new THREE.Vector2 ( 2, 0.2 );
			
		
		let shape = new THREE.Shape( arr );
		let geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 3 } );
		geometry.rotateX(-Math.PI/2);
		
		let material = new THREE.MeshPhongMaterial( {color: 0x00ff00, wireframe: false} );
		
		let obj = new THREE.Mesh( geometry, material );	
		
		scene.add( obj );
		
		return obj;
	}

	testBox(params)
	{	
		let arr = [];
		
		arr[arr.length] = new THREE.Vector2 ( -0.5, 0.5 );
		arr[arr.length] = new THREE.Vector2 ( -0.5, 0 );
		arr[arr.length] = new THREE.Vector2 ( -0.5, -0.5 );
		arr[arr.length] = new THREE.Vector2 ( 0.5, -0.5 );
		arr[arr.length] = new THREE.Vector2 ( 0.5, 0 );
		arr[arr.length] = new THREE.Vector2 ( 0.5, 0.5 );
			
		console.log(new THREE.BufferGeometry());
		let shape = new THREE.Shape( arr );
		let geometry = new THREE.ExtrudeGeometry( shape, { bevelEnabled: false, depth: 1 } );
		geometry.rotateX(-Math.PI/2);
		
		let material = new THREE.MeshPhongMaterial( {color: 0x0000ff, wireframe: false} );
		
		let obj = new THREE.Mesh( geometry, material );	
		
		scene.add( obj );
		
		return obj;
	}
	
	recompute(params)
	{
		let meshA = params.meshA;	
		let meshB = params.meshB;
		
		meshA.updateMatrix();
		meshB.updateMatrix();

		let meshResult = this.doCSG(meshA, meshB, 'subtract', meshA.material);
		//results.push(doCSG(box,sphere,'intersect',intersectMaterial))
		//results.push(doCSG(box,sphere,'union',unionMaterial))	
		scene.add(meshResult);

		meshA.parent.remove(meshA);
		meshA.geometry.dispose();		

		meshB.parent.remove(meshB);
		meshB.geometry.dispose();

		render();
	}


	doCSG(a,b,op,mat)
	{
		let bspA = CSG.fromMesh( a );
		let bspB = CSG.fromMesh( b );
		let bspC = bspA[op]( bspB );
		let result = CSG.toMesh( bspC, a.matrix );
		result.material = mat;
		
		return result;
	}
	
}













