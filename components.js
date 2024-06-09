	
async function startAwtkComponentGateway(url)
{
	const mod = await awtkStartModule(url)

	mod.createComponent = function(id, component_name, attributes){
		console.log("mod.createComponent in");
		const format_sb = mod.wasmStringNew(component_name);
		const id_sb = mod.wasmStringNew(id);
		const attributes_sb = mod.wasmStringNew(JSON.stringify(attributes));
		console.log("Teste: " + JSON.stringify(attributes));
		console.log(format_sb);
		console.log(id_sb);
		mod.exports.createComponent(id_sb, format_sb, attributes_sb);
		mod.wasmStringFree(id_sb);
		mod.wasmStringFree(format_sb);
		mod.wasmStringFree(attributes);
		console.log("mod.createComponent in");
	}

	return mod;
}


