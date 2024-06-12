#include <stdlib.h>
#include <abd/new.h>
#include <abd/AVec.c.h>

//HEADERX(ToFree.cx.h,_ABD_TO_FREE_H_)

Class(ToFree) {
	AVec	list;
};

Constructor(ToFree);
Destructor(ToFree);

int toFreeFreeAll(ToFree self);
void *toFreeSet(ToFree self, void *ptr);

//ENDX

Constructor(ToFree)
{
	CInit(ToFree);

	self->list = CNew(AVec);

	return self;
}

Destructor(ToFree)
{
	if(nullAssert(self)) return;

	toFreeFreeAll(self);
	AVecFree(self->list);
	free(self);
}

void *toFreeSet(ToFree self, void *ptr)
{
	if(nullAssert(self)) return ptr;
	if(nullAssert(self->list)) return ptr;

	aVecAppend(self->list, ptr);

	return ptr;
}

int toFreeFreeAll(ToFree self)
{
void *ptr;
int  c;

	if(nullAssert(self)) return -1;
	if(nullAssert(self->list)) return -2;

	for(c=0; c < aVecGetSize(self->list); c++){
		ptr = aVecGetItem(self->list, c);
		if(ptr) free(ptr);
	}

	aVecTruncate(self->list, 0);

	return 0;
}

