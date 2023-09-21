var instanceObj;
var memory;

function wasmGetString(instanceObj, memory, ws)
{
	len = instanceObj.instance.exports.stringBufferLength_(ws);
	p   = instanceObj.instance.exports.stringBufferGetBuffer_(ws);
	//console.log('Pointer: ' + p);
	uint8 = new Uint8Array(memory.buffer, p, len);
	return (new TextDecoder()).decode(uint8);
}

function wasmStringNew(instanceObj, memory, str)
{
	console.log("STR: "+str);
	const encoder = new TextEncoder();
	const view = encoder.encode(str);

	console.log(view);
	len = view.length;
	console.log("LEN: "+len);
	ws = instanceObj.instance.exports.StringBufferNew_(len+1);
	
	if(ws>0){
		p = instanceObj.instance.exports.stringBufferGetBuffer_(ws);
		var uint8 = new Uint8Array(memory.buffer, p, len+1);
		uint8.set(view);
		uint8[len] = 0;
	 	instanceObj.instance.exports.stringBufferHardsetLength_(ws, len+1);
	}
	return ws;
}

function wasmStringFree(instanceObj, str)
{
	instanceObj.instance.exports.stringBufferFree_(ws);
}

function globalHandler(event)
{
	const f = event.target.fback;
	console.log("V: "+f.EV+" P:"+f.EP+" C:"+f.EC);
	instanceObj.instance.exports.globalHandler(f.EP, f.EC, f.EV);
}

function fbackRenderWasm(str)
{
	console.log("================================== RENDER ==================================");
	var newpagejson = wasmGetString(instanceObj, memory, str);

        var oldNode = document.getElementById("app");

	fbackStatReset();

        var eltree = JSON.parse(newpagejson);
	var newNode = fbackRenderReplace(0,oldNode, eltree, globalHandler)

	fbackStatLog();

	if(newNode !== oldNode){
		console.log("Replace");
        	var par = oldNode.parentNode;
        	par.replaceChild(newNode, oldNode);
	}
}

function wasmFetchHandler(response, component, handler)
{
	var response_ws = wasmStringNew(instanceObj, memory, response);
	instanceObj.instance.exports.globalFetchHandler2(response_ws, component, handler);	
}

function wasmFetch(url_ws, component, handler)
{
	var url = wasmGetString(instanceObj, memory, url_ws);
	fetch(url).then(response => response.text()).then(response => wasmFetchHandler(response, component, handler));
}

function consoleLogMsg(str)
{
	var msg = wasmGetString(instanceObj, memory, str);
	console.log(msg);
}

async function startWasm(url)
{
	memory = new WebAssembly.Memory({ initial: 16 });
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const module = await WebAssembly.compile(buffer);
	console.log(WebAssembly.Module.imports(module));

	instanceObj = await WebAssembly.instantiate(buffer, {env: 
							{
							memory:memory,
							consoleLog:console.log,
							fbackRenderWasm:fbackRenderWasm,
							consoleLogMsg:consoleLogMsg,
							wasmFetch__:wasmFetch
							}
						});

	console.log(instanceObj.instance.exports);

	console.log("Staring");
	instanceObj.instance.exports.AppInit();
	console.log("End");
}

