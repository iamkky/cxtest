#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include <abd/printf.h>
#include <abd/errLog.h>
#include <abd/string.h>

#include <abd/new.h>

#include <abd/StringBuffer.h>
#include <helium/He.h>

#include <awtk/api.h>
#include <awtk/HComponent.h>
#include "Calc.h"

int globalHandlerHook(int type, void *component, StringBuffer value)
{
StringBuffer	str;
He	e;

	str = StringBufferNew(2000);

        //memMonitor((char *)0x34dd0, 16);
	errLogf("AppRender");
	if(component){
		e = ((HComponent)component)->render((HComponent)component);

        	//memMonitor((char *)0x34dd0, 16);
		errLogf("RenderJson");
		heRenderJson(e, str);

		//memMonitor((char *)0x34dd0, 16);
		errLogf("htElementFree");
		heFree(e);

		fbackRenderWasm(str);
		stringBufferFree(str);
	}else{
		errLogf("No component to render");
	}


	return 0;
}

HComponent component_list[16];
int	component_list_size;

//wasmExport
void createComponent(char *id, char *format)
{
	component_list[component_list_size] = (HComponent)CNew(Calc);
	hcomponentSetId(component_list[component_list_size],"app");
        globalHandlerHook(0, component_list[component_list_size], NULL);
	component_list_size++;
}

wasmExport
void moduleStart()
{
int c;

	// wasmApiInit() does nothing!
	// But need to be called in order to force linking with wasm/api.o
	wasmApiInit(); 

	awtkRegisterGlobalHandlerHook(globalHandlerHook);

	component_list_size = 0;
	memset(component_list, 0, sizeof(component_list));
	
	createComponent("app", "Calc");
}

// required by mpaland printf, Not used
//
void _putchar(char character)
{
	// send char to console etc.
}

