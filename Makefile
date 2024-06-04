
export WASM=yes

LIB=
DIRS=
LIBOBJS=

HEADEREXTRACTLIST=Calc.cx Slider.cx SideMenu.cx JsonTable.cx

#EXECOBJS=Calc.o Slider.o calculator.o
EXECOBJS=Calc.o Slider.o SideMenu.o JsonTable.o calculator.o 
EXEC=calculator.wasm

include make.wasm
include make.cx.inc
include make.rules

