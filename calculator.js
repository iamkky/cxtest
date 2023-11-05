	
async function startCalcAwtkModule(url)
{
	mod = await awtkStartModule(url)

	mod.createCalc = function(id){
		var format_sb = mod.wasmStringNew("Calc");
		var id_sb = mod.wasmStringNew(id);
		mod.exports.createComponent(id_sb, format_sb);
		mod.wasmStringFree(id_sb);
		mod.wasmStringFree(format_sb);
	}

	return mod;
}


