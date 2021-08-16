


async function saveF(params)
{
	let json = {};
	json.point = [];
	
	let arr = infProg.scene.construction;
	
	if(arr.point.length > 0)
	{
		json.point = savePoint();
	}
	
	
	let data = JSON.stringify( json );
	
	if(params.test)
	{
		// сохраняем в папку
		let url = infProg.path+'saveLoad/savePhp.php';			
		
		let response = await fetch(url, 
		{
			method: 'POST',
			body: 'myarray='+encodeURIComponent(data),
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


