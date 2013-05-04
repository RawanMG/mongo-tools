// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(function () {

function validateCollection() {
    $('#colbtn').removeAttr('disabled');


  var colname = $('.colltxt').val();

  if(colname.replace(/\s/g, "") =="")//collection name must not be empty
   {
        if($('div.alert').length == 0) 
          flash($('#col-error'), 'error', '<strong>Error!</strong> Collection name can\'t be empty.');
	$('#colbtn').attr('disabled', 'disabled'); 
   }
   else if(colname.indexOf("$") !=-1) //collection name must not contain '$'
   {
	if($('div.alert').length == 0) {
          flash($('#col-error'), 'error', '<strong>Error!</strong> Collection name can\'t be empty.');
        }
	$('#colbtn').attr('disabled', 'disabled');  

   }else if(colname.search("system.") == 0)//must not begin with 'system.'
   {
    if($('div.alert').length == 0) {
          flash($('#col-error'), 'error', '<strong>Error!</strong> Collection name can\'t begin with \'system.\'');
    }
      $('#colbtn').attr('disabled', 'disabled'); 

   }else if (colname.indexOf(".")==0 || colname.indexOf(".") == colname.length-1) { //mustn't begin or end with '.'
       if($('div.alert').length == 0) {
          flash($('#col-error'), 'error', '<strong>Error!</strong> Collection name can\'t begin or end with \'.\'');
    }
	$('#colbtn').attr('disabled', 'disabled');   }
    else {
	    $('#colbtn').removeAttr("disabled");
	}
   
}


  var typingTimer;
  var doneTypingInterval = 650;  //time in ms
  var doneTypingIntervalCol = 800; 
 $('.colltxt').keyup(
  function(){
  clearTimeout(typingTimer); //the user typed something
  typingTimer = setTimeout(validateCollection, doneTypingIntervalCol ); 

 });//end 'colltxt'onkeyup()




  // Bug fix: prevents breaking the contenteditable box
  // Inserts a zero width space when the content is empty
  var filters = $('#collection-form .params span[contenteditable=true]');
  filters.keyup(function () {
    // Detect when the user has stopped typing and validate the fields
    clearTimeout(typingTimer);
    if ($(this).val) {
        typingTimer = setTimeout(validateFields, doneTypingInterval);
    }

    filters.filter(":empty").html("&#8203;");
    if ($(this).data("type") == "hash") {
      validateHash(this);
    } else if ($(this).data("type") == "number") {
      validateNumber(this);
    }

  });

  filters.keydown(function (e) {
    e = $.event.fix(e);
    if (e.which == 13) {
      // Make enter submit the form
      e.preventDefault();

      $(this).parents("form").submit();
    } else if (e.which == 8 || e.which == 46) {
      var parent = document.getSelection().anchorNode.parentNode;
      if ($(parent).is(filters) && ($(parent).text() == document.getSelection().toString() || $(parent).html() == "&#8203;")) {
        $(parent).html("&#8203;");
        e.preventDefault();
      }
    }
  });

  $('#collection-form').submit(function() {
    if(validateFields()) {
      var params = {};
      $(this).find("span[data-name]").each(function (index, elem) {
        if ($(elem).is(":visible")) {
          params[$(elem).data("name")] = sanitizedElementText(elem);
        }
      });
      params["explain"] = $("#span-explain").is(":visible");

      $.ajax({
        type: "GET",      });
    }

    return false;
  });
  
