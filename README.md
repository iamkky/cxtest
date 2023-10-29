# A Calculator using CX and AWTK #

[Calc Running as Example](https://iamkky.github.io/cxtest/test)

## Building Order ##

```mermaid
graph TD;
	aslt-->rdppgen;
	aslt-->nrlex;
	rdppgen-->cxc;
	nrlex-->cxc;
	libabd-->cxc
	libabd-->libhelium;
	cxc-->CxToolset;
	libhelium-->CxToolset;
	libabd-->CxToolset;
```
	
