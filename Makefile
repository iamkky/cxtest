
LIB=
DIRS=
LIBOBJS=

EXECOBJS=Calc.o JsonTable.o HTab.o App.o
EXEC=app

include make.wasm
include make.cx.inc
include make.rules

