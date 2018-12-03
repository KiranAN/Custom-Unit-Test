"use strict";
var customUnitTest = (function(){
	var service = {};
	var definitionStr = "";
	var backgroundColor = "background: #222;";
	
	var successColor = backgroundColor + "color: #bada55";
	var errorColor = backgroundColor + " color: red";
	var testCount = 0;
	var testDefinition = "";
	var errorCount = 0;
	var successCount = 0;
	var testDefinitionArr = [];
	var reportArr = [];
	var originalRef = function(){};
	
	function runChecker(obj,args){
		return Function('"use strict";return (' + obj + ')')()(args);
	}
	
	function addCount(condition){
		(condition) ? successCount += 1:errorCount += 1;		
	}
	
	function reportPush(condition){
		reportArr.push({"key":definitionStr, "result": condition});			
		addCount(condition);
	}
	
	service.checkProperty = function(object, prop, type){		
		var args = {object:object,prop:prop,type:type};
		reportPush(runChecker("function(args){ return typeof args.object[args.prop] === args.type}",args));
    }

	service.assert = function(prop, valueToBeChecked){
		var args = {prop:prop,valueToBeChecked:valueToBeChecked};
		reportPush(runChecker("function(args){ return args.prop === args.valueToBeChecked}",args));		
	}

	service.define = function(str, func){
		testCount += 1;
		definitionStr = str;
		func.apply(this);
	}
	
	service.describe = function(str, func){	  
		console.log("Running Tests...");
		var self = this;		
		setTimeout(function(){
			testDefinition = str;
			testDefinitionArr.push({"key":str});			
			func.apply(self);
			report();
		},1000);	  
	}
	
	service.createStub = function(obj,fnProp,stubFn){ 
		originalRef = obj[fnProp]; 
		obj[fnProp] = stubFn; 
	}
	
	service.restore = function(obj,fnProp){
		obj[fnProp] = originalRef;		
	}
	
	///clone fn
	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
	
	var report = function(){
		
		var bgColor = (!errorCount) ? "background: #222;color:green;font-size:24px;font-weight:bold;" :
					"background: #222;color:red;font-size:24px;font-weight:bold;"
		
		console.log("%c Total Tests : " + testCount, bgColor);
		console.log("%c" + testDefinitionArr[0].key,"background: #222;color:green;font-size:18px;");
		var color ="";
		for(let i = 0;i< reportArr.length; i++){
		   color = (reportArr[i].result) ? successColor : errorColor;
		   console.log("%c" + reportArr[i].key + " : " + reportArr[i].result , color);
		}
		
		if(!errorCount){
			console.info("%c Success : " + successCount,"background: #222;color:green;font-size:24px;");				
		}else{
		    console.info("%c Success : " + successCount,"background: #222;color:green;font-size:18px;");
			console.info("%c Failure : " + errorCount,"background: #222;color:red;font-size:18px;"); 		
		}		
	}
	
	return service;
})();
var define = customUnitTest.define;
var describe = customUnitTest.describe;
var checkProperty = customUnitTest.checkProperty;
var assert = customUnitTest.assert;