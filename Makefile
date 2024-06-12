
export WASM=yes

LIB=
DIRS=
LIBOBJS=

HEADEREXTRACTLIST=Calc.cx Slider.cx SideMenu.cx JsonTable.cx ToFree.c

EXECOBJS=Calc.o Slider.o SideMenu.o JsonTable.o components.o ToFree.o
EXEC=components.wasm

include make.wasm
include make.cx.inc
include make.rules

