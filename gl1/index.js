

let renderer;
let scene, camera2D, camera3D;


let infProg = {};

infProg.el = {};
infProg.el.canv = null;
infProg.el.butt = {};
infProg.el.butt.cam2D = null;
infProg.el.butt.cam3D = null;

infProg.keys = [];

infProg.scene = {};
infProg.scene.camera = null;
infProg.scene.planeMath = null;

infProg.mouse = {};
infProg.mouse.click = {};
infProg.mouse.click.type = '';
infProg.mouse.pos = new THREE.Vector2();




function render() 
{
	renderer.render( scene, infProg.scene.camera );
}


function onWindowResize() 
{
	let aspect = container.clientWidth / container.clientHeight;
	let d = 5;
	
	camera2D.left = -d * aspect;
	camera2D.right = d * aspect;
	camera2D.top = d;
	camera2D.bottom = -d;
	camera2D.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();
	
	renderer.setSize( container.clientWidth, container.clientHeight );
	
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}


init();

function init() 
{
	container = document.querySelector('[nameId="containerScene"]');	
	infProg.el.canv = container;
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xffffff );
	


	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.clientWidth, container.clientHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	renderer.domElement.style.outline = 'none';		
	container.appendChild( renderer.domElement );

	
	let aspect = container.clientWidth / container.clientHeight;
	let d = 5;
	
	//----------- camera2D
	camera2D = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
	camera2D.position.set(0, 10, 0);
	camera2D.lookAt(scene.position);
	camera2D.zoom = 1;
	camera2D.updateMatrixWorld();
	camera2D.updateProjectionMatrix();
	camera2D.userData.camera = { save: { pos: camera2D.position.clone(), zoom: camera2D.zoom } };
	//----------- camera2D


	//----------- camera3D
	camera3D = new THREE.PerspectiveCamera( 65, container.clientWidth / container.clientHeight, 0.01, 1000 );  
	camera3D.rotation.order = 'YZX';		//'ZYX'
	camera3D.position.set(5, 7, 5);	
	camera3D.lookAt( new THREE.Vector3() );
	
	camera3D.userData.camera = {};
	camera3D.userData.camera.save = {};
	camera3D.userData.camera.save.pos = new THREE.Vector3();
	camera3D.userData.camera.save.radius = 0;
	
	camera3D.userData.camera.movePos = null;

	camera3D.userData.camera.d3 = { theta: 0, phi: 75 };
	camera3D.userData.camera.d3.targetO = createCenterCamObj();	
	camera3D.userData.camera.type = 'fly';
	camera3D.userData.camera.click = {};
	camera3D.userData.camera.click.pos = new THREE.Vector3();	
	//----------- camera3D	
	
	
	infProg.scene.camera = camera3D;
	
	infProg.scene.planeMath = createPlaneMath();
	scene.add( new THREE.GridHelper( 10, 10 ) );
	//scene.add( new THREE.AxesHelper( 10000 ) );
	
	startPosCamera3D({radious: 10, theta: 90, phi: 35});
	
	initEvent();
	actButton();
	
	render();	
}










