/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
/*
Documentation for voodoo.js
*/
(() => {
'use strict';

function Vdocs() {
	this.n = 0;	

	var print = voodoo.print;
	var assert = voodoo.assert;

	this.example = (text, evaluate = 1) => {
		var classt = this.n % 2 === 0 ? "everyother" : "";
		var val = "";
		if (evaluate) val = " // " + eval(text);
		voodoo("#docs").query().append_html(`<li id="${this.n}"><a href=\"#${this.n}\" class=\"${classt}\">${this.n}. ${text} ${val}</a></li>`);
		this.n++;	
	};
	
	this.docs = () => {			
		var e = voodoo().timer_start();			
		this.n = 0;
		this.example("voodoo(\"2^2/3*3/(4-7*abs(-5)/max(3,4)+4)/2.1-1\").eval().to_precision(3).get()");	
		this.example("voodoo([-7.6, 4, 5]).unit_vector().to_precision(3).join(\" \").v");		
		this.example("voodoo([1,2,3,4,5,6,7,8,9,10]).nth(4).join(\" \").v");				
		this.example("voodoo([1,2,3,4,5,6,7,8,9,10]).filter((x)=>{return x > 5;}).join(\" \").v");	
		this.example("voodoo([1,2,3,4,5,6,7,8,9,10]).concat([12,13,14]).join(\" \").v");		
		this.example("voodoo([[1,2],[3,4],[9,10]]).concat([12,13,14]).join(\" \").v");		
		this.example("voodoo([[1,2,3],[4,5,6],[7,8,9,10]]).concat().join(\" \").v");		
		this.example("voodoo([1,2,3,4,5]).shift()");		
		this.example("voodoo([1,2,3,4,5]).pop()");	
		this.example("voodoo([1,2,3,4,5]).push(7).join(\" \").v");		
		this.example("voodoo([1,2,3,4,5]).unshift(7).join(\" \").v");		
		this.example("voodoo([[1,2,3]]).extend([11,13]).join(\" \").v");			
		this.example("voodoo([2.3, 5, 6, 7, 8, 42]).get(-1)");
		this.example("voodoo([2, 3, 4]).dot_product().get()");
		this.example("voodoo.eval(\"PHI * abs(-1 * PI)\")");	
		this.example("voodoo.eval(\"abs(min(-4, -2))\")");	
		this.example("voodoo.eval(\"PHI * 4.25 / E / 3.2 * 3.21 ^ 2 ^ 2 * PI\")");	
		this.example("voodoo([2, 4, 5]).unit_vector().square().sum().get()");	
		this.example("voodoo(\"12.12345\").to_precision(3).get()");
		this.example("voodoo(\"1 + 1\").eval().get()");	
		this.example("voodoo(\"3*4.25/7/3.2*3.21^2^2\").eval().to_precision(4).get()");	
		this.example("voodoo(7.6).floor().get()");
		this.example("voodoo(7.6).ceil().get()");		
		this.example("voodoo(-7.6).abs().get()");							
		this.example("voodoo([-2, -4, -6]).sum().get()");		
		this.example("voodoo([-2, -4, -6]).abs().sum().get()");		
		this.example("voodoo(9).sqrt().get()");
		this.example("voodoo([9, 16]).sqrt().get()");
		this.example("voodoo([9, 16]).sqrt().sum().get()");
		this.example("voodoo(4).dot_product().get()");
		this.example("voodoo(0.12).asin().get()");	
		this.example("voodoo(0.12).cos().sin().abs().to_precision(4).get()");
		this.example("voodoo(voodoo.PI/2).sin().get()");
		this.example("voodoo(voodoo.PI/2).cos().to_precision(3).get()");	
		this.example("voodoo(0.1).asin().to_precision(3).get()");	
		this.example("voodoo([1,2,10]).average().plus(voodoo([3,10]).average().get()).get()");	
		this.example("voodoo([-21,2,10]).average().get()");			
		this.example("voodoo([-21,2,10]).keys().v");	
		this.example("voodoo([-21,2,10]).values().v");					
		this.example("voodoo({a: 21, b: 2, c: 10}).keys().v");			
		this.example("voodoo({a: 21, b: 2, c: 10}).values().v");					
		this.example("voodoo().random().multiply(10).get()");	
		this.example("voodoo().random(3, 5).get()");		
		this.example("voodoo([1,2]).random(3, 5).v");		
		this.example("voodoo([-21,2,10]).keys().numerize().sum().get()");					
		this.example("voodoo(-21).abs().cos().get()");		
		this.example("voodoo([22, 43, 77]).values().get()");	
		this.example("voodoo(10).plus(10).plus(20).get()");
		this.example("voodoo(10).plus(10).plus(20).minus(100).get()");		
		this.example("voodoo([\"abcedfg\", \"ss\"]).slice(2).get()");	
		this.example("voodoo([\"abcedfg\", \"0123456\"]).slice(1).sum().get()");		
		this.example("voodoo([\"abcedfg\", \"ss\"]).sum().get()");	
		this.example("voodoo(\"abcedfg\").slice(2, 4).get()");
		this.example("voodoo([[1, 2, 3, 4, 5]]).slice(1, 3).get()");
		this.example("voodoo([12, 55]).dot_product().get()");
		this.example("voodoo(12).dot_product().get()");		

		this.example("voodoo.date_to_string(voodoo.get_date(10))");
		this.example("voodoo.is_array(3)");
		this.example("voodoo.is_array([2])");
		this.example(`= ${e.timer_end().time_since().get()}`, 0);		
		return this;
	};
};

voodoo.docs = () => {new Vdocs().docs();};

})();

