





function testWall(params)
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
	
	testBox();
	
	render();
}




function testBox(params)
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
	
	render();
}





