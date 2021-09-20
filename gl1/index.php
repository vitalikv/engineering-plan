<!DOCTYPE html>
<html lang="en">

<head>
	<title>loader</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">	
	<link type="text/css" rel="stylesheet" href="css/style.css">
</head>



<body>		
	
		
	<div style="display: flex; flex-direction: column; position: absolute; width: 100%; height: 100%; font-family: Arial, Helvetica, sans-serif;">

		<div nameId="panelT" style="width: 100%; height: 40px; background: #F0F0F0; border-bottom: 1px solid #D1D1D1;">
		</div>
		
		
		<div class="flex_1" style="height: 100%;">
			<div style="display: flex; flex-direction: column; width: 100%; height: 100%;">
				<div class="flex_1" style="position: relative; height: 0; top: 0; left: 0; right: 0;">
					<div class="button1 gradient_1" nameId="sv">save</div>
					<div class="button1 gradient_1" nameId="ld">load</div>
					
					<div nameId="blockButton_1">
						
					</div>
					
					<div class="flex_1" style="margin: 10px 10px auto auto;">
						<div class="button1 gradient_1" nameId="cam2D">2D</div>
						<div class="button1 gradient_1" style="display: none;" nameId="cam3D">3D</div>
					</div>
				</div>			
			
				<div nameId="containerScene" style="width: 100%; height: 100%; touch-action: none;"></div>				
			</div>
			
			<div nameId="panelR" style="position: relative; flex-basis: 310px; background: #F0F0F0; border-left: 1px solid #D1D1D1;">
			</div>
		</div>
	</div>
		
</body>

<script src="js/three.min.js"></script>


<script src="mathO.js"></script>
<script src="camera.js"></script>
<script src="saveLoad/load.js"></script>
<script src="saveLoad/save.js"></script>
<script src="eventClick.js"></script>
<script src="point.js"></script>
<script src="point_1.js"></script>
<script src="testWall.js"></script>
<script src="index.js"></script>

</html>