#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include <abd/printf.h>
#include <abd/errLog.h>
#include <abd/string.h>

#include <abd/new.h>

#include <abd/AString.c.h>
#include <helium/He.h>

#include <awtk/api.h>
#include <awtk/util.h>
#include <awtk/HComponent.h>

#include <abjson/json.h>

#include "Calc.cx.h"
#include "Slider.cx.h"
#include "SideMenu.cx.h"
#include "JsonTable.cx.h"

#define MAX_COMPONENT 128

HComponent	component_list[MAX_COMPONENT];
int		component_list_size;

//int globalHandlerHook(int type, AString void *component, AString value)
int globalHandlerHook(int type, AString event_type, void *component, AString value)
{
AString	json_str, id_str;
char		*id;
He	e;


        //memMonitor((char *)0x34dd0, 16);
	errLogf("AppRender");
	if(component){
		//e = ((HComponent)component)->render((HComponent)component);
		e = hcomponentRender((HComponent)component);

        	//memMonitor((char *)0x34dd0, 16);
		json_str = CNew(AString,2000);

		errLogf("RenderJson");
		heRenderJson(e, json_str);
		//memMonitor((char *)0x34dd0, 16);
		errLogf("htElementFree");
		heFree(e);

		id = hcomponentGetId(((HComponent)component));
		errLogf("Component id: %s",id);

		id_str = CNew(AString,128);
		aStringAddStr(id_str, id);

		fbackRenderWasm(id_str, json_str);

		AStringFree(json_str);
		AStringFree(id_str);
	}else{
		errLogf("No component to render");
	}


	return 0;
}

wasmExport
void createComponent(AString id, AString format, AString attributes)
{
AData attr;

	if(nullAssert(id)){
		errLogf("createComponent: NULL id (stringbuffer)");
		return;
	}

	if(nullAssert(aStringGetBuffer(id))){
		errLogf("createComponent: NULL id (buffer)");
		return;
	}

	if(component_list_size>=MAX_COMPONENT){
		errLogf("createComponent: Maximum component number reached");
		return;
	}

	if(attributes){
		errLogf("attributes %s", aStringGetBuffer(attributes));
	}

	if(aStringLength(attributes)>0){
		attr = awtkParsesJson(attributes);
	}else{
		attr = NULL;
	}

	if(!aStringCompare(format,"Calc")){
		component_list[component_list_size] = (HComponent)CNew(Calc, attr);
	}else if(!aStringCompare(format,"Slider")){
		component_list[component_list_size] = (HComponent)CNew(Slider, attr);
	}else if(!aStringCompare(format,"SideMenu")){
		component_list[component_list_size] = (HComponent)CNew(SideMenu, attr);
	}else if(!aStringCompare(format,"JsonTable")){
		//component_list[component_list_size] = (HComponent)CNew(JsonTable, "json/employee.json");
		component_list[component_list_size] = (HComponent)CNew(JsonTable, attr);
	}else{
		errLogf("Unknow component %s", aStringGetBuffer(format));
		return;
	}
	hcomponentSetId(component_list[component_list_size], aStringGetBuffer(id));
        globalHandlerHook(0, NULL, component_list[component_list_size], NULL);
	component_list_size++;
	return;
}

wasmExport
void moduleStart()
{
AString	id_str;
int c;

	// wasmApiInit() does nothing!
	// But need to be called in order to force linking with wasm/api.o
	wasmApiInit(); 

	awtkRegisterGlobalHandlerHook(globalHandlerHook);

	component_list_size = 0;
	memset(component_list, 0, sizeof(component_list));
}

// required by mpaland printf, Not used
//
void _putchar(char character)
{
	// send char to console etc.
}

