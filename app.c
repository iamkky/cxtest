#include <stddef.h>
#include <stdlib.h>
#include <string.h>

#include <mpaland/printf.h>
#include <io/errLogf.h>
#include <tmstr/string.h>

#include <abd/new.h>

#include <tmstr/StringBuffer.h>
#include <ht/HtElement.h>

#include <wasm/api.h>
#include "hc/HComponent.x.h"
#include "Calc.x.h"
#include "JsonTable.x.h"
#include "HTab.x.h"
#include "App.x.h"

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

	app = (HComponent)CNew(App);

        render(NULL);
}

HtElement AppRender()
{
	return app->render(app);
}

// required by mpaland printf, Not used
//
void _putchar(char character)
{
	// send char to console etc.
}

