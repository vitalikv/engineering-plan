


async function loadF(params)
{
	
	if(params.test)
	{
		// сохраняем в папку
		let url = infProg.path + params.url;			
		
		let response = await fetch(url, 
		{
			method: 'GET',
			headers: 
			{	
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
			},				
		});
		
		let inf = await response.json();

		console.log(inf);
		
		if(inf.point && params.pointClass_1) { pointClass_1.loadPoint({data: inf.point}); }
		//if(inf.point && pointClass_2) { pointClass_2.loadPoint({data: inf.point}); }
		
		return true;
	}		

}


