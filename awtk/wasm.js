var instanceObj;
var memory;

// ========================================== STRING =========================================
function wasmGetString(instanceObj, memory, ws)
{
	len = instanceObj.instance.exports.stringBufferLength_(ws);
	p   = instanceObj.instance.exports.stringBufferGetBuffer_(ws);
	uint8 = new Uint8Array(memory.buffer, p, len);
	return (new TextDecoder()).decode(uint8);
}

function wasmStringNew(instanceObj, memory, str)
{
	const encoder = new TextEncoder();
	const view = encoder.encode(str);

	len = view.length;
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

// ========================================= CONSOLE =========================================

function consoleLogMsg(str)
{
	var msg = wasmGetString(instanceObj, memory, str);
	console.log(msg);
}

// ========================================== EVENT ==========================================

function globalHandler(event)
{
	const f = event.target.fback;
	var value = wasmStringNew(instanceObj, memory, f.EV);
	//console.log("V: "+f.EV+" P:"+f.EP+" C:"+f.EC);
	instanceObj.instance.exports.globalHandler(f.EP, f.EC, value);
	instanceObj.instance.exports.StringBufferFree_(value);
}

function wasmFetchHandler(response, component, handler)
{
	var response_ws = wasmStringNew(instanceObj, memory, response);
	instanceObj.instance.exports.globalFetchHandler2(response_ws, component, handler);	
	instanceObj.instance.exports.StringBufferFree_(response_ws);
}

function wasmFetch(url_ws, component, handler)
{
	var url = wasmGetString(instanceObj, memory, url_ws);
	fetch(url).then(response => response.text()).then(response => wasmFetchHandler(response, component, handler));
}

function fbackRenderWasm(str)
{
	console.log(">>>> RENDER >>>>");
	var newpagejson = wasmGetString(instanceObj, memory, str);

	//console.log(newpagejson);
        var oldNode = document.getElementById("app");

	fbackStatReset();

        var eltree = JSON.parse(newpagejson);
	console.log(eltree);
	var newNode = fbackRenderReplace(0,oldNode, eltree, globalHandler)

	fbackStatLog();

	if(newNode !== oldNode){
		console.log("Replace");
        	var par = oldNode.parentNode;
        	par.replaceChild(newNode, oldNode);
	}
}

// ========================================== START  ==========================================

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

async function WasmModule(url)
{
	const response = await fetch(url);
	const buffer = await response.arrayBuffer();
	const module = await WebAssembly.compile(buffer);
	console.log(WebAssembly.Module.imports(module));

	this.memory = new WebAssembly.Memory({ initial: 16 });

	this.instanceObj = await WebAssembly.instantiate(buffer, {env: 
							{
							memory:memory,
							consoleLog:console.log,
							fbackRenderWasm:fbackRenderWasm,
							consoleLogMsg:consoleLogMsg,
							wasmFetch__:wasmFetch
							}
						});

	this.exports = this.instanceObj.instance.exports;

	console.log(this.exports);

	console.log("Staring");
	this.exports.AppInit();
	console.log("End");


	this.wasmGetString = function(instanceObj, memory, ws) {
		len = this.exports.stringBufferLength_(ws);
		p   = this.exports.stringBufferGetBuffer_(ws);
		uint8 = new Uint8Array(memory.buffer, p, len);
		return (new TextDecoder()).decode(uint8);
	}

	this.wasmStringNew = function(str) {
		const encoder = new TextEncoder();
		const view = encoder.encode(str);

		len = view.length;
		ws = this.exports.StringBufferNew_(len+1);
	
		if(ws>0){
			p = this.exports.stringBufferGetBuffer_(ws);
			var uint8 = new Uint8Array(this. memory.buffer, p, len+1);
			uint8.set(view);
			uint8[len] = 0;
	 		this.exports.stringBufferHardsetLength_(ws, len+1);
		}
		return ws;
	}

	this.wasmStringFree = function(str) {
		this.exports.stringBufferFree_(ws);
	}
}

