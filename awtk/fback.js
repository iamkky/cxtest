
var faces = [
	undefined,undefined,undefined,"html",
	"head","title","meta","link",
	"body","table","th","td","tr",  "img","font","p","br",
	"form","input","input","select","option","h1","h2","h3","h4",
	"center","div",undefined,"span",
	"a",undefined,"script",
	"frameset","frame",
	"applet","param",
	"pre","hr","textarea",undefined,
	"thead","tbody",
	"ul","li",
	"svg","path","g","rect","polygon",
	"audio","source","label","canvas",
	"nav",
	"i","button",
	"circle","line","polyline","ellipse",
	"iframe"
];

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

var kkk = 0;

function fbackRenderReplace(level, node, el, handler)
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
				if(attr.n == "onClick"){
					elnew.fback.EV = attr.v;
					elnew.fback.EP = attr.p;
					elnew.fback.EC = attr.c;
					elnew.addEventListener('click', handler);
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
				var htch = fbackRenderReplace(level+1, childs[cc], el.ch[index], handler);
				if(childs[cc] !== htch){
					fbackReplaceCount++;
					elnew.replaceChild(htch, childs[cc]);
				}
				cc++;
			}else{
				var htch = fbackRenderReplace(level+1, null, el.ch[index], handler);
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

