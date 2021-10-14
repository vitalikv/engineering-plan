

let renderer;
let scene, camera2D, camera3D;


let infProg = {};

infProg.path = '';

infProg.el = {};
infProg.el.canv = null;
infProg.el.butt = {};
infProg.el.butt.cam2D = null;
infProg.el.butt.cam3D = null;

infProg.keys = [];

infProg.scene = {};
infProg.scene.camera = null;
infProg.scene.planeMath = null;




infProg.settings = {};
infProg.settings.id = 0;



function render() 
{
	renderer.render( scene, infProg.scene.camera );
}






let camOrbit;
let custMath;
let pointClass_1, pointClass_2;



function init() 
{
	container = document.querySelector('[nameId="containerScene"]');	
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );	


	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight, false );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	renderer.domElement.style.outline = 'none';		
	container.appendChild( renderer.domElement );

	infProg.el.canv = renderer.domElement;
	
	

	scene.add( new THREE.GridHelper( 10, 10 ) );
	//scene.add( new THREE.AxesHelper( 10000 ) );
	
	infProg.el.canv.addEventListener( 'contextmenu', function(event) { event.preventDefault() } );
	
	
	camOrbit = new CameraOrbit({container: infProg.el.canv, renderer: renderer, scene: scene, setCam: '2D'});
	
	actButton();	
	
	pointClass_1 = new Point_1({container: infProg.el.canv, renderer: renderer, scene: scene});
	pointClass_2 = new Point_2({container: infProg.el.canv, renderer: renderer, scene: scene});
	
	custMath = new CustMath({});
	
	initLight();
	
	//let tt = new wallCCC({});
	//tt.initTestWall();	
	
	testWallCross();
	render();	
}



function initLight()
{
	scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) ); 

	let lights = [];
	lights[ 0 ] = new THREE.PointLight( 0x222222, 0.7, 0 );
	lights[ 1 ] = new THREE.PointLight( 0x222222, 0.5, 0 );
	lights[ 2 ] = new THREE.PointLight( 0x222222, 0.8, 0 );
	lights[ 3 ] = new THREE.PointLight( 0x222222, 0.2, 0 );

	lights[ 0 ].position.set( -1000, 200, 1000 );
	lights[ 1 ].position.set( -1000, 200, -1000 );
	lights[ 2 ].position.set( 1000, 200, -1000 );
	lights[ 3 ].position.set( 1000, 200, 1000 );

	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );
	scene.add( lights[ 3 ] );	
}

function getConsoleRendererInfo()
{	
	//console.log(renderer.info.programs);
	//console.log(renderer.info.render);
	console.log(renderer.info.memory);	
}

document.addEventListener("DOMContentLoaded", init);








function testWallCross()
{
	let arrP_1 = [new THREE.Vector3(-1.2, 0, 0.3), new THREE.Vector3(1.2, 0, -0.7)];
	
	{		
		let geometry = new THREE.BufferGeometry().setFromPoints( arrP_1 );		
		let line = new THREE.Line( geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }) );
		scene.add( line );		
	}

	let arrP_2 = [new THREE.Vector3(-0.6, 0, 1.1), new THREE.Vector3(0.6, 0, 2.6)];
	
	{		
		let geometry = new THREE.BufferGeometry().setFromPoints( arrP_2 );		
		let line = new THREE.Line( geometry, new THREE.LineBasicMaterial({ color: 0x0000ff }) );
		scene.add( line );			
	}
	
	let point = custMath.spPoint(arrP_1[0], arrP_1[1], arrP_2[0]);
	let cross = custMath.calScal(arrP_1[0], arrP_1[1], point);
	
	if(cross)
	{		
		let geometry = new THREE.BufferGeometry().setFromPoints( [point, arrP_2[0]] );		
		let line = new THREE.Line( geometry, new THREE.LineBasicMaterial({ color: 0xff0000 }) );
		scene.add( line );
		
		
		console.log(point);
	}	
	
		
	
	render();
}





