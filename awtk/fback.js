var fbackReplaceCount = 0;
var fbackAppendCount = 0;
var fbackRemoveCount = 0;
var fbackNodeCount = 0;

function fbackStatReset()
{
	fbackNodeCount = 0;
	fbackReplaceCount = 0;
	fbackAppendCount = 0;
	fbackRemoveCount = 0;
}

function fbackStatLog()
{
	console.log("Nodes: "+ fbackNodeCount);
	console.log("Replaces: "+ fbackReplaceCount + " Append: " + fbackAppendCount + " Remove: " + fbackRemoveCount);
}

function parseHandlerCoding(str)
{
const decoded = {type:"", p:"", c:"", v:""};

	const fp0 = str.indexOf(":");
	if(fp0<0) return null;
	decoded.type = str.substring(0, fp0);

	if(decoded.type == "C"){
		const fp1 = str.indexOf(":", fp0+1);
		if(fp1<0) return null;
		decoded.p = str.substring(fp0+1, fp1);

		fp2 = str.indexOf(":", fp1+1);
		if(fp2<0) return null;
		decoded.c = str.substring(fp1+1, fp2);

		decoded.v = str.substring(fp2+1);
	}

	// In the JS handlers will have a different format
	if(decoded.type == "JS"){
		const fp1 = str.indexOf(":", fp0+1);
		if(fp1<0) return null;
		decoded.p = str.substring(fp0+1, fp1);

		fp2 = str.indexOf(":", fp1+1);
		if(fp2<0) return null;
		decoded.c = str.substring(fp1+1, fp2);

		decoded.v = str.substring(fp2+1);
	}

	//console.log("parseHandlerCoding");
	//console.log(decoded);
	return decoded;
}

function isEventName(name)
{
	switch(name){
	case "onClick":		return "click";
	case "onMouseDown":	return "mousedown";
	case "onMouseOver":	return "mouseover";
	case "onMouseOut":	return "mouseOut";
	}

	return "";
}

function fbackRenderJavascriptHandlerWrapper(element, event_name, handler_data)
{
	console.log("fbackRenderJavascriptHandlerWrapper: "+event_name);
	if(window[handler_data.p] === undefined){
		console.log("fbackRenderJavascriptHandlerWrapper: undefined function: "+handler_data.p);
	}else{
		element.addEventListener(event_name, function(event){window[handler_data.p](handler_data.v);});
	}
}

function fbackRenderReplace(module, level, node, el, handler)
{
var elnew;
var face = el.t;

	fbackNodeCount++;
	if(node === null || node.fback === undefined || node.fback.Hash != el.h
	   || (el.t!="_text" && node.nodeType == Node.TEXT_NODE)){
		//var hh = node === null ? "null" : (node.fback === undefined ? "undef" : node.fback.Hash);
		if(el.t=="_text"){
 	 		var elnew = document.createTextNode(el.v);
		}else{
 	 		var elnew = document.createElement(face);
			if(typeof(el.c) != "undefined"){
				if(el.c != "") { elnew.className = el.c };
			}
			if(typeof(el.i) != "undefined"){
				if(el.i != "") { elnew.id = el.i };
			}
		}

		elnew.fback = new Object();
		elnew.fback.Hash = el.h;

		if(el.k != " undefined"){
			if(el.k != "") { elnew.fbackKey = el.k };
		}

		if (typeof(el.at) != "undefined") {
			var index = 0;
			while(index < el.at.length) { 
				attr = el.at[index];
				const event_name = isEventName(attr.n);
				console.log("Event: "+attr.n+"   "+event_name);
				if(event_name != ""){
					const h = parseHandlerCoding(attr.v);
					if(h.type=="C"){
						elnew.addEventListener(event_name, function(event){handler(event, h.v, h.p, h.c, el.i)});
					}else{
						fbackRenderJavascriptHandlerWrapper(elnew, event_name, h);
					}
				}else{
					elnew.setAttribute(attr.n, attr.v);
				}
				index++;
			}  
		}

		if(node !== null && node.nodeType != Node.TEXT_NODE && el.t != 0){
			while (node.hasChildNodes()) {
				elnew.appendChild(node.firstChild);
			}
		}
	}else{
		elnew = node;
	}

	var childs;
	var nchilds;

	if(elnew!== null){
		childs = elnew.childNodes;
		nchilds = childs.length;
	}else{
		nchilds = 0;
	}

	var cc = 0;

	if (typeof(el.ch) != "undefined") {
		var index = 0;
		while(index < el.ch.length) { 
			if(cc<nchilds){
				var htch = fbackRenderReplace(module, level+1, childs[cc], el.ch[index], handler);
				if(childs[cc] !== htch){
					fbackReplaceCount++;
					elnew.replaceChild(htch, childs[cc]);
				}
				cc++;
			}else{
				var htch = fbackRenderReplace(module, level+1, null, el.ch[index], handler);
				if(typeof(htch) != "undefined"){
					fbackAppendCount++;
					elnew.appendChild(htch);
				}
			}
			index++;
		}  

		childs = elnew.childNodes;
		nchilds = childs.length;

		var last = el.ch.length;
		for(cc = el.ch.length; cc<nchilds; cc++){
			fbackRemoveCount++;
			elnew.removeChild(childs[last]);
		}
	}

	return elnew;
}

