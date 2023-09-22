
LIB=
DIRS=
LIBOBJS=

HEADEREXTRACTLIST=Calc.cx

EXECOBJS=Calc.o app.o
EXEC=app

include make.wasm
include make.cx.inc
include make.rules

