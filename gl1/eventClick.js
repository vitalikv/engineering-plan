


function initEvent()
{
	window.addEventListener( 'resize', onWindowResize, false );
	
	infProg.el.canv.addEventListener( 'contextmenu', function(event) { event.preventDefault() } );
	infProg.el.canv.addEventListener( 'mousedown', onDocumentMouseDown, false );
	infProg.el.canv.addEventListener( 'mousemove', onDocumentMouseMove, false );
	infProg.el.canv.addEventListener( 'mouseup', onDocumentMouseUp, false );	
	
	infProg.el.canv.addEventListener( 'touchstart', onDocumentMouseDown, false );
	infProg.el.canv.addEventListener( 'touchmove', onDocumentMouseMove, false );
	infProg.el.canv.addEventListener( 'touchend', onDocumentMouseUp, false );

	infProg.el.canv.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
	infProg.el.canv.addEventListener('mousewheel', onDocumentMouseWheel, false);		
}


function actButton()
{	
	let elem2D = document.querySelector('[nameId="cam2D"]');		
	elem2D.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem2D.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem2D.addEventListener('mouseup', function(e) { e.stopPropagation(); });			
	elem2D.onmousedown = function(){ clickButton({elem: this}); }
	infProg.el.butt.cam2D = elem2D;
	
	let elem3D = document.querySelector('[nameId="cam3D"]');		
	elem3D.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem3D.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem3D.addEventListener('mouseup', function(e) { e.stopPropagation(); });			
	elem3D.onmousedown = function(){ clickButton({elem: this}); }
	infProg.el.butt.cam3D = elem3D;
	
	
	document.addEventListener("keydown", function (e) 
	{ 
		infProg.keys[e.keyCode] = true;
	});

	document.addEventListener("keyup", function (e) 
	{ 
		infProg.keys[e.keyCode] = false;		
	});

	
	let elPoint = document.querySelector('[nameId="point"]');
	elPoint.onmousedown = function(){ crPoint({pos: new THREE.Vector3(0, 1, 2)}); }
}




