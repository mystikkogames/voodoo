/*
voodoo.js - A lightweight JavaScript framework
language: JavaScript
version: 0.31
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
var voodoo = 0;

(function () { 	

const NAME = "voodoo.js"; 
const VERSION = "0.31"; 
const AUTHOR = "mystikkogames ( mystikkogames@protonmail.com )";
const NDEBUG = 0; // 1 : on production 0 : development

function print(s) {console.log(s);}
function assert(test, message = "voodoo.js error: Assertion failed") {if (!test) throw message;}

function Evaluator(istr) {	
	this.equation = istr.replace(/\s+/g, "");
	this.ns = []; 
	this.os = [];
	this.wasop = 1;
	this.solve_oper = () => {
		let q = this.os.pop();
		let a = this.ns.pop(), b = 0;
		if (!voodoo.array_contains(["cos", "tan", "sin", "acos", "atan", "asin", "abs"], q)) b = this.ns.pop();
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
				this.ns.push(voodoo.max(a, b));
				break;
			case "min": 
				this.ns.push(voodoo.min(a, b));
				break;
			case "sin": 
				this.ns.push(voodoo.sin(a));
				break;
			case "cos": 
				this.ns.push(voodoo.cos(a));
				break;
			case "asin": 
				this.ns.push(voodoo.asin(a));
				break;
			case "acos": 
				this.ns.push(voodoo.acos(a));
				break;
			case "atan": 
				this.ns.push(voodoo.atan(a));
				break;
			case "abs": 
				this.ns.push(voodoo.abs(a));
				break;
			case "tan": 
				this.ns.push(voodoo.tan(a));
				break;
			case "/": 
				if (a === 0) throw "voodoo.js error: Division by 0";
				this.ns.push(b / a); 
				break;
			case "%": 
				if (a === 0) throw "voodoo.js error: Division by 0";
				this.ns.push(b % a); 
				break;
			case "^": 
				this.ns.push(voodoo.pow(b, a)); 
				break;
			default:
				throw "voodoo.js error: Impossible";
		}	
	};
		
	this.solve = (o) => {
		let opers_prece = {"+": 2, "-": 2, "*": 3, "/": 3, "%": 3, "^": 4};
		let opers_asso = {"+": 0, "-": 0, "*": 0, "/": 0, "%": 0, "^": 1};
		if (o == ")") {
			while (this.os.length > 0) {
				if (voodoo.array_last(this.os) == "(") {
					let yy = this.os.pop();
					if (this.os.length && voodoo.array_contains(["cos", "tan", "sin", "acos", "atan", "asin", "abs", "max", "min"], voodoo.array_last(this.os)))
						this.solve_oper();	
					return;
				}
				this.solve_oper();	
			}		
		} 			
		if (o == "(") {
			this.os.push(o);
			return;			
		}
		while (this.os.length > 0 && opers_prece[voodoo.array_last(this.os)] >= opers_prece[o]) {
			if (opers_asso[voodoo.array_last(this.os)] && opers_asso[o]) break;
			this.solve_oper();	
		}
		this.os.push(o);
	};
	
	this.is_number = () => {
		let t = /^[\-]?\d*\.?\d+/.exec(this.equation);
		if (t) {
			if (t[0][0] == "-" && !this.wasop) return 0;
			this.wasop = 0;
			this.ns.push(voodoo.numerize(t[0]));
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_useless = () => {	
		let t = /^,/.exec(this.equation);
		if (t) {
			this.wasop = 1;
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_const = () => {
		let t = /^(PI)|^(E)|^(PHI)/.exec(this.equation);
		if (t) {
			this.wasop = 0;
			switch (t[0]) {
				case "PI": this.ns.push(voodoo.PI); break;
				case "E": this.ns.push(voodoo.E); break;
				case "PHI": this.ns.push(voodoo.PHI); break;
				default: throw "voodoo.js error: Impossible";
			}
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_func = () => {	
		let t = /^(sin)|^(cos)|^(tan)|^(asin)|^(acos)|^(atan)|^(max)|^(abs)|^(min)/.exec(this.equation);
		if (t) {
			this.wasop = 0;
			this.solve(t[0]);
			this.equation = this.equation.slice(t[0].length);
			return 1;
		}
		return 0;
	};
	
	this.is_oper = () => {	
		let t = /^[\+\%\-\*\/\(\)\^]/.exec(this.equation);
		if (t) {
			assert(t[0].length == 1);
			this.wasop = 1;
			this.solve(t[0]);
			this.equation = this.equation.slice(1);
			return 1;
		}
		return 0;
	};
	
	this.eval = () => {		
		while (this.equation.length > 0) {
			if (this.is_number()) continue;
			if (this.is_oper()) continue;			
			if (this.is_useless()) continue;
			if (this.is_func()) continue;
			if (this.is_const()) continue;
			throw "voodoo.js error: Invalid eval syntax";
		}
		while (this.os.length) this.solve_oper();
		return this;
	};
	
	this.value = () => {return this.ns[0];};
}

// https://stackoverflow.com/a/3177838
function time_since(s) {
	let i = voodoo.floor(s / 31536000);	if (i > 1) return `${i} years`;
	i = voodoo.floor(s / 2592000); if (i > 1) return `${i} months`;
	i = voodoo.floor(s / 86400); if (i > 1) return `${i} days`;
	i = voodoo.floor(s / 3600);	if (i > 1) return `${i} hours`;
	i = voodoo.floor(s / 60); if (i > 1) return `${i} minutes`;
	if (s > 1) return `${voodoo.floor(s)} s`;
	return `${s}s`;
}

function is_array(x) {return Array.isArray(x) ? 1 : 0;}
function is_object(x) {return typeof x == "object" ? 1 : 0;}
function is_undefined(x) {return x === undefined ? 1 : 0;}

function get_keys(o) {const a = []; for (const key of iterate_object_keys(o)) a.push(key); return a;}
function get_values(o) {const a = []; for (const value of iterate_object_values(o)) a.push(value); return a;}

function *iterate_object_keys(o) {for (const i in o) {if (o.hasOwnProperty(i)) yield i;}}
function *iterate_object_values(o) {for (const i in o) {if (o.hasOwnProperty(i)) yield o[i];}}

function deep_copy(o) {		
	var c = [];
	if (is_object(o)) c = {};
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
		let t = f(o[i], i);
		if (t !== undefined)
			o[i] = t;
	}
}

// shallow
function extend(a, b) {	
	if (is_undefined(b)) return;
	for (const i in b) {
		if (!b.hasOwnProperty(i)) continue;
		a[i] = b[i];
	}
}

function not_zero(x, msg = "voodoo.js error: Can't be 0") {if (x === 0) throw msg; return x;}

// https://jaketrent.com/post/addremove-classes-raw-javascript/
function has_class(e, n) {if (e.classList) return e.classList.contains(n); else return !!e.className.match(new RegExp(`(\\s|^)${n}(\\s|$)`));}
function add_class(e, n) {if (e.classList) e.classList.add(n); else if (!has_class(e, n)) e.className += ` ${n}`;}
function remove_class(e, n) {if (e.classList) e.classList.remove(n); else if (has_class(e, n)) {let reg = new RegExp(`(\\s|^)${n}(\\s|$)`); e.className = e.className.replace(reg, ' ');}}

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
	this.values = () => {let t = []; return this.each((v) => {if (is_object(v)) {for (const value of iterate_object_values(v)) t.push(value);} else t.push(v);}).set(t);}; 		
	this.keys = () => {let t = []; return this.each((v, k) => {if (is_object(v)) {for (const key of iterate_object_keys(v)) t.push(key);} else t.push(k);}).set(t);};	
	this.trim = () => {return this.each((v) => {return v.trim();});};
	this.slice = (a, b) => {return this.each((v) => {return v.slice(a, b);});};
	this.deep_copy = () => {this.v = voodoo.deep_copy(this.v); return this;};
	this.first = () => {this.v = this.v[0]; return this;};
	this.last = () => {this.v = voodoo.array_last[this.v]; return this;};
	this.debug = () => {return this.each((v) => {return print(v);});};	
	this.join = (s) => {let t = 0; return this.each((v) => {return t++ ? `${s} ${v}` : v;});};	
	this.set = (v = 0) => {if (is_array(v)) this.v = v; else this.v = [v]; return this;}; 		
	this.get = (n = 0) => {let l = this.v.length; if (n < 0) n = l + n; n = voodoo.abs(n) % l; return this.v[n];}; 		
	this.single = (f) => {f(); return this;};
	this.len = () => {return this.v.length;};	
	this.complex = (re, im) => {return this.set({"re": re, "im": im});};
	
	// math
	
	this.plus_complex = (re, im) => {return this.each((v) => {v.re += re; v.im += im;});};
	this.minus_complex = (re, im) => {return this.plus_complex(-re, -im);};
	this.unit_vector = () => {let l = 0; return this.each((v) => {l += v * v;}).single(() => {l = not_zero(voodoo.sqrt(l));}).each((v) => {return v / l;});};
	this.sqrt = () => {return this.each((v) => {return voodoo.sqrt(v);});}; 		
	this.numerize = () => {return this.each((v) => {return voodoo.numerize(v);});};
	this.sum = () => {let r = 0, s = 1; return this.each((v) => {r = s ? v : r + v; s = 0;}).set(r);};
	this.multiply = (x) => {return this.each((v) => {return v * x;});};
	this.plus = (x) => {return this.each((v) => {return v + x;});};
	this.minus = (x) => {return this.each((v) => {return v - x;});};	
	this.square = () => {return this.each((v) => {return voodoo.square(v);});};	
	this.cube = () => {return this.each((v) => {return voodoo.cube(v);});};	
	this.abs = () => {return this.each((v) => {return voodoo.abs(v);});};
	this.floor = () => {return this.each((v) => {return voodoo.floor(v);});};	
	this.ceil = () => {return this.each((v) => {return voodoo.ceil(v);});};	
	this.tan = () => {return this.each((v) => {return voodoo.tan(v);});};	
	this.dot_product = () => {let r = 0; return this.each((v) => {r += v * v;}).set(r);};	
	this.sin = () => {return this.each((v) => {return voodoo.sin(v);});};	
	this.cos = () => {return this.each((v) => {return voodoo.cos(v);});};
	this.asin = () => {return this.each((v) => {return voodoo.asin(v);});};
	this.acos = () => {return this.each((v) => {return voodoo.acos(v);});};
	this.atan = () => {return this.each((v) => {return voodoo.atan(v);});}; 	
	this.random = (a = 0, b = 1) => {return this.each((v) => {return voodoo.random(a, b);});}; 	
	this.pow = (x) => {return this.each((v) => {return voodoo.pow(v, x);});}; 	
	this.exp = (x) => {return this.each((v) => {return voodoo.exp(v, x);});}; 		
	this.divide = (x) => {not_zero(x, "voodoo.js error: Division by 0"); return this.each((v) => {return v /= x;});};	
	this.mod = (x) => {not_zero(x, "voodoo.js error: Division by 0"); return this.each((v) => {return v %= x;});};	
	this.average = () => {let n = 0, l = 0; return this.each((v) => {n += v; l++;}).single(() => {not_zero(l, "voodoo.js error: Division by 0");}).set(n / l);};
	this.to_precision = (n) => {return this.each((v) => {return voodoo.numerize(v).toPrecision(n);});};
	this.eval = () => {return this.each((s) => {return voodoo.eval(s);});};	
	
	// html
	
	this.query = () => {let a = []; return this.each((v) => {for (const q of document.querySelectorAll(v)) a.push(q);}).set(a);};
	this.append_html = (html) => {return this.each((e) => {e.innerHTML += html;});};
	this.html = (html) => {return this.each((e) => {e.innerHTML = html;});};
	this.ready = (f) => {return this.each((e) => {e.addEventListener('DOMContentLoaded', () => {f();});});};
	this.css = (o) => {return this.each((e) => {each(o, (v, k) => {e.style[k] = v;});});};	
	this.ajax = () => {return this.each((v) => {	
		let r = new XMLHttpRequest(); r.open(v.type, v.url, true);
		r.onreadystatechange = () => {if (r.readyState != 4 || r.status != 200) return; v.success(r.responseText);}; r.send(v.data);});};
	this.fade_out = (params) => {return this.each((e) => {
		e.style.opacity = e.style.opacity || 1;
		let [n, o] = [voodoo.numerize(e.style.opacity), voodoo({fade_to: 0, done: () => {}}).extend(params).get()];
  		(function fade() {n -= 0.1; e.style.opacity = n; if (n > o.fade_to) reqanimframe(fade); else o.done();})();});};	
	this.fade_in = (params) => {
		return this.each((e) => {
			e.style.opacity = e.style.opacity || 0;
			let [n, o] = [voodoo.numerize(e.style.opacity), voodoo({fade_to: 1, done: () => {}}).extend(params).get()];
			(function fadein() {n += 0.1; e.style.opacity = n; if (n < o.fade_to) reqanimframe(fadein); else o.done();})();
		});};
	this.hide = () => {return this.css({display: "none"});};
	this.show = () => {return this.css({display: "block"});};
	this.event = (action, f) => {return this.each((t) => {t.addEventListener(action, f);});};		
	this.click = (f) => {return this.event("click", f);};	
	this.add_class = (name) => {return this.each((e) => {add_class(e, name);});};
	this.remove_class = (name) => {return this.each((e) => {remove_class(e, name);});};
}
 	
voodoo = (v) => {return new Voodoo().set(v);};

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
voodoo.NAME = NAME;
voodoo.VERSION = VERSION;
voodoo.NDEBUG = NDEBUG;
voodoo.print = print;
voodoo.assert = assert;
voodoo.deep_copy = deep_copy;
voodoo.each = each;
voodoo.extend = extend;
voodoo.range = (a, b) => {var t = []; for (let i = a; i <= b; i++) t.push(i); return t;};
voodoo.sqrt = Math.sqrt;
voodoo.abs = (x) => {return x < 0 ? -x : x;}; 	
voodoo.numerize = Number;
voodoo.floor = Math.floor;
voodoo.ceil = Math.ceil;
voodoo.tan = Math.tan;
voodoo.sin = Math.sin;
voodoo.cos = Math.cos;
voodoo.max = (a, b) => {return a > b ? a : b;}; 	
voodoo.min = (a, b) => {return a < b ? a : b;}; 	
voodoo.asin = Math.asin;
voodoo.acos = Math.acos;
voodoo.random = (a = 0, b = 1) => {return a + voodoo.abs(b - a) * Math.random();}; 	
voodoo.delta = (a, b) => {return voodoo.abs(a) < b ? 1 : 0;}; 	
voodoo.square = (x) => {return x * x;}; 	
voodoo.cube = (x) => {return x * x * x;}; 	
voodoo.pow = Math.pow;
voodoo.exp = Math.exp;
voodoo.to_number = (s) => {return +s;};
voodoo.array_last = (a) => {return a.length ? a[a.length - 1] : a;};
voodoo.array_contains = (a, v) => {return a.indexOf(v) === -1 ? 0 : 1;};
voodoo.merge = (a, b) => {return a.concat(b);};
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
