




function actButton()
{	
	let elem2D = document.querySelector('[nameId="cam2D"]');		
	elem2D.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem2D.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem2D.addEventListener('mouseup', function(e) { e.stopPropagation(); });			
	elem2D.onmousedown = function(){ changeCamera({elem: this}); }
	infProg.el.butt.cam2D = elem2D;
	
	let elem3D = document.querySelector('[nameId="cam3D"]');		
	elem3D.addEventListener('mousedown', function(e) { e.stopPropagation(); });
	elem3D.addEventListener('mousemove', function(e) { e.stopPropagation(); });
	elem3D.addEventListener('mouseup', function(e) { e.stopPropagation(); });			
	elem3D.onmousedown = function(){ changeCamera({elem: this}); }
	infProg.el.butt.cam3D = elem3D;
	
	
	document.addEventListener("keydown", function (e) 
	{ 
		infProg.keys[e.keyCode] = true;
	});

	document.addEventListener("keyup", function (e) 
	{ 
		infProg.keys[e.keyCode] = false;		
	});
	
	
	let elemSv = document.querySelector('[nameId="sv"]');				
	elemSv.onmousedown = function(){ saveF({test: true}); }	 	

	let elemLd = document.querySelector('[nameId="ld"]');				
	elemLd.onmousedown = function(){ loadF({test: true}); }	 
}




