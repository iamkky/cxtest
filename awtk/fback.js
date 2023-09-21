
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
var elht;
var face = faces[el.t];

	fbackNodeCount++;
	if(node === null || node.fback === undefined || node.fback.Hash != el.h
	   || (el.t!=0 && node.nodeType == Node.TEXT_NODE)){
		var hh = node === null ? "null" : (node.fback === undefined ? "undef" : node.fback.Hash);
		if(typeof(face) != "undefined"){
 	 		var elht = document.createElement(face);
			if(typeof(el.c) != "undefined"){
				if(el.c != "") { elht.className = el.c };
			}
		}else{
			if(el.t==0){
 	 			var elht = document.createTextNode(el.v);
			}else{
				console.log("Undefined");
				return undefined;
			}
		}

		elht.fback = new Object();
		elht.fback.Hash = el.h;

		if(el.k != " undefined"){
			if(el.k != "") { elht.fbackKey = el.k };
		}

		if (typeof(el.at) != "undefined") {
			var index = 0;
			while(index < el.at.length) { 
				attr = el.at[index];
				if(attr.n == "onClick"){
					elht.fback.EV = attr.v;
					elht.fback.EP = attr.p;
					elht.fback.EC = attr.c;
					elht.addEventListener('click', handler);
				}else{
					elht.setAttribute(attr.n, attr.v);
				}
				index++;
			}  
		}

		if(node !== null && node.nodeType != Node.TEXT_NODE && el.t != 0){
			while (node.hasChildNodes()) {
				elht.appendChild(node.firstChild);
			}
		}
	}else{
		elht = node;
	}

	var childs;
	var nchilds;

	if(elht!== null){
		childs = elht.childNodes;
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
					elht.replaceChild(htch, childs[cc]);
				}
				cc++;
			}else{
				var htch = fbackRenderReplace(level+1, null, el.ch[index], handler);
				if(typeof(htch) != "undefined"){
					fbackAppendCount++;
					elht.appendChild(htch);
				}
			}
			index++;
		}  

		childs = elht.childNodes;
		nchilds = childs.length;

		var last = el.ch.length;
		for(cc = el.ch.length; cc<nchilds; cc++){
			fbackRemoveCount++;
			elht.removeChild(childs[last]);
		}
	}

	return elht;
}

