


async function saveF(params)
{
	let json = {};
	json.point = [];
	
	if(pointClass_1) { json.point = pointClass_1.savePoint(); }
	//if(pointClass_2) { json.point = pointClass_2.savePoint(); }	
	
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


