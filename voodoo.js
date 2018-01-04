/*
voodoo - A lightweight JavaScript framework
language: JavaScript
version: 0.1
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
var voodoo = 0;

(function () { 	

const NAME = "voodoo"; 
const VERSION = "0.1"; 
const AUTHOR = "mystikkogames ( mystikkogames@protonmail.com )";
const NDEBUG = 0;

function print(s) {console.log(s);}
function assert(test, message = "voodoo assertion failed") {if (!test) throw message;}

function Evaluator(istr) {	
	this.equation = istr; 
	this.ns = []; 
	this.os = [];
	
	this.solve_oper = () => {
		var q = this.os.pop();
		if (q == "pi") {this.ns.push(voodoo.PI); return;}
		if (q == "e") {this.ns.push(voodoo.E); return;}
		var a = this.ns.pop(), b = 0;
		if (["cos", "tan", "sin"].indexOf(q) == -1)
			b = this.ns.pop();
		switch (q) {
			case "+": 
				this.ns.push(a + b); 
				break;
			case "-": 
				this.ns.push(b - a); 
				break;
			case "*": 
				this.ns.push(a * b); 
				break;
			case "max": 
				this.ns.push(Math.max(a, b));
				break;
			case "min": 
				this.ns.push(Math.min(a, b));
				break;
			case "sin": 
				this.ns.push(Math.sin(a));
				break;
			case "cos": 
				this.ns.push(Math.cos(a));
				break;
			case "tan": 
				this.ns.push(Math.tan(a));
				break;
			case "/": 
				this.ns.push(b / a); 
				break;
			case "^": 
				this.ns.push(Math.pow(b, a)); 
				break;
			default:
				throw "Impossible";
		}	
	};
		
	this.solve = (o) => {
		var opers_prece = {"+": 2, "-": 2, "*": 3, "/": 3, "^": 4};
		var opers_asso = {"+": 0, "-": 0, "*": 0, "/": 0, "^": 1};
		if (o == ")") {
			while (this.os.length > 0) {
				if (this.os[this.os.length - 1] == "(") {
					this.os.pop();
					return;
				}
				this.solve_oper();	
			}		
		} 			
		if (o == "(") {
			this.os.push(o);
			return;			
		}
		while (this.os.length > 0 && opers_prece[this.os[this.os.length - 1]] >= opers_prece[o]) {
			if (opers_asso[this.os[this.os.length - 1]] && opers_asso[o]) break;
			this.solve_oper();	
		}
		this.os.push(o);
	};
		
	this.is_whitespace = () => {
		var t = /^\s+/.exec(this.equation);
		if (t) {
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}	
		return 0;
	};
	
	this.is_number = () => {
		var t = /^(\d+\.\d+)|^(\d+\.)|^(\d+)/.exec(this.equation);
		if (t) {
			this.ns.push(Number(t[0]));
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_useless = () => {	
		var t = /^,/.exec(this.equation);
		if (t) {
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_func = () => {	
		var t = /^(sin)|^(max)|^(cos)|^(tan)|^(min)|^(pi)|^(e)/.exec(this.equation);
		if (t) {
			this.solve(t[0]);
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_oper = () => {	
		var t = /^[\+\-\*\/\(\)\^]/.exec(this.equation);
		if (t) {
			assert(t[0].length == 1);
			this.solve(t[0]);
			this.equation = this.equation.slice(1);
			return 1;
		}
		return 0;
	};
	
	this.eval = () => {		
		while (this.equation.length > 0) {
			if (this.is_whitespace()) continue;
			if (this.is_number()) continue;
			if (this.is_useless()) continue;
			if (this.is_func()) continue;
			if (this.is_oper()) continue;			
			throw "voodoo error: Invalid eval syntax";
		}
		while (this.os.length) this.solve_oper();
		return this;
	};
	
	this.value = () => {return this.ns[0];};
}

// https://stackoverflow.com/a/3177838
function time_since(seconds) {
	var interval = Math.floor(seconds / 31536000);
	if (interval > 1) return interval + " years";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) return interval + " months";
	interval = Math.floor(seconds / 86400);
	if (interval > 1) return interval + " days";
	interval = Math.floor(seconds / 3600);
	if (interval > 1) return interval + " hours";
	interval = Math.floor(seconds / 60);
	if (interval > 1) return interval + " minutes";
	if (seconds > 1)
		return Math.floor(seconds) + " seconds";
	return `${seconds}s`;
}

function is_array(x) {return Array.isArray(x) ? 1 : 0;}
function is_object(x) {return typeof x == "object" ? 1 : 0;}
function is_undefined(x) {return x === undefined ? 1 : 0;}

function get_keys(o) {const a = []; for (const key of iterate_object_keys(o)) a.push(key); return a;}
function get_values(o) {const a = []; for (const value of iterate_object_values(o)) a.push(value); return a;}

function *iterate_object_keys(o) {for (const i in o) {if (!o.hasOwnProperty(i)) continue; yield i;}}
function *iterate_object_values(o) {for (const i in o) {if (!o.hasOwnProperty(i)) continue;	yield o[i];}}

function deep_copy(o) {		
	var c = [];
	if (typeof o == "object") c = {};
	for (const i in o) {
		if (!o.hasOwnProperty(i)) continue;		
		if (is_array(o[i]) || is_object(o[i])) c[i] = deep_copy(o[i]);
		else c[i] = o[i];
	}
	return c;
}
	
function each(o, f) {	
	if (is_undefined(o)) return;
	for (const i in o) {
		if (!o.hasOwnProperty(i)) continue;
		var t = f(o[i], i);
		if (t !== undefined)
			o[i] = t;
	}
}

// shallow
function extend(a, b) {	
	for (const i in b) {
		if (!b.hasOwnProperty(i)) continue;
		a[i] = b[i];
	}
}

function abs(x) {return x < 0 ? -x : x;}

// https://jaketrent.com/post/addremove-classes-raw-javascript/
function has_class(e, n) {if (e.classList) return e.classList.contains(n); else return !!e.className.match(new RegExp(`(\\s|^)${n}(\\s|$)`));}
function add_class(e, n) {if (e.classList) e.classList.add(n); else if (!has_class(e, n)) e.className += ` ${n}`;}
function remove_class(e, n) {if (e.classList) e.classList.remove(n); else if (has_class(e, n)) {var reg = new RegExp(`(\\s|^)${n}(\\s|$)`); e.className=e.className.replace(reg, ' ');}}

var evaluator = (s) => {return new Evaluator(s);};
var reqanimframe = (() => {return window.requestAnimationFrame || window.requestAnimationFrame || function(c, e){window.setTimeout(c, 1000 / 60);};})();

function Voodoo() {
	this.v = 0;
	this.time_start = 0;
	this.time_val = 0;
	
	// utility stuff
	
	this.each = (f) => {voodoo.each(this.v, f); return this;};
	this.extend = (o) => {return this.each((v) => {voodoo.extend(v, o);});};		
	this.timer_start = () => {this.time_start = new Date(); return this;};		
	this.timer_end = () => {this.time_val = (new Date().getTime() - this.time_start.getTime()) / 1000; return this;};
	this.time_since = () => {return this.set(time_since(this.time_val));};	
	this.values = () => {var t = []; return this.each((v) => {if (is_object(v)) {for (const value of iterate_object_values(v)) t.push(value);} else t.push(v);}).set(t);}; 		
	this.keys = () => {var t = []; return this.each((v, k) => {if (is_object(v)) {for (const key of iterate_object_keys(v)) t.push(key);} else t.push(k);}).set(t);};	
	this.trim = () => {return this.each((v) => {return v.trim();});};
	this.slice = (a, b) => {return this.each((v) => {return v.slice(a, b);});};
	this.deep_copy = () => {this.v = voodoo.deep_copy(this.v); return this;};
	this.first = () => {this.v = this.v[0]; return this;};
	this.last = () => {this.v = this.v[this.v.length - 1]; return this;};
	this.debug = () => {return this.each((v) => {return print(v);});};	
	
	// math
	
	this.complex = (re, im) => {return this.set({"re": re, "im": im});};
	this.plus_complex = (re, im) => {return this.each((v) => {v.re += re; v.im += im;});};
	this.minus_complex = (re, im) => {return this.plus_complex(-re, -im);};
	this.set = (v = 0) => {if (is_array(v)) this.v = v; else this.v = [v]; return this;}; 		
	this.get = (n = 0) => {assert(this.v.length >= n, "voodoo get error"); return this.v[n];}; 		
	this.sqrt = () => {return this.each((v) => {return Math.sqrt(v);});}; 		
	this.numerize = () => {return this.each((v) => {return Number(v);});};
	this.sum = () => {var r = 0, s = 1; return this.each((v) => {r = s ? v : r + v; s = 0;}).set(r);};
	this.multiply = (x) => {return this.each((v) => {return v * x;});};
	this.plus = (x) => {return this.each((v) => {return v + x;});};
	this.minus = (x) => {return this.each((v) => {return v - x;});};	
	this.abs = () => {return this.each((v) => {return abs(v);});};
	this.floor = () => {return this.each((v) => {return Math.floor(v);});};	
	this.ceil = () => {return this.each((v) => {return Math.ceil(v);});};	
	this.tan = () => {return this.each((v) => {return Math.tan(v);});};	
	this.dot_product = () => {var r = 0; return this.each((v) => {r += v * v;}).set(r);};	
	this.sin = () => {return this.each((v) => {return Math.sin(v);});};	
	this.cos = () => {return this.each((v) => {return Math.cos(v);});};
	this.asin = () => {return this.each((v) => {return Math.asin(v);});};
	this.acos = () => {return this.each((v) => {return Math.acos(v);});};
	this.atan = () => {return this.each((v) => {return Math.atan(v);});}; 	
	this.random = (a = 0, b = 1) => {return this.each((v) => {return a + abs(b - a) * Math.random();});}; 	
	this.pow = (x) => {return this.each((v) => {return Math.pow(v, x);});}; 	
	this.exp = (x) => {return this.each((v) => {return Math.exp(v, x);});}; 		
	this.divide = (x) => {assert(x !== 0, "Voodoo error: Divided by 0"); return this.each((v) => {return v /= x;});};	
	this.average = () => {var n = 0, l = 0; this.each((v) => {n += v; l++;}); assert(n !== 0); return this.set(n / l);};
	this.range = (a, b) => {var t = []; for (var i = a; i < b; i++) t.push(i); this.v = t; return this;};	
	this.len = () => {return this.v.length;};	
	this.to_precision = (n) => {return this.each((v) => {return Number(v).toPrecision(n);});};
	this.eval = () => {return this.each((s) => {return voodoo.eval(s);});};	
	
	// html
	
	this.query = () => {var a = []; return this.each((v) => {var t = document.querySelectorAll(v); for (var q of t) a.push(q);}).set(a);};
	this.append_html = (html) => {return this.each((e) => {e.innerHTML += html;});};
	this.html = (html) => {return this.each((e) => {e.innerHTML = html;});};
	this.ready = (f) => {return this.each((e) => {e.addEventListener('DOMContentLoaded', () => {f();});});};
	this.css = (o) => {return this.each((e) => {for (var i in o) if (o.hasOwnProperty(i)) e.style[i] = o[i];});};	
	this.ajax = () => {return this.each((v) => {	
		var r = new XMLHttpRequest(); r.open(v.type, v.url, true);
		r.onreadystatechange = () => {if (r.readyState != 4 || r.status != 200) return; v.success(r.responseText);}; r.send(v.data);});};
	this.fade_out = (params) => {return this.each((e) => {
		e.style.opacity = e.style.opacity || 1;
		var [n, o] = [Number(e.style.opacity), voodoo({fade_to: 0, done: () => {}}).extend(params).get()];
  		(function fade() {n -= 0.1; e.style.opacity = n; if (n > o.fade_to) reqanimframe(fade); else o.done();})();});};	
	this.fade_in = (params) => {
		return this.each((e) => {
			e.style.opacity = e.style.opacity || 0;
			var [n, o] = [Number(e.style.opacity), voodoo({fade_to: 1, done: () => {}}).extend(params).get()];
			(function fadein() {n += 0.1; e.style.opacity = n; if (n < o.fade_to) reqanimframe(fadein); else o.done();})();
		});};
	this.hide = () => {return this.css({display: "none"});};
	this.show = () => {return this.css({display: "block"});};
	this.event = (action, f) => {return this.each((t) => {t.addEventListener(action, f);});};		
	this.click = (f) => {return this.event("click", f);};	
	this.add_class = (name) => {return this.each((e) => {add_class(e, name);});};
	this.remove_class = (name) => {return this.each((e) => {remove_class(e, name);});};
}
 	
voodoo = (v) => {return (new Voodoo()).set(v);};

voodoo.E = Math.E;
voodoo.LN2 = Math.LN2;
voodoo.LN10 = Math.LN10;
voodoo.LOG2E = Math.LOG2E;
voodoo.LOG10E = Math.LOG10E;
voodoo.PI = Math.PI;
voodoo.SQRT1_2 = Math.SQRT1_2;
voodoo.SQRT2 = Math.SQRT2;	
voodoo.PHI = 1.618033988749895;
voodoo.id = () => {return `${NAME} ${VERSION} by ${AUTHOR}`;};
voodoo.ID = voodoo.id();
voodoo.VERSION = VERSION;
voodoo.print = print;
voodoo.assert = assert;
voodoo.deep_copy = deep_copy;
voodoo.each = each;
voodoo.extend = extend;
voodoo.time_since = time_since;
voodoo.is_array = is_array;
voodoo.is_object = is_object;
voodoo.is_undefined = is_undefined;
voodoo.get_keys = get_keys;
voodoo.get_values = get_values;
voodoo.eval = (s) => {return evaluator(s).eval().value();};
voodoo.stringify_complex = (c) => {return `${c.re} ${c.im}i`;};	

if (!NDEBUG) print(voodoo.id());

})();
