//var instanceObj;
//var memory;

function awtkModule() {
	this.module = null;
	this.instance = null;
	this.memory = null;
	this.exports = null;

	// Load and instantiate the WebAssembly module
	this.load = async function(url) {
		try {
			this.memory = new WebAssembly.Memory({ initial: 16 });
			const response = await fetch(url);
			const buffer = await response.arrayBuffer();
			this.module = await WebAssembly.compile(buffer);

			console.log(WebAssembly.Module.imports(this.module));

			this.instance = await WebAssembly.instantiate(buffer,
						{env: 
							{
							memory:this.memory,
							//consoleLog:console.log,
							consoleLog:this.consoleLog,
							fbackRenderWasm:this.fbackRenderWasm.bind(this),
							consoleLogMsg:this.consoleLogMsg.bind(this),
							wasmFetch__:this.wasmFetch.bind(this)
							
							}
						});

			this.exports = this.instance.instance.exports;
			console.log(this.exports);

			if (this.instance) {
				return this.instance;
			} else {
				throw new Error("Failed to instantiate the WebAssembly module.");
			}
		} catch (error) {
			throw new Error("Error loading the WebAssembly module: " + error);
		}
	}

	// Execute the internal startUp() function
	this.startModule = function() {
		if (this.instance && this.exports && typeof this.exports.startModule === "function") {
			this.exports.startModule();
		} else {
			console.error("startUp() function not found in the WebAssembly module.");
		}
	}

	this.wasmGetString = function(ws) {
		const len = this.exports.stringBufferLength_(ws);
		const p   = this.exports.stringBufferGetBuffer_(ws);
		const uint8 = new Uint8Array(this.memory.buffer, p, len);

		return (new TextDecoder()).decode(uint8);
	}

	this.wasmStringNew = function(str) {
		const encoder = new TextEncoder();
		const view = encoder.encode(str);
		const len = view.length;
		const ws = this.exports.StringBufferNew_(len+1);
	
		if(ws>0){
			const p = this.exports.stringBufferGetBuffer_(ws);
			const uint8 = new Uint8Array(this.memory.buffer, p, len+1);
			uint8.set(view);
			uint8[len] = 0;
	 		this.exports.stringBufferHardsetLength_(ws, len);
		}
		return ws;
	}

	this.wasmStringFree = function(ws) {
		this.exports.stringBufferFree_(ws);
	}

	this.consoleLogMsg =  function(str)
	{
		var msg = this.wasmGetString(str);
		console.log(msg);
	}

	this.globalHandler = function(event, v, p, c, id)
	{
		console.log("HANDLER: VALUE:>>" + v + "<< P:>>" + p + "<< C:>>" + c + "<<");
		this.handlerGateway(event, v, p, c, id);
	}

	this.handlerGateway = function(event, value, pointer, component, id)
	{
		const f = event.target.fback;
		const value_sb = this.wasmStringNew(value);
		const event_type = this.wasmStringNew(event.type);
		//console.log("V: "+f.EV+" P:"+f.EP+" C:"+f.EC+" id:"+id);
		console.log("V: "+value+" P:"+pointer+" C:"+component+" id:"+id);
		ret = this.exports.globalHandler_(event_type, pointer, component, value_sb);
		console.log(ret);
		this.exports.stringBufferFree_(event_type);
		this.exports.stringBufferFree_(value_sb);
	}

	this.wasmFetchHandler = function(response, component, handler)
	{
		console.log(">>>> wasmFetchHandler >>>>");
		console.log(response);
		const response_ws = this.wasmStringNew(response);
		console.log(">>>> wasmFetchHandler 2 >>>>");
		this.exports.globalFetchHandler2(response_ws, component, handler);	
		console.log(">>>> wasmFetchHandler 3 >>>>");
		this.exports.stringBufferFree_(response_ws);
		console.log(">>>> wasmFetchHandler 4 >>>>");
	}


	this.wasmFetch = function(url_ws, component, handler)
	{
		console.log(">>>> wasmFetch >>>>");
		const url = this.wasmGetString(url_ws);
		// not tested, i think the bind is needed.. But not tested
		//fetch(url).then(response => response.text()).then(response => this.wasmFetchHandler(response, component, handler).bind(this));
		fetch(url).then(response => response.text()).then(response => this.wasmFetchHandler(response, component, handler));
	}


	this.fbackRenderWasm = function(id, str)
	{
		console.log(">>>> RENDER >>>>");
		var newid = this.wasmGetString(id);
		var newpagejson = this.wasmGetString(str);
		console.log("NEWID: " + newid);

		//console.log(newpagejson);
	       	 var oldNode = document.getElementById(newid);

		fbackStatReset();

       		var eltree = JSON.parse(newpagejson);
		console.log(eltree);
		var newNode = fbackRenderReplace(this, 0, oldNode, eltree, this.globalHandler.bind(this))

		fbackStatLog();

		if(newNode !== oldNode){
			console.log("Replace");
       	 		var par = oldNode.parentNode;
       	 		par.replaceChild(newNode, oldNode);
		}
	}
}

async function awtkStartModule(url)
{
	mod = new awtkModule();
	
	console.log("Loading Wasm Module");
	await mod.load(url)

	console.log("Staring Wasm Module");
	mod.exports.moduleStart()
	console.log("Started");

	return mod;
}

/*
const myWasmModule = new WasmModule();
myWasmModule.load('example.wasm')
	.then(instance => {
		console.log('WebAssembly module loaded', instance);
		myWasmModule.startUp();
	})
	.catch(error => {
		console.error(error);
	});
*/
