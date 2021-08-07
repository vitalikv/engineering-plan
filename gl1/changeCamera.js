


function clickButton(params)
{
	let elem = params.elem;
	
	if(infProg.el.butt.cam2D == elem)
	{
		elem.style.display = 'none';
		infProg.el.butt.cam3D.style.display = '';
		changeCamera({camera: camera2D});
	}

	if(infProg.el.butt.cam3D == elem)
	{
		elem.style.display = 'none';
		infProg.el.butt.cam2D.style.display = '';
		changeCamera({camera: camera3D});
	}
}


// переключение камеры
function changeCamera(params)
{  
	let camera = params.camera;
		
	infProg.scene.camera = camera;	

	
	render();
}








