
WASM=yes

LIB=
DIRS=
LIBOBJS=

HEADEREXTRACTLIST=Calc.cx

EXECOBJS=Calc.o calculator.o
EXEC=calculator.wasm

include make.wasm
include make.cx.inc
include make.rules

