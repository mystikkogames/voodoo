/*jshint esversion: 6 */
/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
version: 0.33
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
'use strict';
var voodoo = 0; // Only global variable by voodoo.js

(function () { 	

const NAME = "voodoo.js"; 
const VERSION = "0.33"; 
const AUTHOR = "mystikkogames ( mystikkogames@protonmail.com )";
const NDEBUG = 0; // 1 : on production 0 : development
const ERROR_DIV0 = "voodoo.js error: Division by 0";
const ERROR_IMPOS = "voodoo.js error: Impossible";

var print = console.log;
var assert = console.assert;
var pr = print;
function vassert(test, message = "voodoo.js error: Assertion failed") {if (!test) throw message;}
function error(error = "voodoo.js error") {throw error;}
//var assert = cotest, message = "voodoo.js error: Assertion failed") {if (!test) throw message;}

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
			case "cos": 
			case "asin":
			case "acos":
			case "atan":
			case "abs": 
			case "tan": 
				this.ns.push(voodoo[q](a));
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
				throw ERROR_IMPOS;
		}	
	};
		
	this.solve = (o) => {
		let opers_prece = {"+": 2, "-": 2, "*": 3, "/": 3, "%": 3, "^": 4};
		let opers_asso = {"+": 0, "-": 0, "*": 0, "/": 0, "%": 0, "^": 1};
		if (o == ")") {
			while (this.os.length > 0) {
				if (voodoo.array_last(this.os) == "(") {
					this.os.pop();
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
			this.ns.push(voodoo.to_number(t[0]));
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
				default: throw ERROR_IMPOS;
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
		return this.ns[0];
	};
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

// deep
function extend(a, b) {	
	if (is_undefined(a)) return b;
	if (is_undefined(b)) return a;
	for (const i in b) {
		if (!b.hasOwnProperty(i)) continue;
		if (is_array(b[i]) || is_object(b[i])) {a[i] = extend(a[i], b[i]);}
		else a[i] = b[i];
	}
	return a;
}

// https://jaketrent.com/post/addremove-classes-raw-javascript/
function has_class(e, n) {if (e.classList) return e.classList.contains(n); else return !!e.className.match(new RegExp(`(\\s|^)${n}(\\s|$)`));}
function add_class(e, n) {if (e.classList) e.classList.add(n); else if (!has_class(e, n)) e.className += ` ${n}`;}
function remove_class(e, n) {if (e.classList) e.classList.remove(n); else if (has_class(e, n)) {let reg = new RegExp(`(\\s|^)${n}(\\s|$)`); e.className = e.className.replace(reg, ' ');}}

var reqanimframe = (() => {return window.requestAnimationFrame || function(c, e){window.setTimeout(c, 1000 / 60);};})();

function Voodoo() {
	this.v = 0;
	this.time_start = 0;
	this.time_val = 0;
	
	// utility stuff
	
	this.each = f => {voodoo.each(this.v, f); return this;};
	this.extend = o => {return this.each(v => {return voodoo.extend(v, o);});};		
	this.timer_start = () => {this.time_start = new Date(); return this;};		
	this.timer_end = () => {this.time_val = (new Date().getTime() - this.time_start.getTime()) / 1000; return this;};
	this.time_since = () => {return this.set(time_since(this.time_val));};	
	this.values = () => {let t = []; return this.each(v => {if (is_object(v)) {for (const value of iterate_object_values(v)) t.push(value);} else t.push(v);}).set(t);}; 		
	this.keys = () => {let t = []; return this.each((v, k) => {if (is_object(v)) {for (const key of iterate_object_keys(v)) t.push(key);} else t.push(k);}).set(t);};	
	this.trim = () => {return this.each(v => {return v.trim();});};
	this.slice = (a, b) => {return this.each(v => {return v.slice(a, b);});};
	this.deep_copy = () => {this.v = voodoo.deep_copy(this.v); return this;};
	this.first = () => {return this.v[0];};
	this.last = () => {return voodoo.array_last[this.v];};
	this.debug = () => {return this.each(v => {voodoo.print(v);});};	
	this.join = s => {let t = 0; return this.each((v) => {return t++ ? `${s} ${v}` : v;});};	
	this.set = (v = 0) => {if (is_array(v)) this.v = v; else this.v = [v]; return this;}; 		
	this.get = (n = 0) => {let l = this.v.length; if (n < 0) n = l + n; n = voodoo.abs(n) % l; return this.v[n];}; 		
	this.single = f => {f(); return this;};	
	this.complex = (re, im) => {return this.set({"re": re, "im": im});};
	this.make_number = () => {return this.each(v => {return voodoo.make_number(v);});};	
	this.between01 = () => {return this.each(v => {return voodoo.between01(v);});};		
	this.nth = n => {var a = [], i = 0; assert(n > 0 && voodoo.is_numeric(n)); return this.each((v) => {if (i % n === 0) a.push(v); i++;}).set(a);};	
	this.filter = f => {var a = []; return this.each(v => {if (f(v)) a.push(v);}).set(a);};	
	this.concat = (a = 0) => {if (a != 0) {this.v = this.v.concat(a); return this;} var t = []; this.each(v => {return t.push(v);}); return this.set(t);};	
	this.unshift = x => {this.v.unshift(x); return this;};	
	this.push = x => {this.v.push(x); return this;};	
	this.sort = f => {this.v.sort(f); return this;};	
	
	this.find = f => {for (var i = 0, l = this.v.length; i < l; i++) if (f(this.v[i])) return i;};
	this.len = () => {return this.v.length;};
	this.shift = () => {return this.v.shift();};	
	this.pop = () => {return this.v.pop();};	
	
	// math
	
	this.plus_complex = (re, im) => {return this.each(v => {v.re += re; v.im += im;});};
	this.minus_complex = (re, im) => {return this.plus_complex(-re, -im);};
	this.unit_vector = () => {let l = 0; return this.each(v => {l += v * v;}).single(() => {l = voodoo.sqrt(l); assert(l !== 0, ERROR_DIV0);}).each(v => {return v / l;});};
	this.numerize = () => {return this.each(v => {return voodoo.to_number(v);});};
	this.sum = () => {let r = 0, s = 1; return this.each(v => {r = s ? v : r + v; s = 0;}).set(r);};
	this.multiply = (x) => {return this.each(v => {return v * x;});};
	this.plus = (x) => {return this.each(v => {return v + x;});};
	this.minus = (x) => {return this.each(v => {return v - x;});};	
	this.square = () => {return this.each(v => {return v * v;});};	
	this.cube = () => {return this.each(v => {return v * v * v;});};	
	this.dot_product = () => {let r = 0; return this.each(v => {r += v * v;}).set(r);};
	this.random = (a = 0, b = 1) => {return this.each(v => {return voodoo.random(a, b);});};
	this.divide = x => {assert(x !== 0, ERROR_DIV0); return this.each(v => {return v /= x;});};	
	this.mod = x => {assert(x !== 0, ERROR_DIV0); return this.each(v => {return v % x;});};	
	this.average = () => {let n = 0, l = 0; return this.each(v => {n += v; l++;}).single(() => {assert(l !== 0, ERROR_DIV0);}).set(n / l);};
	this.to_precision = n => {return this.each(v => {return voodoo.to_number(v).toPrecision(n);});};
	this.eval = () => {return this.each((s) => {return voodoo.eval(s);});};	
	
	// html
	
	this.attr = (a, b) => {return is_undefined(b) ? this.first().getAttribute(a) : this.each((e) => {e.setAttribute(a, b);});};		
	this.query = () => {let a = []; return this.each(v => {for (const q of document.querySelectorAll(v)) a.push(q);}).set(a);};
	this.append_html = (html) => {return this.each(e => {e.innerHTML += html;});};
	this.html = html => {return is_undefined(html) ? this.first().innerHTML : this.each((e) => {e.innerHTML = html;});};
	this.ready = (f) => {return this.each(e => {e.addEventListener('DOMContentLoaded', () => {f();});});};
	this.css = o => {return is_object(o) ? this.each(e => {each(o, (v, k) => {e.style[k] = v;});}) : this.first().style[o];};			
	this.wait = (f, ms = 100) => {return this.each(e => {return voodoo.delay(() => {f(e);}, ms);});};	
	this.interval = (f, ms = 100) => {return this.each(e => {return window.setInterval((()=>{f(e);}), ms);});};
	this.clear_timeout = () => {return this.each(x => {window.clearTimeout(x);});};	
	this.easing = easng => {	
		return this.each((e) => {
			let o = voodoo.extend({
				easing: "linear",
				time: 500,
				change: 1,
				done: () => {},
				from_value: () => {return 0;},
				set_value: () => {return 1;}
			}, easng);	
			let time_start = new Date();
			let from_value = o.from_value(voodoo(e).css(o.param));
			let change = voodoo.to_number(o.change);
			(function eas(){
				let delta = (new Date().getTime() - time_start.getTime()) / 1;
				let percentage = delta / o.time;				
				if (percentage >= 0.99) {o.done(e); return;}
				let val = from_value + change * voodoo.easing[o.easing](percentage);
				let css = {};
				css[o.param] = o.set_value(voodoo(e).css(o.param), val);
				voodoo(e).css(css);
				reqanimframe(eas);
			})();
	});};		
	this.opacity = o => {return is_undefined(o) ? voodoo.make_number(this.css("opacity")) : this.css({opacity: o});};	
	this.x = o => {return is_undefined(o) ? voodoo.make_number(this.css("left")) : this.css({position: "absolute", left: `${o}px`});};
	this.y = o => {return is_undefined(o) ? voodoo.to_number(this.css("top")) : this.css({position: "absolute", top: `${o}px`});};	
	this.anim_opacity = (p) => {return this.easing(voodoo.extend({
		easing: "ease_in_elastic", 
		time: 1000, 
		param: "opacity", 
		change: 1,
		set_value: (s, x) => {return voodoo.to_number(x);},
		from_value: x => {return voodoo.to_number(x);}}, p));};
	this.anim_x = p => {return this.easing(voodoo.extend({
		easing: "ease_in_elastic", 
		time: 1000, 
		param: "transform", 
		change: 100,
		set_value: (s, x) => {
			x = voodoo.floor(x);
			let r = /(translateX\(-?\d+px\))/g;
			let v = `translateX(${x}px)`;
			return (r.exec(s)) ? s.replace(r, v) : `${s} ${v}`;
		},
		from_value: x => {
			let t = /translateX\((-?\d+)px\)/g.exec(x);
			return (t && t[1]) ? voodoo.to_number(t[1]) : 0;
		}}, p));};		
	this.anim_y = p => {return this.easing(voodoo.extend({
		easing: "ease_in_elastic", 
		time: 1000, 
		param: "transform", 
		change: 100,
		set_value: (s, x) => {
			x = voodoo.floor(x);
			let r = /(translateY\(-?\d+px\))/g;
			let v = `translateY(${x}px)`;
			return (r.exec(s)) ? s.replace(r, v) : `${s} ${v}`;
		},
		from_value: x => {
			let t = /translateY\((-?\d+)px\)/g.exec(x);
			return (t && t[1]) ? voodoo.to_number(t[1]) : 0;
		}}, p));};
	this.shake = o2 => {
		let o = voodoo.extend({dir: "x"}, o2);
		return this.each((e) => {
			let satr = voodoo(e).attr("style") || ""; // FIXME
			let f1 = (e, n) => {
				if (n>10) {voodoo(e).attr("style", satr); return;}
				if (o.dir == "x")
					voodoo(e).anim_x({easing:"linear", done:()=>{f1(e, n + 1);}, time: 55, change: n%2===0?15:-15});
				else 
					voodoo(e).anim_y({easing:"linear", done:()=>{f1(e, n + 1);}, time: 55, change: n%2===0?15:-15});
			};
			f1(e, 1);});};	
	this.shake_x = () => {return this.shake({dir:"x"});};
	this.shake_y = () => {return this.shake({dir:"y"});};
	this.anim_rotate = (p) => {return this.easing(voodoo.extend({
		easing: "ease_in_elastic", 
		time: 1000, 
		param: "transform", 
		change: 90,
		set_value: (s, x) => {
			x = voodoo.floor(x);
			let r = /(rotate\(-?\d+deg\))/g;
			let v = `rotate(${x}deg)`;
			return (r.exec(s)) ? s.replace(r, v) : `${s} ${v}`;
		},
		from_value: (x) => {
			let t = /rotate\((-?\d+)deg\)/g.exec(x);
			return (t && t[1]) ? voodoo.to_number(t[1]) : 0;
		}}, p));};		
	this.fade_toggle = (p) => {
		return this.each((e) => {
			let t = voodoo.make_number(voodoo(e).css("opacity"));
			if (t < 0.1) voodoo(e).anim_opacity(voodoo.extend({change: 1 - t}, p));
			else voodoo(e).anim_opacity(voodoo.extend({change: -t}, p));			
		});
	};				
	this.toggle = () => {return this.css("display") == "none" ? this.css({display: "block"}) : this.css({display: "none"});};		
	function voodoo_fadeinout(e, p, out) {
		let opa = voodoo(voodoo(e).css("opacity")).make_number().between01().first(); 
		let o = voodoo.extend({change: out ? -opa : 1 - opa}, p); 
		if (voodoo.own_property(p, "fade_to")) o.change = p.fade_to - opa;
		voodoo(e).anim_opacity(o);
	}
	this.fade_out = p => {return this.each((e) => {voodoo_fadeinout(e, p, 1);});};
	this.fade_in = p => {return this.each((e) => {voodoo_fadeinout(e, p, 0);});};
	this.hide = () => {return this.css({display: "none"});};
	this.show = () => {return this.css({display: "block"});};	
	this.event = (action, f) => {return this.each((t) => {t.addEventListener(action, f);});};		
	this.click = f => {return this.event("click", f);};			
	this.has_class = n => {return has_class(this.first(), n);};
	this.toggle_class = n => {return this.each((e) => {if (has_class(e, n)) remove_class(e, n); else add_class(e, n);});};
	this.add_class = n => {return this.each((e) => {add_class(e, n);});};
	this.remove_class = n => {return this.each((e) => {remove_class(e, n);});};	
	this.draggable = o2 => {return this.each((e) => {
		let o = voodoo.extend({init:()=>{}}, o2);
		e.setAttribute("draggable", "true");	
		let f1 = "__f" + voodoo.floor(voodoo.random(1000, 100000));
		voodoo[f1] = ev => {o.init(ev); ev.dataTransfer.setData("text", ev.target.id);};	
		e.setAttribute("ondragstart", `voodoo["${f1}"](event)`);
	});};	
	this.droppable = o2 => {return this.each((e) => {
		let o = voodoo.extend({init:()=>{}, over:()=>{}, done:(ev)=>{ev.target.appendChild(document.getElementById(ev.dataTransfer.getData("text")));}}, o2);
		let f1 = "__f" + voodoo.floor(voodoo.random(1000, 100000));	
		voodoo[f1] = (ev)=>{o.over(ev); ev.preventDefault();};
		e.setAttribute("ondragover", `voodoo["${f1}"](event)`);
		let f2 = "__f" + voodoo.floor(voodoo.random(1000, 100000));	
		voodoo[f2] = (ev)=>{ev.preventDefault(); o.done(ev);};			
		e.setAttribute("ondrop", `voodoo["${f2}"](event)`);		
	});};
	
} 
 	 
voodoo = v => {return new Voodoo().set(v);};
["floor", "ceil", "round", "sin", "cos", "asin", "acos", "atan", "pow", "exp", "sqrt"].forEach((x)=>{
	voodoo[x] = Math[x];
	Voodoo.prototype[x] = function() {return this.each(v => {return voodoo[x](v);});};		
});
voodoo.abs = x => {return x < 0 ? -x : x;}; 	
voodoo.max = (a, b) => {return a > b ? a : b;}; 	
voodoo.min = (a, b) => {return a < b ? a : b;}; 
voodoo.proto = Voodoo.prototype;
["abs", "max", "min"].forEach(x => {Voodoo.prototype[x] = function() {return this.each(v => {return voodoo[x](v);});};});
voodoo.PHI = 1.618033988749895;
["E","LN2","LN10","LOG2E","LOG10E","PI","SQRT1_2","SQRT2"].forEach(x=>voodoo[x]=Math[x]);
voodoo.id = () => {return `${NAME} ${VERSION} by ${AUTHOR}`;};
voodoo.ID = voodoo.id();
voodoo.NAME = NAME;
voodoo.VERSION = VERSION;
voodoo.AUTHOR = AUTHOR;
voodoo.NDEBUG = NDEBUG;
voodoo.print = print;
voodoo.vassert = vassert;
voodoo.assert = assert;
voodoo.error = error;
voodoo.deep_copy = deep_copy;
voodoo.each = each;
voodoo.extend = extend;
voodoo.easing = {
	// https://gist.github.com/gre/1650294
	linear: t => {return t;},
	ease_in_quad: t => {return t*t;},
	ease_out_quad: t => {return t*(2-t);},
	ease_in_out_quad: t => {return t<0.5?2*t*t:-1+(4-2*t)*t;},
	ease_in_cubic: t => {return t*t*t;},
	ease_out_cubic: t => {return (--t)*t*t+1;},
	ease_in_out_cubic: t => {return t<0.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1;},
	ease_in_quart: t => {return t*t*t*t;},
	ease_out_quart: t => {return 1-(--t)*t*t*t;},
	ease_in_out_quart: t => {return t<0.5?8*t*t*t*t:1-8*(--t)*t*t*t;},
	ease_in_quint: t => {return t*t*t*t*t;},
	ease_out_quint: t => {return 1+(--t)*t*t*t*t;},
	ease_in_out_quint: t => {return t<0.5?16*t*t*t*t*t:1+16*(--t)*t*t*t*t;},
	ease_in_elastic: t => {return (0.04-0.04/t)*voodoo.sin(25*t) + 1;},
	ease_out_elastic: t => {return 0.04*t/(--t)*voodoo.sin(25 * t);},
	ease_in_out_elastic: t => {return (t-=0.5)<0?(0.02+0.01/t)*voodoo.sin(50*t):(0.02-0.01/t)*voodoo.sin(50*t)+1;}
};
voodoo.range = (a, b) => {var t = []; for (let i = a; i <= b; i++) t.push(i); return t;};
voodoo.between01 = x => {return voodoo.max(0, voodoo.min(1, x));}; 	
voodoo.random = (a = 0, b = 1) => {if (b < a) {[a, b] = [b, a];} return a + (b - a) * Math.random();}; 	
voodoo.delta = (a, b) => {return voodoo.abs(a) < b ? 1 : 0;}; 	
voodoo.square = x => {return x * x;}; 	
voodoo.cube = x => {return x * x * x;}; 
voodoo.to_number = s => {return +s;};
voodoo.make_number = s => {			
	let t = /^[\-]?\d*\.?\d+/g.exec(s);
	return (t && t[0]) ? voodoo.to_number(t[0]) : 0;
};
voodoo.own_property = (o, x) => {return voodoo.is_object(o) && o.hasOwnProperty(x) ? 1 : 0;};
voodoo.array_last = a => {return a.length ? a[a.length - 1] : a;};
voodoo.array_contains = (a, v) => {return a.indexOf(v) === -1 ? 0 : 1;};
voodoo.string_contains = (s, x) => {return s.indexOf(x) > -1 ? 1 : 0;};
voodoo.merge = (a, b) => {return a.concat(b);};
voodoo.time_since = time_since;
voodoo.is_numeric = n => {return !isNaN(parseFloat(n)) && isFinite(n);}; // https://stackoverflow.com/a/9716488
voodoo.is_array = is_array;
voodoo.is_object = is_object;
voodoo.is_undefined = is_undefined;
voodoo.get_keys = get_keys;
voodoo.get_values = get_values;
voodoo.to_json = x => {return JSON.parse(x);};
voodoo.stringify_json = (x)=>{return JSON.stringify(x);};
voodoo.eval = s => {return (new Evaluator(s)).eval();};
voodoo.seconds = () => {return (new Date()).getSeconds();};
voodoo.minutes = () => {return (new Date()).getMinutes();};
voodoo.hours = () => {return (new Date()).getHours();};		
voodoo.stringify_complex = (c) => {return `${c.re} ${c.im}i`;};	
voodoo.delay = (f, ms = 100, errorf = error) => {var id = 0; new Promise((resolve, reject) => {id = window.setTimeout(resolve, ms);}).then(x => f(x)).catch(e => errorf()); return id;};
voodoo.ajax = o2 => {
	let o = voodoo.extend({type: "GET", success: ()=>{}}, o2);
	let r = new XMLHttpRequest(); 
	r.open(o.type, o.url, true);
	r.onreadystatechange = () => {
	if (r.readyState != 4 || r.status != 200) return; 
	o.success(r.responseText);}; 
	r.send(o.data);
};

if (!NDEBUG) print(voodoo.id());

})();
