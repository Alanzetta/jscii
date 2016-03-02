var mod = angular.module('ascii',[]);


mod.controller('processor',function($scope){

	$scope.output = document.querySelector('#out');
	
	$scope.active ='static';
	
	
	$scope.process = function(file)
	{

	  var reader = new FileReader();

	  var img = document.querySelector('#original');

		
		
	  reader.onload=function(e){
		img.src = e.target.result;
	  };

	  img.onload = function()
	  {
	
		 
		$scope.hasLoaded= true;
		$scope.currentSize = 1;
	  
		  
		$scope.$apply();  

	  };
		
		img.onerror = function(){
			alert('Sorry but you cannot load images from that URL');
		};

	  reader.readAsDataURL(file);
	};
	
	$scope.loadFromURL = function(url){
		if(url && url.length)
		{
			var img = document.querySelector('#original');
			img.crossOrigin = "Anonymous";

			img.src=url;

			img.onload = function(){
				$scope.hasLoaded=true;
				$scope.currentSize = true;

				$scope.$apply();
			};
			
			img.onerror = function(e){
				alert('Sorry the server that hosts the image prohibits sharing it with us');
			}
			
		}
		else
		{
			alert('Please input a valid URL');
		}
	};
	
	
	$scope.resize = function(newSize){
		
		if(newSize != $scope.currentSize)
		{
			var img = document.querySelector('#original');
			
			var canvas = document.createElement('canvas');
			
			var src = img.src;
      
			var orgW = img.width;
			var orgH = img.height;

		 	var hW = Math.floor(orgW * newSize);
			var hH = Math.floor(orgH * newSize);

			canvas.width = hW;
			canvas.height= hH;

			var ctx = canvas.getContext('2d');

			ctx.drawImage(img,0,0,hW,hH);

			var png = /png/;
			
			var url;
			
			try{
				
				if(png.exec(src))
				{
					url = canvas.toDataURL('image/png');
				}
				else
				{
					url = canvas.toDataURL('image/jpeg');
				}

				if(url)
				{
					$scope.clear();
					$scope.currentSize = newSize;
					img.src = url;

				}
				else
				{
					alert('sorry image format not supported');
				}
			}
			catch(e)
			{
				alert('sorry image format not supported');
			}
		}
		else
		{
		}
	
	};
	
	$scope.render = function(opts){
		
		$scope.hasRendered = true;
		
		var img = document.querySelector("#original");
		
		var output = document.querySelector("#out");
		
		$scope.opts = {
			el : img,
			width : img.width,
			container : output,
		};
		
		
		$scope.ii = new Jscii($scope.opts);
		$scope.ii.render();
		
		$scope.text = document.querySelector("#out").innerHTML;
		
		$scope.text = $scope.text.replace(/\&nbsp;/g," ");
	};

});



function dropClick(){
    var i = document.querySelector('input');
    i.click();
}

mod.directive('imgArt',function(){
return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      
		
	  scope.clear =function(){
	  	element[0].innerHTML = '';
	  };
    }
  };
});

mod.directive('customOnChange', ['$parse',function($parse) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      
		
	  	  if(attrs.change)
		  {
		  	var exp = $parse(attrs.customOnChange);
		
		  element.bind('change',function(){
			  if(this.files[0])
			  {
				scope.currentFile = this.files[0];
				exp(scope,{file : scope.currentFile});
			  }
			 });
		  }
		
		 
    }
  };
}]);


mod.directive('clippy',function(){
	return {
		link : function(elem)
		{
			new Clipboard("#copy");
		}
	};
});
