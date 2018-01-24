/*
voodoo.js - A lightweight JavaScript library
language: JavaScript
author: mystikkogames ( mystikkogames@protonmail.com )
license: GPLv3
*/
/*
this is a copy from here
http://snipplr.com/view/470/javascript-cookies/
*/

(() => {


/**
 * Sets a Cookie with the given name and value.
 *
 * name       Name of the cookie
 * value      Value of the cookie
 * [expires]  Expiration date of the cookie (default: end of current session)
 * [path]     Path where the cookie is valid (default: path of calling document)
 * [domain]   Domain where the cookie is valid
 *              (default: domain of calling document)
 * [secure]   Boolean value indicating if the cookie transmission requires a
 *              secure transmission
 */
function setCookie(name, value, expires, path, domain, secure) {
    voodoo.assert(name !== null);
    voodoo.assert(value !== null);

/*
    voodoo.print("-->", name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : ""));
*/

    document.cookie = name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

/**
 * Gets the value of the specified cookie.
 *
 * name  Name of the desired cookie.
 *
 * Returns a string containing value of specified cookie,
 *   or null if cookie does not exist.
 */
function getCookie(name) {
    voodoo.assert(name !== null);
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

/**
 * Deletes the specified cookie.
 *
 * name      name of the cookie
 * [path]    path of the cookie (must be same as path used to create cookie)
 * [domain]  domain of the cookie (must be same as domain used to create cookie)
 */
function deleteCookie(name, path, domain) {
    voodoo.assert(name !== null);
    if (getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

voodoo.proto.vocookie = function() {
    //if (this.v.length == 1 && this.first().action == "get") return getCookie(this.first().name);
    return this.each((opts) => {
        var o = voodoo.extend({action: "get", name: null, value: null, expires: null, path: null, domain: null, secure: null, f: () => {}}, opts); 
        o.f(o);
        switch (o.action) {
            case "delete": deleteCookie(o.name, o.path, o.domain); break;
            case "set": setCookie(o.name, o.value, o.expires, o.path, o.domain, o.secure); break;
            case "get": return getCookie(o.name); break;
            default: voodoo.assert("vocookie.js error: Bad action!");
        }
    });
};

})();
