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

He AppRender();

int render(int type, void *component, StringBuffer value)
{
StringBuffer	str;
He	e;

	str = StringBufferNew(2000);

        //memMonitor((char *)0x34dd0, 16);
	errLogf("AppRender");
	e = AppRender();

        //memMonitor((char *)0x34dd0, 16);
	errLogf("RenderJson");
	heRenderJson(e, str);

        //memMonitor((char *)0x34dd0, 16);
	errLogf("htElementFree");
	heFree(e);

	fbackRenderWasm(str);

	stringBufferFree(str);

	return 0;
}

///// App State
///// Fixme: need to work in a good componentization and mothodology for render and states
/////        Too raw code by now... But ok for a prove of concept

HComponent app;

wasmExport
void AppInit()
{
	// Does nothing!
	// But need to be called in order to force linking with wasm/api.o
	wasmApiInit(); 
	awtkRegisterGlobalHandlerHook(render);
	app = (HComponent)CNew(Calc);
        render(0, app, NULL);
}

He AppRender()
{
	return app->render(app);
}

// required by mpaland printf, Not used
//
void _putchar(char character)
{
	// send char to console etc.
}

