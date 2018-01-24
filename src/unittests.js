/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
/*
Unittests for voodoo.js
*/
(() => {
'use strict';

function Vunittests() {
	var print = voodoo.print;
	var assert = voodoo.assert;
    this.n = 0;
    this.allok = 1;
	
	this.assert = (ok) => {		
        assert(ok);
        var k = "error"
        if (ok) {
            k = "ok";
        } else this.allok = 0;
        voodoo("body").query().append_html(`<div class="assert ${k}">#${this.n} OK</div>`);
        this.n++;
    };

	this.unittests = () => {		
		this.assert(voodoo("2^2/3*3/(4-7*abs(-5)/max(3,4)+4)/2.1-1").eval().to_precision(3).get() == -3.54);
		this.assert(voodoo("2^2/3*3/(4-7*abs(max(-5, -7))/max(3,4)+4)/2.1-1").eval().to_precision(3).get() == -3.54);
		this.assert(voodoo.delta(voodoo("asin(1/2)").eval().get() - Math.asin(1/2), 0.01));
		this.assert(voodoo("5 % 3").eval().get() == 2);
		this.assert(voodoo([1,2,3,4,5]).shift() == 1);		
		this.assert(voodoo([1,2,3,4,5]).pop() == 5);					
		this.assert(voodoo([22,1,14,35]).sort((a, b) => {return b - a;}).get(1) == 22);			
		this.assert(voodoo([22,1,14,35]).find((x)=>{return x==14;}) == 2);			
		this.assert(voodoo([22,1,14,35]).nth(2).sum().get() == 22 + 14);			
		this.assert(voodoo(42).multiply(2).get() == 2 * 42);		
		this.assert(voodoo(42).multiply(2).plus(5).minus(2).get() == 2 * 42 + 5 - 2);		
		this.assert(voodoo(42 * 42).sqrt().get() == 42);
		this.assert(voodoo([2, 7, 42]).get(-1) == 42);
		this.assert(voodoo(42).divide(2).get() == 42 / 2);
		this.assert(voodoo("1 + 1").eval().get() == 2);	
		this.assert(voodoo(100).sqrt().get() == 10);		
		this.assert(voodoo(42).multiply(2).get() == 2 * 42);		
		this.assert(voodoo(42).divide(2).get() == 42 / 2);			
		var c = voodoo({re: 2, im: 5}).minus_complex(1, 3).get(); this.assert(c.re == 1 && c.im == 2);
		c = voodoo([{re: 2, im: 5}, {re: 1, im: 7}]).minus_complex(1, 3).get(1); this.assert(c.re === 0 && c.im === 4);		
		this.assert(voodoo(voodoo.range(4, 6)).len() == 3);	
		this.assert(voodoo(voodoo.range(1, 122)).get(-1) == 122);	
		this.assert(voodoo.range(4, 6).length == 3);	
		this.assert(voodoo.range(1, 1).length == 1);	
		this.assert(voodoo(42*42).sqrt().get() == 42);		
		this.assert(voodoo([2, 3]).each(x => {return 2 * x;}).sum().get() == 2*2 + 2*3);		
		this.assert(voodoo({a:34, b:77}).extend({b:42}).get().b == 42);			
		this.assert(voodoo({a:34, b:77}).extend({a:42}).get().a == 42);		
		this.assert(voodoo({a:34, b:77}).extend({x:42}).get().x == 42);		
		this.assert(voodoo([9, 16]).sqrt().sum().get() == 7);
		this.assert(voodoo.is_numeric(9));
		this.assert(voodoo.is_numeric(9.2));
		this.assert( ! voodoo.is_numeric([]));
		this.assert( ! voodoo.is_numeric({}));		
		this.assert(voodoo([1, 2, 3]).plus(1).sum().get() == 9);		
		this.assert(voodoo([25, 9, 16]).sqrt().sum().get() == 12);	
		c = voodoo.extend([1,2,3], [2,3,4]); this.assert(c[0] == 2 && c[1] == 3 && c[2] == 4);
		c = voodoo.extend({a:1,b:2,c:3}, {a:11,c:13}); this.assert(c.a == 11 && c.c == 13);		
		c = voodoo.extend([1,2,[1,2],3], [1,2,[1,42],3]); this.assert(c[2][1] == 42);
		c = voodoo.extend({a:1, b:2, c:[1,{r:1}],f:3}, {c:[1,{r:42}]}); this.assert(c.c[1].r == 42);		
		c = voodoo.extend({a:1, b:2, c:[1,42],f:3}, 1); this.assert(c.c[1] == 42);		
		this.assert(voodoo.stringify_complex({re: 2, im: -5}) == "2 -5i");			
		this.assert(voodoo("1 + 1").eval().get() == 2);	
		this.assert(voodoo("1 / 1").eval().get() == 1);	
		this.assert(voodoo([3, 5, 7]).each((v) => {return 2 * v;}).sum().get() == 2*3 + 2*5 + 2*7);	
		this.assert(voodoo(10).average().get() == 10);	
		this.assert(voodoo(["1 / 1", "2"]).eval().get() == 1);	
		this.assert(voodoo.eval("1 / 1") == 1);	
		this.assert(voodoo.floor(voodoo.eval("3*5/(1/5.3)*32")) == voodoo.floor(3*5/(1/5.3)*32));
		this.assert(voodoo.floor(voodoo.eval("7-3.2*(-5)/(1/5.3)*32")) == voodoo.floor(7-3.2*(-5)/(1/5.3)*32));
		this.assert(voodoo.floor(voodoo.eval("2^2-3.2*(-5-1)*3/(1/(-5.3))*32")) == voodoo.floor(2**2-3.2*(-5-1)*3/(1/(-5.3))*32));
		this.assert(voodoo("1 / 2").eval().to_precision(2).get() == 0.5);	
		this.assert(voodoo("42 / 2").eval().to_precision(3).get() == 21);	
		this.assert(voodoo(["1", "2"]).eval().sum().get() == 3);			
		this.assert(voodoo("2^2/4*PI*E").eval().to_precision(6).get() == 8.53973);			
		this.assert(voodoo("3^2^2*PI").eval().to_precision(6).get() == 254.469);			
		this.assert(voodoo("3*4.25/7/3.2*3.21^2^2").eval().to_precision(4).get() == 60.43);	
		this.assert(voodoo("3*4.25/7/3.2").eval().to_precision(3).get() == 0.569);	
		this.assert(voodoo("9*8/9-3+2").eval().to_precision(3).get() == 7);	
		this.assert(voodoo("6*8/9-3+2").eval().to_precision(2).get() == 4.3);
		this.assert(voodoo("3+4*2/(1-5)^2^3").eval().to_precision(6).get() == 3.00012);	
		this.assert(voodoo("2*3/(4-7*(5/2.12)/(3*4.12)+4)/2.1-1-1").eval().to_precision(3).get() == -1.57);			

		this.assert(voodoo.is_array([ 2 ]));			

		this.assert( ! voodoo.is_array(2));			

		this.assert(voodoo.is_object( {} ));		
		this.assert(voodoo.is_object( null ));		
		this.assert(voodoo.is_object( [] ));		

		this.assert( ! voodoo.is_object(2));		

        if (this.allok) {
		    print(`${voodoo.NAME} unittests OK!`);
            voodoo("body").query().html(`<div class="assert ok">SUMMARY: OK</div>` + voodoo("body").query().html()).css({background: "#caffb5"});
        } else {
		    print(`${voodoo.NAME} ERROR!`);
            voodoo("body").query().html(`<div class="assert error">SUMMARY: ERRORS</div>` + voodoo("body").query().html()).css({background: "#ffc5ae"});
        }
        //voodoo("body").query().html(`${voodoo.NAME} unittests OK!`);
	}; 
};

voodoo.unittests = () => {new Vunittests().unittests();};

})();

