$(function () {
    
function  validateFile(){
    var fileobj = $("#file")
    var path = $("#file").val()
    
    if (!fileobj) {
       flash($('#import-error'), 'error', '<strong>Error!</strong> unable to load file.');

	return false; 
	
        //code
    }else if(path.search('.json') == -1)
    {
        flash($('#import-error'), 'error', '<strong>Error!</strong> not a .json file');

        return false; 

    } 
  return true;   
  };
  $("document").ready(function(){
    $('input[type=file]').change( function () {
    if(!validateFile())
       $('#importsubmit').attr('disabled', 'disabled'); 
     else{
       $('#importsubmit').removeAttr("disabled");
     }

    });  
  }); 
 
});