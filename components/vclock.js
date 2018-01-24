/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3

usage:
voodoo("#wrapper").query().jsclock({use_dots:1, len:50, x:100, y:100, hour_add:4, text: "Kolkata"});
*/

(() => {
function vclock(o2) {
	var o = voodoo.extend({
		len:50, 
		use_dots:0, 
		x:110, 
		y:110, 
		hour_add:0,
		second_color:"#A0522D",
		minute_color:"#DEB887",
		hour_color:"#FF4500",
		dot_style:"width:2px;height:2px;background-color:#000;"
	}, o2);
	const LEN=o.len;
	const POSY=2*LEN;
	const POSX=2*LEN;
	const X=o.x;
	const Y=o.y;
	const id = voodoo.floor(voodoo.random(10, 1100));
	const idhandseconds = `asd1_${id}`;
	const idhandminutes = `as2d_${id}`;
	const idhandhours = `asd3_${id}`;
	const idwrapper = `asd4_${id}`;				
	const ELEM = o.elem;								
	const secw = voodoo.max(2, voodoo.floor(LEN*0.94));
	const minw = voodoo.max(2, voodoo.floor(LEN*0.8));
	const houw = voodoo.max(2, voodoo.floor(LEN*0.65));
	const sech = voodoo.max(2, voodoo.floor(LEN*0.05));
	const clock_font_size = voodoo.max(2, voodoo.floor(LEN / 10));
	const minh = sech;
	const houh = sech;
	
	function create_style() {
		voodoo("head").query().append_html(`<style>
			#${idhandseconds} {z-index:112;width:${secw}px;height:${sech}px;background:${o.second_color};}			
			#${idhandminutes} {z-index:111;width:${minw}px;height:${minh}px;background:${o.minute_color};}			
			#${idhandhours} {z-index:110;width:${houw}px;height:${houh}px;background:${o.hour_color};}
		</style>`);
	}
				
	function create_hands() {					
		voodoo(ELEM).append_html(`
			<div id=${idhandseconds}></div>
			<div id=${idhandminutes}></div>
			<div id=${idhandhours}></div>`);
	}			
	
	function create_nums() {
		var j = 3;
		for (var i = 0; i < 12; i++) {
			let x = voodoo.floor(X+LEN*voodoo.cos(2*voodoo.PI*i/12.0));
			let y = voodoo.floor(Y+LEN*voodoo.sin(2*voodoo.PI*i/12.0));
			let s = `<div style="position:absolute;left:${voodoo.floor(x-clock_font_size/2)}px;
				top:${voodoo.floor(y-clock_font_size/2)}px;font:${clock_font_size}px arial, sans-serif;">${j}</div>`;
			let s2 = `<div style="position:absolute;left:${voodoo.floor(x)}px;
				top:${voodoo.floor(y)}px;font:${clock_font_size}px arial, sans-serif; ${o.dot_style} "></div>`;
			j++;
			if (j==13)j=1;						
			if (o.use_dots) voodoo(ELEM).append_html(s2);					
			else voodoo(ELEM).append_html(s);
		}
	}

	function create_seconds() {
		let d = new Date();
		let t = (voodoo.seconds()) / (60);
		let deg = voodoo.floor(360*t)%360;
		voodoo(`#${idhandseconds}`)
			.query()
			.css({transformOrigin: "0 0"})
			.css({position: "absolute", left: `${X}px`, top: `${Y}px`})
			.anim_rotate({time: 500, change: deg-90})
			.interval((e) => {voodoo(e).anim_rotate({time: 500, change: (360 / 60)});}, 1000)
			;
	}
	
	function create_minutes() {
		let d = new Date();
		let t = (60*voodoo.minutes()+voodoo.seconds()) / (60*60);
		let deg = voodoo.floor(360*t)%360;			
		voodoo(`#${idhandminutes}`)
			.query()
			.css({transformOrigin: "0 0"})
			.css({position: "absolute", left: `${X}px`, top: `${Y}px`})
			.anim_rotate({time: 500, change: deg-90})
			.interval((e) => {voodoo(e).anim_rotate({time: 500, change: (360 / 60)});}, 60*1000)
			;
	}
	
	function create_hours() {
		var d = new Date();
		var t = (60*60*((voodoo.hours()+o.hour_add)%12)+60*voodoo.minutes()+voodoo.seconds()) / (12*60*60);
		var deg = voodoo.floor(360*t)%360;			
		voodoo(`#${idhandhours}`)
			.query()
			.css({transformOrigin: "0 0"})
			.css({position: "absolute", left: `${X}px`, top: `${Y}px`})
			.anim_rotate({time: 500, change: deg-90})
			.interval((e) => {voodoo(e).anim_rotate({time: 500, change: (360 / (12*60))});}, 60*1000)
			;
	}
	
	function create_text() {
		if (voodoo.is_undefined(o.text)) return;
		voodoo(ELEM).append_html(`<div style="position:absolute;left:${voodoo.floor(X-.35*LEN)}px;top:${Y-LEN - 20}px;font:${2*clock_font_size}px arial, sans-serif;">${o.text}</div>`);
	}
	
	create_text();
	create_hands();
	create_style();
	create_nums();
	create_minutes();
	create_hours();				
	create_seconds();
}
vclock.VERSION = 0.2;

function create_elem(f) {
	const nn = `ert${voodoo.floor(voodoo.random(10, 1100))}`;
	voodoo("body").query().append_html(`<div id="${nn}"></div>`);
	voodoo.delay(() => {f(0, `#${nn}`);}, 3); // 3ms delay to let the DOM sink in...
};	
function create_elem_promised() {return new Promise((resolve, reject) => {create_elem((error, data) => {if (error) reject(error); else resolve(data);});});}

async function create_elem2() {const x = await create_elem_promised(); return x;}

voodoo.proto.vclock = function(o) {return this.each((e) => {
	create_elem_promised().then(text => {vclock(voodoo.extend({elem: voodoo(text).query().get()}, o));}).catch(error => {voodoo.error(error);});
})};

})();
