
export WASM=yes

LIB=
DIRS=
LIBOBJS=

HEADEREXTRACTLIST=Calc.cx Slider.cx SideMenu.cx JsonTable.cx

EXECOBJS=Calc.o Slider.o SideMenu.o JsonTable.o components.o 
EXEC=components.wasm

include make.wasm
include make.cx.inc
include make.rules

