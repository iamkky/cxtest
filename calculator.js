	
async function startCalcAwtkModule(url)
{
	const mod = await awtkStartModule(url)

	mod.createCalc = function(id){
		console.log("mod.createCalc in");
		const format_sb = mod.wasmStringNew("Calc");
		const id_sb = mod.wasmStringNew(id);
		console.log(format_sb);
		console.log(id_sb);
		mod.exports.createComponent(id_sb, format_sb);
		mod.wasmStringFree(id_sb);
		mod.wasmStringFree(format_sb);
		console.log("mod.createCalc out");
	}

	mod.createSlider = function(id){
		console.log("mod.createSlider in");
		const format_sb = mod.wasmStringNew("Slider");
		const id_sb = mod.wasmStringNew(id);
		console.log(format_sb);
		console.log(id_sb);
		mod.exports.createComponent(id_sb, format_sb);
		mod.wasmStringFree(id_sb);
		mod.wasmStringFree(format_sb);
		console.log("mod.createSlider in");
	}

	return mod;
}


