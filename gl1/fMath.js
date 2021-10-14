

class CustMath
{
	constructor(params)
	{
		this.params = params;	
	}		

	// проверка: число или нет
	isNumeric(n) 
	{   
	   return !isNaN(parseFloat(n)) && isFinite(n);   
	}

	// проекция точки(С) на прямую (A,B)
	spPoint(A, B, C)
	{
		let x1 = A.x;
		let y1 = A.z;
		let x2 = B.x;
		let y2 = B.z;
		let x3 = C.x;
		let y3 = C.z;
		
		let px = x2 - x1;
		let py = y2 - y1;
		let dAB = px * px + py * py;
		
		let u = ((x3 - x1) * px + (y3 - y1) * py) / dAB;
		let x = x1 + u * px, z = y1 + u * py;
		
		return new THREE.Vector3(x, 0, z); 
	}


	// опредяляем, надодится точка C за пределами отрезка АВ или нет 
	calScal(A, B, C)
	{	
		let AB_1 = { x : B.x - A.x, y : B.z - A.z };
		let CD_1 = { x : C.x - A.x, y : C.z - A.z };
		let r1 = AB_1.x * CD_1.x + AB_1.y * CD_1.y;				// скалярное произведение векторов

		let AB_2 = { x : A.x - B.x, y : A.z - B.z };
		let CD_2 = { x : C.x - B.x, y : C.z - B.z };
		let r2 = AB_2.x * CD_2.x + AB_2.y * CD_2.y;

		let cross = (r1 < 0 | r2 < 0) ? false : true;	// если true , то точка D находится на отрезке AB	
		
		return cross;
	} 	
	

	
}