$('#newcolbtn').on( 'click', function(){
    $('#createcolmodal').modal();
});
$('#editcolbtn').on( 'click', function(){
    $('#editcolmodal').modal();
}); 
  // Hide the respective span elements on click
  $('#collection-form .buttons button.btn-inverse').click(function () {
    $(this).toggleClass('active');
    $('#span-' + $(this).data()['field']).toggle();
    return false;
  });
  
  $('#create-coll').on('click', function () {
    $('#create-modal').modal();
  });
   $('#importcolbtn').on('click', function () {
    $('#import-modal').modal();
  });
   
   function import_JSON() {
    //code
   }
  /*
$('#languages-dropdown > li').on('click', function () {
    if (validateFields()) {
      var out = $('#query');

        data: params,
        success: function(data) {
          $("#results").replaceWith(data);
        },
        error: function() {

        }
      var selection = $(this).attr('id');
      if (selection != "0") {
        var type = (selection == "node") ? "javascript" : 'text/x-' + selection;
        var editor = CodeMirror.fromTextArea(out.get(0), {
            path: "/assets/codemirror",
            mode: type,
            tabSize: 2,
            gutter: true,
            lineNumbers: true,
            showCursorWhenSelecting: true,
            autofocus: true,
            theme: 'solarized',
            matchBrackets: 1
        });

        var lang = language_formatters[selection];
        var params = {};
        $('#collection-form').find("span[data-name]").each(function (index, elem) {
          if ($(elem).is(":visible") && ($.trim(sanitizedElementText(elem))).length > 0) {
            if ($(elem).data("type") == "hash") {
              params[$(elem).data("name")] = eval('({' + sanitizedElementText(elem) + '})');
            }
            else {
              params[$(elem).data("name")] = eval('(' + sanitizedElementText(elem) + ')');
            }
          }
        });

        params["explain"] = $("#span-explain").is(":visible");
        var query = lang.import() + lang.before() + lang.query(params);
        editor.setValue(query);
        var totalLines = editor.lineCount();
        if(type != "javascript") {
          editor.autoFormatRange({line:0, ch:0}, {line:totalLines - 1, ch:editor.getLine(totalLines - 1).length});
        }
        editor.setCursor({line:0,ch:0});
        out.data('CodeMirrorInstance', editor);
        $('#modal-language').html(selection.charAt(0).toUpperCase() + selection.substr(1).toLowerCase());
        $('#languages-modal').modal().css({
           'width': function () {
               return ($(document).width() * .4) + 'px';
           }});
      }
    }

    return false;
  });

 
  // Hide the respective span elements on click
  $('#collection-form .buttons button.btn-inverse').click(function () {
    $(this).toggleClass('active');
    $('#span-' + $(this).data()['field']).toggle();
    return false;

  $('#languages-modal').on('shown', function () {
    var editor = $('#query').data('CodeMirrorInstance');
    if(editor != undefined && editor != null) {
      editor.refresh();
    }
  });


  $('#languages-modal').on('hidden', function () {
    $('#languages-modal-dropdown').val('0');
    var editor = $('#query').data('CodeMirrorInstance');
    if(editor != undefined && editor != null) {
      editor.toTextArea();
    }
    $('#query').empty().hide();

  });
  
  $('#create-coll').on('click', function () {
    $('#create-modal').modal();
  });

  /*



  $('#copy-db').on('click', function () {
     $('#create-db-modal').modal();
   });

  $('.copy_db_submit').click(function(){
    if(validateDatabaseName()){
      return false;
    }
    $('.alert alert-error').empty(); //empties the div
    $('.alert alert-error').html(''); //empties the div
    var valid = true;
    params = {};
    params["db"]= $('#db').val();
    $.ajax({
      type: "GET",
      async: false,
      data: params,
      dataType: 'text' ,
      url : "/explorer",
      async: false,
      success: function(data) {
        if(data != 'OK')
        {
          flash($('#Errors'), 'error', '<strong>Error!</strong> Database already exists in the system.');
          $('.btn-primary').addClass("disabled");
          $('input[type=submit]').attr('disabled', 'disabled');
          valid = false;
        }
        else
        {
          valid = true;
        }
      },
      error: function() {
        alert('error');
      }
    });
    return valid;
  });

  $('#languages-dropdown > li').on('click', function () {

    if (validateFields()) {
      var out = $('#query');
      var selection = $(this).attr('id');
      if (selection != "0") {
        var type = (selection == "node") ? "javascript" : 'text/x-' + selection;
        var editor = CodeMirror.fromTextArea(out.get(0), {
            path: "/assets/codemirror",
            mode: type,
            tabSize: 2,
            gutter: true,
            lineNumbers: true,
            showCursorWhenSelecting: true,
            autofocus: true,
            theme: 'solarized',
            matchBrackets: 1
        });

        var lang = language_formatters[selection];
        var params = {};
        $('#collection-form').find("span[data-name]").each(function (index, elem) {
          if ($(elem).is(":visible") && ($.trim(sanitizedElementText(elem))).length > 0) {
            if ($(elem).data("type") == "hash") {
              params[$(elem).data("name")] = eval('({' + sanitizedElementText(elem) + '})');
            }
            else {
              params[$(elem).data("name")] = eval('(' + sanitizedElementText(elem) + ')');
            }
          }
        });

        params["explain"] = $("#span-explain").is(":visible");
        var query = lang.import() + lang.before() + lang.query(params);
        editor.setValue(query);
        var totalLines = editor.lineCount();
        if(type != "javascript") {
          editor.autoFormatRange({line:0, ch:0}, {line:totalLines - 1, ch:editor.getLine(totalLines - 1).length});
        }
        editor.setCursor({line:0,ch:0});
        out.data('CodeMirrorInstance', editor);
        $('#modal-language').html(selection.charAt(0).toUpperCase() + selection.substr(1).toLowerCase());
        $('#languages-modal').modal().css({
           'width': function () {
               return ($(document).width() * .4) + 'px';
           }});
      }
    }

    return false;
  });

  $('#languages-modal').on('shown', function () {
    var editor = $('#query').data('CodeMirrorInstance');
    if(editor != undefined && editor != null) {
      editor.refresh();
    }
  });


  $('#languages-modal').on('hidden', function () {
    $('#languages-modal-dropdown').val('0');
    var editor = $('#query').data('CodeMirrorInstance');
    if(editor != undefined && editor != null) {
      editor.toTextArea();
    }
    $('#query').empty().hide();
  });

  function formatRubyHash(ret, key, value) {
    switch(typeof value){
      case "string":
        return ret + '"' + key + '" => "' + value + '"';
      case "number":
        return ret + '"' + key + '" => ' + value;
      case "object":
        if(!$.isEmptyObject(value)) {
          if(key != null) {
            ret += '{' + '"' + key + '" => ';
          }

          $.each(value, function(k, v) {
            if(value.hasOwnProperty(k)) {
              ret += "{";
              ret = formatRubyHash(ret, k, v);
              ret += "}";
            }
          });
        }
        return ret;
      case "boolean":
        return ret + '"' + key + '" => ' + value;
      default:
        return ret;
    }
  };

  var language_formatters = {
    ruby: {
      import: function() {
        return "require 'mongo'\ninclude Mongo\n";
      },

      before: function () {
        return 'mongo_client = MongoClient.new\n' +
          'db = mongo_client.db("' + current_database_name + '")\n' +
          'coll = db.collection("'+ current_collection_name + '")\n';
      },

      query: function (params) {
        var ret = "coll.find(";
          
        if(!$.isEmptyObject(params['query'])) {
          ret = formatRubyHash(ret, null, params['query']);
          ret += ', {';
        }
        else {
          ret += '{}, {';
        }

        if(!$.isEmptyObject(params['fields'])) {
          ret += ':fields => ';
          ret = formatRubyHash(ret, null, params['fields']);
          ret += ', ';
        }

        if(!$.isEmptyObject(params['sort'])) {
          ret += ':sort => [';

          $.each(params['sort'], function(key, value) {
            if(params['sort'].hasOwnProperty(key)) {
              var constant = (value == 1) ? 'Mongo::ASCENDING' : 'Mongo::DESCENDING';
              ret += '["' + key + '", ' + constant + '], ';
            }
          });

          ret = ret.substring(0, ret.length - 2) + '], ';
        }

  function formatRubyHash(ret, key, value) {
    switch(typeof value){
      case "string":
        return ret + '"' + key + '" => "' + value + '"';
      case "number":
        return ret + '"' + key + '" => ' + value;
      case "object":
        if(!$.isEmptyObject(value)) {
          if(key != null) {
            ret += '{' + '"' + key + '" => ';
          }

          $.each(value, function(k, v) {
            if(value.hasOwnProperty(k)) {
              ret += "{";
              ret = formatRubyHash(ret, k, v);
              ret += "}";
            }
          });
        }
        return ret;
      case "boolean":
        return ret + '"' + key + '" => ' + value;
      default:
        return ret;
    }
  };

  var language_formatters = {
    ruby: {
      import: function() {
        return "require 'mongo'\ninclude Mongo\n";
      },

      before: function () {
        return 'mongo_client = MongoClient.new\n' +
          'db = mongo_client.db("' + current_database_name + '")\n' +
          'coll = db.collection("'+ current_collection_name + '")\n';
      },

      query: function (params) {
        var ret = "coll.find(";
          
        if(!$.isEmptyObject(params['query'])) {
          ret = formatRubyHash(ret, null, params['query']);
          ret += ', {';
        }
        else {
          ret += '{}, {';
        }

        if(!$.isEmptyObject(params['fields'])) {
          ret += ':fields => ';
          ret = formatRubyHash(ret, null, params['fields']);
          ret += ', ';
        }

        if(!$.isEmptyObject(params['sort'])) {
          ret += ':sort => [';

          $.each(params['sort'], function(key, value) {
            if(params['sort'].hasOwnProperty(key)) {
              var constant = (value == 1) ? 'Mongo::ASCENDING' : 'Mongo::DESCENDING';
              ret += '["' + key + '", ' + constant + '], ';
            }
          });

          ret = ret.substring(0, ret.length - 2) + '], ';
        }


        if (params['skip']) {
          ret += ':skip => ' + params['skip'] + ', ';
        }

        if (params['limit']) {
          ret += ':limit => ' + params['limit'] + '})';
        }
        else {
          ret += ret.substring(0, ret.length - 2) + '})';
        }

        if (params['explain']) {
          return 'explanation = ' + ret + '.explain';
        }
        else {
          return 'cursor = ' + ret;
        }
      }
    },
    python: {
      import: function() {
        return 'import pymongo\n';
      },

      before: function() {
        return 'mongo_client = pymongo.MongoClient()\n' +
          'db = mongo_client["' + current_database_name + '"]\n' +
          'coll = db["' + current_collection_name + '"]\n';
      },

      query: function(params) {
        var ret = "coll.find(";

        if(!$.isEmptyObject(params['query'])) {
          ret += JSON.stringify(params['query']);
        }

        if(!$.isEmptyObject(params['fields'])) {
          ret += ', ';
          ret += JSON.stringify(params['fields']);
          ret += ')';
        }
        else {
          ret += ')';
        }

        if(!$.isEmptyObject(params['sort'])) {
          ret += '.sort([';

          $.each(params['sort'], function(key, value) {
            if(params['sort'].hasOwnProperty(key)) {
              var constant = (value == 1) ? 'pymongo.ASCENDING' : 'pymongo.DESCENDING';
              ret += '("' + key + '", ' + constant + '), ';
            }
          });

          ret = ret.substring(0, ret.length - 2) + '])';
        }

        if (params['skip']) {
          ret += '.skip(' + params['skip'] + ')';
        }

        if (params['limit']) {
          ret += '.limit(' + params['limit'] + ')';
        }

        if (params['explain']) {
          return 'explanation = ' + ret + '.explain()';
        }
        else {
          return 'cursor = ' + ret;
        }
      }
    },
    node: {
      import: function() {
        return "var MongoClient = require('mongodb').MongoClient;\n" +
                "var Server = require('mongodb').Server;\n";
      },

      before: function() {
        return "var mongoClient = new MongoClient(new Server('localhost', 27017));\n" +
                "mongoClient.open(function(err, mongoClient) {\n" +
                "\tvar db = mongoClient.db('" + current_database_name + "');\n";
      },

      query: function(params) {
        var ret = "db.collection('" + current_collection_name + "').find(";

        if(!$.isEmptyObject(params['query'])) {
          ret += JSON.stringify(params['query']);
        }

        if(!$.isEmptyObject(params['fields'])) {
          ret += ', ';
          ret += JSON.stringify(params['fields']);
          ret += ')';
        }
        else {
          ret += ')';
        }

        if(!$.isEmptyObject(params['sort'])) {
          ret += '.sort(';
          ret += JSON.stringify(params['sort']);
          ret += ')';
        }

        if (params['skip']) {
          ret += '.skip(' + params['skip'] + ')';
        }

        if (params['limit']) {
          ret += '.limit(' + params['limit'] + ')';
        }

        if (params['explain']) {
          return '\t' + ret + '.explain(function(err, explanation) {\n\t\tmongoClient.close();\n\t});\n});';
        }
        else {
           return '\tvar cursor = ' + ret + ';\n\tmongoClient.close();\n});';
        }
      }
    }
  };

  // query functions
  function validateHash(elem) {
    t = '{' + sanitizedElementText(elem) + '}';
    return validateQuery(elem, t);
  };
*/
  function validateQuery(elem, query) {
    try {
      eval('(' + query + ')');
      $(elem).css({ 'border-bottom-color': 'white' });
      return true;
    } catch (e) {
      $(elem).css({ 'border-bottom-color': 'red' });
      return false;
    }
  };

  function validateNumber(elem) {
    if (isNaN(sanitizedElementText(elem))) {
      $(elem).css({ 'border-bottom-color': 'red' });
      return false;
    } else {
      $(elem).css({ 'border-bottom-color': 'white' });
      return true;
    }
  }

  // validate all fields
  function validateFields() {
    try {
      $('#collection-form').find("span[data-name]").each(function (index, elem) {
        if ($(elem).is(":visible")) {
          if (($(elem).data("type") == "hash" && !validateHash(elem))
            || ($(elem).data("type") == "number" && !validateNumber(elem))) {
            throw "Invalid Query.";
          }
        }
      });
      $('#submit').removeClass('disabled').removeAttr('disabled');
      $('#languages').removeClass('disabled').removeAttr('disabled');
      return true;
    }
    catch(e) {
      $('#submit').addClass('disabled').attr('disabled', 'disabled');
      $('#languages').addClass('disabled').attr('disabled', 'disabled');
      return false;
    }       
  };

  function sanitizedElementText(elem) {
    return $("<div></div>").html($(elem).html().replace(/[\u200B-\u200D\uFEFF]/g, '')).text();
  };
});
