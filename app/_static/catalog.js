
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory() : typeof define === 'function' && define.amd
    ? define(factory) : (global.Catalog = factory());
}(this, function(){ 'use strict';
  var addMethod = function(t, k, f) {
    Object.defineProperty(t.prototype, k, { key: k, value: f,
      enumerable: false, configurable: true, writable: true, });
  }

  var Catalog = function() {
    function Catalog(container, body) {
      this.containerClass = container;
      this.container = document.getElementsByClassName(this.containerClass)[0];
      if (!this.container) { alert('Element ' + container + ' not exist!'); }

      this.bodyClass = body;
      this.body = document.getElementsByClassName(this.bodyClass)[0];
      if (!this.body) { alert('Element ' + body + ' not exist!'); }
    };

    addMethod(Catalog, 'refresh', function() {
      var currentDeep = 0;
      var html = '';
      var nodes = this.body.childNodes;
      var nodesLen = nodes.length;
      this.headers = [];
      for (var i = 0; i < nodesLen; i++) {
        var n = nodes[i];
        if (n.tagName !== undefined && n.tagName[0] === 'H' && !isNaN(n.tagName[1])) {
          this.headers.push(n);
        }
      }
      var headersLen = this.headers.length;
      for (var i = 0; i < headersLen; i++) {
        var h = this.headers[i];
        var deep = h.tagName[1];
        if (deep !== currentDeep) {
          for (var j = 0; j < (deep > currentDeep ? deep - currentDeep
            : currentDeep - deep); j++) {
            html += deep > currentDeep ? '<ul>' : '</ul></li>';
          }
          currentDeep = deep;
        } else { html += '</li>'; }
        html += '<li><a id="catalog_header_' + i + '" href="';
        html += h.getElementsByTagName('a')[0].getAttribute('href');
        html += '">' + h.innerText + '</a>';
      }
      while (currentDeep > 0) { html += '</ul></li>'; currentDeep--; }
      this.container.innerHTML = html;

      this.currentHeaderIdx = -1;
      this.highlightCurrentHeader();
    });

    addMethod(Catalog, 'highlightCurrentHeader', function() {
      var headersLen = this.headers.length;
      if (headersLen === 0) { return; }
      if (this.currentHeaderIdx == undefined || this.currentHeaderIdx >= 0) {
        try {
          var top = this.headers[this.currentHeaderIdx]
            .getBoundingClientRect().top;
          var ofs = top - this.currentHeaderTop;
          if (ofs > -80 && ofs < 80) { return; }
          this.currentHeaderEle.style.color = '';
          this.currentHeaderEle.style.fontWeight = '';
        } catch(e) { this.currentHeaderIdx = -1; return; }
      }
      var clientHeight = document.documentElement.clientHeight;
      var minTop = 0;
      var lastTop = 0;
      var i = 0;
      for (; i < headersLen; i++) {
        var top = this.headers[i].getBoundingClientRect().top;
        var abs = top < 0 ? -top : top;
        if (i === 0) { minTop = abs; }
        if (abs > minTop) {
          if (i > 0 && (i < (headersLen - 1) || top > clientHeight)) { i--; }
          if (i > 0 && (i < (headersLen - 1) && lastTop > clientHeight / 2)) { i--; }
          break;
        }
        minTop = abs;
        lastTop = top;
      }
      if (i >= headersLen) { i = headersLen - 1; }
      this.currentHeaderEle = document.getElementById('catalog_header_' + i);
      if (!this.currentHeaderEle) { this.currentHeaderIdx = -1; return; }
      this.currentHeaderEle.style.color = 'orangered';
      this.currentHeaderEle.style.fontWeight = 'bolder';
      this.currentHeaderIdx = i;
      this.currentHeaderTop = this.headers[i].getBoundingClientRect().top;
    });

    return Catalog;
  }();
  return Catalog;
}))

