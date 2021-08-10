

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

infProg.scene.construction = {};
infProg.scene.construction.wall = [];
infProg.scene.construction.point = [];

infProg.prefab = {};
infProg.prefab.geom = {};
infProg.prefab.mat = {};
infProg.prefab.geom.p1 = crCylinderGeom();
infProg.prefab.mat.p1 = new THREE.MeshPhongMaterial( {color: 0xcccccc, wireframe: false} );	

infProg.act = {};
infProg.act.selectO = null;
infProg.act.rayhit = null;
infProg.act.stopCam = false;

infProg.mouse = {};
infProg.mouse.click = {};
infProg.mouse.click.type = '';
infProg.mouse.click.down = false;
infProg.mouse.click.move = false;
infProg.mouse.pos = new THREE.Vector2();

infProg.settings = {};
infProg.settings.id = 0;



function render() 
{
	renderer.render( scene, infProg.scene.camera );
}


function onWindowResize() 
{
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (!needResize) { return; }
	
	renderer.setSize(width, height, false);
	
	let aspect = width / height;
	let d = 5;
	
	camera2D.left = -d * aspect;
	camera2D.right = d * aspect;
	camera2D.top = d;
	camera2D.bottom = -d;
	camera2D.updateProjectionMatrix();

	 
	camera3D.aspect = aspect;
	camera3D.updateProjectionMatrix();	
	
	renderer.domElement.style.width = '100%';
	renderer.domElement.style.height = '100%';
	
	render();

}





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
	

	
	infProg.scene.planeMath = createPlaneMath();
	scene.add( new THREE.GridHelper( 10, 10 ) );
	//scene.add( new THREE.AxesHelper( 10000 ) );
	
	startPosCamera3D({radious: 10, theta: 90, phi: 35});
	
	initEvent();
	actButton();
	initLight();
	clickButton({elem: infProg.el.butt.cam2D});
	
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







