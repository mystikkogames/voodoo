/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
(() => {

voodoo.proto.vtext_highlighter = function(text, color="#ffff99") {
	return this.each(e => {
		if (voodoo.is_object(text)) voodoo(e).html(voodoo(e).html().replace(text, ["<span style=\"background:", color, "\">$1</span>"].join("")));
		else voodoo(e).html(voodoo(e).html().replace(text, `<span style="background:${color}">${text}</span>`));
	});
};

})();
