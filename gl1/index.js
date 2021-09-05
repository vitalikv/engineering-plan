

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






let camOrbit, pointClass;

init();

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
	
	pointClass = new Point({container: infProg.el.canv, renderer: renderer, scene: scene});
	
	initLight();
	
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







