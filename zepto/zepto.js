/* Zepto 1.1.0 - zepto detect event ajax form fx assets data selector ie - zeptojs.com/license */


var Zepto = (function() {
  var _isIE = /MSIE/.test(navigator.userAgent);
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]*)$/,
    tagSelectorRE = /^[\w-]+$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = $.fn
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (isDocument(element) && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = function(parent, node) {
    return parent !== node && parent.contains(node)
  }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className,
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    var num
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          !isNaN(num = Number(value)) ? num :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return arguments.length === 0 ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return arguments.length === 0 ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] && this[0][name]) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return arguments.length === 0 ?
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(o){ return this.selected }).pluck('value') :
           this[0].value)
        ) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      /**
       * addisonxue hacked
       * add MSIE Css3 support
       * modify -webkit- prefix with -ms-
       */
      if(_isIE){
        if (typeof property == 'string' && property.indexOf('-webkit-') == 0) {
          property = '-ms-' + property.substring(8);
        } else if (typeof property == 'object') {
          var _pro = {};
          for ( var p in property) {
            if (p.indexOf('-webkit-') == 0) {
              _pro['-ms-' + p.substring(8)] = property[p];
            } else {
              _pro[p] = property[p];
            }
          }
          property = _pro;
        }
      }
      
      if (arguments.length < 2) {
        var element = this[0], computedStyle = getComputedStyle(element, '')
        if(!element) return
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(isArray(property) ? property: [property], function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          traverseNode(parent.insertBefore(node, target), function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)

;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android);?\s+([\d.]+)?/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
      bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
      rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
      playbook = ua.match(/PlayBook/),
      chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
      firefox = ua.match(/Firefox\/([\d.]+)/),
      ie = ua.match(/MSIE ([\d.]+)/),
      safari = webkit && ua.match(/Mobile\//) && !chrome,
      webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
      ie = ua.match(/MSIE\s([\d.]+)/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true
    if (webview) browser.webview = true
    if (ie) browser.ie = true, browser.version = ie[1]

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
      (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
      (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
      (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)

;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents = {}, hover = {
    mouseenter : 'mouseover',
    mouseleave : 'mouseout',
    /**
     * addisonxue hacked
     * add MSIE msPointer event support
     */
    touchstart : window.navigator.msPointerEnabled ? 'MSPointerDown' : 'touchstart',
    touchmove : window.navigator.msPointerEnabled ? 'MSPointerMove' : 'touchmove',
    touchend : window.navigator.msPointerEnabled ? 'MSPointerCancel' : 'touchend',
    touchcancel : window.navigator.msPointerEnabled ? 'MSPointerCancel' : 'touchcancel'
  }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.type(events) != "string") $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (handler.e == 'focus' || handler.e == 'blur') ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || type
  }

  function add(element, events, fn, selector, getDelegate, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = getDelegate && getDelegate(fn, event)
      var callback  = handler.del || fn
      handler.proxy = function(e){
        var result = callback.apply(element, [e].concat(e.data))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function(){
        event.defaultPrevented = true
        prevent.call(event)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      })
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.bind(event, selector || callback) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return !selector || $.isFunction(selector) ?
      this.unbind(event, selector || callback) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      if('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, data)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return callback ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else this.each(function(){
        try { this[name]() }
        catch(e) {}
      })
      return this
    }
  })

  $.Event = function(type, props) {
    if (typeof type != 'string') props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    event.isDefaultPrevented = function(){ return event.defaultPrevented }
    return event
  }

})(Zepto)

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      cleanup = function() {
        clearTimeout(abortTimeout)
        $(script).remove()
        delete window[callbackName]
      },
      abort = function(type){
        cleanup()
        // In case of manual abort or timeout, keep an empty function as callback
        // so that the SCRIPT tag that eventually loads won't result in an error.
        if (!type || type == 'timeout') window[callbackName] = empty
        ajaxError(null, type || 'abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return false
    }

    window[callbackName] = window[callbackName] || function(data){
      cleanup()
      ajaxSuccess(data, xhr, options)
    }

    script.onerror = function() { abort('error') }
    
    //add script charset support
    if (options.charset){ script.charset = options.charset;}
    
    script.src = options.url.replace(/=\?/, '=' + callbackName)
    
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)
    if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder){
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : (settings.url.indexOf('callback=') > -1 ? '' : 'callback=?'))
        var A_callback = settings.url.match(new RegExp((settings.jsonp ? settings.jsonp : 'callback') + '=(\\w+)','i'));
        if(A_callback && A_callback.length >= 2){
          settings.jsonpCallback = A_callback[1];
        }
      }
      return $.ajaxJSONP(settings)
    }

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    /**
     * addisonxue hacked
     * add CORS support, detail for http://www.w3.org/TR/cors/
     */
    if (settings.withCredentials) {
      try{
        xhr.withCredentials = true;
      } catch (e) {
      }
    }
    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    var hasData = !$.isFunction(data)
    return {
      url:      url,
      charset:  hasData && data && data.charset ? data.charset : undefined,
      data:     hasData  ? data : undefined,
      success:  !hasData ? data : $.isFunction(success) ? success : undefined,
      dataType: hasData  ? dataType || success : success
    }
  }

  $.get = function(url, data, success, dataType){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(url, data, success, dataType){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(url, data, success){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }
  //alias to $.getJSON, but it`s a jsonp, means that accept a pure string request not include 'callback=?'
  $.getScript = function(url, success, charset){
    if(typeof(success) == 'string' && charset == null){
      charset = success;
      success = null;
    }
    return $.ajax({
      url:      url,
      type:     'GET',
      charset:  charset,
      data:     undefined,
      success:  success,
      dataType: 'jsonp'
    })
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)

;(function ($) {
  $.fn.serializeArray = function() {
    var result = [], el
    $([].slice.call(this.get(0).elements)).each(function(){
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function(){
    var result = []
    this.serializeArray().forEach(function(elm){
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
    })
    return result.join('&')
  }

  $.fn.submit = function(callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)

;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    transform,
    transitionProperty, transitionDuration, transitionTiming, transitionDelay,
    animationName, animationDuration, animationTiming, animationDelay,
    cssReset = {}

  function dasherize(str) { return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : name.toLowerCase() }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + vendor.toLowerCase() + '-'
      eventPrefix = event
      return false
    }
  })

  transform = prefix + 'transform'
  cssReset[transitionProperty = prefix + 'transition-property'] =
  cssReset[transitionDuration = prefix + 'transition-duration'] =
  cssReset[transitionDelay    = prefix + 'transition-delay'] =
  cssReset[transitionTiming   = prefix + 'transition-timing-function'] =
  cssReset[animationName      = prefix + 'animation-name'] =
  cssReset[animationDuration  = prefix + 'animation-duration'] =
  cssReset[animationDelay     = prefix + 'animation-delay'] =
  cssReset[animationTiming    = prefix + 'animation-timing-function'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    speeds: { _default: 400, fast: 200, slow: 600 },
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback, delay){
    if ($.isPlainObject(duration))
      ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
    if (duration) duration = (typeof duration == 'number' ? duration :
                    ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
    if (delay) delay = parseFloat(delay) / 1000
    return this.anim(properties, duration, ease, callback, delay)
  }

  $.fn.anim = function(properties, duration, ease, callback, delay){
    /**
     * addisonxue hacked
     * add MSIE Css3 support
     * modify -webkit- prefix with -ms-
     */
    if(/MSIE/.test(navigator.userAgent)){
      if (typeof properties == 'string' && properties.indexOf('-webkit-') == 0) {
        properties = '-ms-' + properties.substring(8);
      } else if (typeof properties == 'object') {
        var _pro = {};
        for ( var p in properties) {
          if (p.indexOf('-webkit-') == 0) {
            _pro['-ms-' + p.substring(8)] = properties[p];
          } else {
            _pro[p] = properties[p];
          }
        }
        properties = _pro;
      }
    }
    
    var key, cssValues = {}, cssProperties, transforms = '',
        that = this, wrappedCallback, endEvent = $.fx.transitionEnd

    if (duration === undefined) duration = 0.4
    if (delay === undefined) delay = 0
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssValues[animationName] = properties
      cssValues[animationDuration] = duration + 's'
      cssValues[animationDelay] = delay + 's'
      cssValues[animationTiming] = (ease || 'linear')
      endEvent = $.fx.animationEnd
    } else {
      cssProperties = []
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
        else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

      if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
      if (duration > 0 && typeof properties === 'object') {
        cssValues[transitionProperty] = cssProperties.join(', ')
        cssValues[transitionDuration] = duration + 's'
        cssValues[transitionDelay] = delay + 's'
        cssValues[transitionTiming] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, wrappedCallback)
      }
      $(this).css(cssReset)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    // trigger page reflow so new elements can animate
    this.size() && this.get(0).clientLeft

    this.css(cssValues)

    if (duration <= 0) setTimeout(function() {
      that.each(function(){ wrappedCallback.call(this) })
    }, 0)

    return this
  }

  testEl = null
})(Zepto)

;(function($){
  var cache = [], timeout

  $.fn.remove = function(){
    return this.each(function(){
      if(this.parentNode){
        if(this.tagName === 'IMG'){
          cache.push(this)
          this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
          if (timeout) clearTimeout(timeout)
          timeout = setTimeout(function(){ cache = [] }, 60000)
        }
        this.parentNode.removeChild(this)
      }
    })
  }
})(Zepto)

;(function($) {
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        this.length == 0 ? undefined : getData(this[0], name) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names, function(){ delete store[camelize(this)] })
    })
  }
})(Zepto)

;(function($){
  var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  // Implements a subset from:
  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
  //
  // Each filter function receives the current index, all nodes in the
  // considered set, and a value if there were parentheses. The value
  // of `this` is the node currently being considered. The function returns the
  // resulting node(s), null, or undefined.
  //
  // Complex selectors are not supported:
  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
  //   ul.inner:first > li
  var filters = $.expr[':'] = {
    visible:  function(){ if (visible(this)) return this },
    hidden:   function(){ if (!visible(this)) return this },
    selected: function(){ if (this.selected) return this },
    checked:  function(){ if (this.checked) return this },
    parent:   function(){ return this.parentNode },
    first:    function(idx){ if (idx === 0) return this },
    last:     function(idx, nodes){ if (idx === nodes.length - 1) return this },
    eq:       function(idx, _, value){ if (idx === value) return this },
    contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
    has:      function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
  }

  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
      childRe  = /^\s*>/,
      classTag = 'Zepto' + (+new Date())

  function process(sel, fn) {
    // quote the hash in `a[href^=#]` expression
    sel = sel.replace(/=#\]/g, '="#"]')
    var filter, arg, match = filterRe.exec(sel)
    if (match && match[2] in filters) {
      filter = filters[match[2]], arg = match[3]
      sel = match[1]
      if (arg) {
        var num = Number(arg)
        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
        else arg = num
      }
    }
    return fn(sel, filter, arg)
  }

  zepto.qsa = function(node, selector) {
    return process(selector, function(sel, filter, arg){
      try {
        var taggedParent
        if (!sel && filter) sel = '*'
        else if (childRe.test(sel))
          // support "> *" child queries by tagging the parent node with a
          // unique class and prepending that classname onto the selector
          taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel

        var nodes = oldQsa(node, sel)
      } catch(e) {
        console.error('error performing selector: %o', selector)
        throw e
      } finally {
        if (taggedParent) taggedParent.removeClass(classTag)
      }
      return !filter ? nodes :
        zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
    })
  }

  zepto.matches = function(node, selector){
    return process(selector, function(sel, filter, arg){
      return (!sel || oldMatches(node, sel)) &&
        (!filter || filter.call(node, null, arg) === node)
    })
  }
})(Zepto)

;(function($){
  /*
  Riot.js 0.9.4 | moot.it/riotjs | @license MIT
  (c) 2013 Tero Piirainen, Moot Inc and other contributors.
 */
  var top = window;

  // avoid multiple execution. popstate should be fired only once etc.
  if ($.riot) return;

  $.riot = "0.9.4";

  function isFunction(el) {
    return Object.prototype.toString.call(el) == '[object Function]';
  }

  $.observable = function(el) {
    var callbacks = {},
      slice = [].slice;

    el.on = function(events, fn) {
      if (isFunction(fn)) {
        events = events.split(/\s+/);
        for (var i = 0, len = events.length, type; i < len; i++) {
          type = events[i];
          (callbacks[type] = callbacks[type] || []).push(fn);
          if (len > 1) fn.typed = true;
        }
      }
      return el;
    };

    el.off = function(events) {
      events = events.split(/\s+/);

      for (var i = 0; i < events.length; i++) {
        callbacks[events[i]] = [];
      }

      return el;
    };

    // only single event supported
    el.one = function(type, fn) {

      if (isFunction(fn)) {
        fn.one = true;
        el.on(type, fn);
      }

      return el;

    };

    el.trigger = function(type) {
      // console.log(type);
      var args = slice.call(arguments, 1),
        fns = callbacks[type] || [];

      for (var i = 0, fn; i < fns.length; ++i) {
        fn = fns[i];

        if (fn.one && fn.done) continue;

        // add event argument when multiple listeners
        fn.apply(el, fn.typed ? [type].concat(args) : args);

        fn.done = true;
      }

      return el;
    };

    return el;

  };

  // emit window.popstate event consistently on page load, on every browser
  var page_popped,
    fn = $.observable({});

  function pop(hash) {
    fn.trigger("pop", hash || location.hash);
  }

  function on(event, fn) {
    // console.log(event);
    // console.log(fn);
    top.addEventListener(event, fn, false);
  }

  on("load", function() {
    setTimeout(function() { page_popped || pop(); }, 1);
  });

  on("popstate", function(e) {
    if (!page_popped) page_popped = true;
    pop();
  });
  var exist = {};
  // Change the browser URL or listen to changes on the URL
  $.route = function(to) {
    if(typeof to === 'string') exist[to] = true;
    // listen
    if (isFunction(to)) {
      fn.on("pop", to);
    // fire
    } else if (to != location.hash) {
      if (history.pushState) history.pushState("", "", to);
      pop(to);
    }else{
      pop(to);
    }
  };
  $.routeExist = function(to){
    if(exist[to] !== undefined){
      return true
    }
    return false;
  }
})(Zepto)

;(function($){
  var Hammer = function(element, options) {
    return new Hammer.Instance(element, options || {});
  };

  // default settings
  Hammer.defaults = {
    // add styles and attributes to the element to prevent the browser from doing
    // its native behavior. this doesnt prevent the scrolling, but cancels
    // the contextmenu, tap highlighting etc
    // set to false to disable this
    stop_browser_behavior: {
      // this also triggers onselectstart=false for IE
      userSelect       : 'none',
      // this makes the element blocking in IE10 >, you could experiment with the value
      // see for more options this issue; https://github.com/EightMedia/hammer.js/issues/241
      touchAction      : 'none',
      touchCallout     : 'none',
      contentZooming   : 'none',
      userDrag         : 'none',
      tapHighlightColor: 'rgba(0,0,0,0)'
    }

    //
    // more settings are defined per gesture at gestures.js
    //
  };

  // detect touchevents
  Hammer.HAS_POINTEREVENTS = window.navigator.pointerEnabled || window.navigator.msPointerEnabled;
  Hammer.HAS_TOUCHEVENTS = ('ontouchstart' in window);

  // dont use mouseevents on mobile devices
  Hammer.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
  Hammer.NO_MOUSEEVENTS = Hammer.HAS_TOUCHEVENTS && window.navigator.userAgent.match(Hammer.MOBILE_REGEX);

  // eventtypes per touchevent (start, move, end)
  // are filled by Hammer.event.determineEventTypes on setup
  Hammer.EVENT_TYPES = {};

  // direction defines
  Hammer.DIRECTION_DOWN = 'down';
  Hammer.DIRECTION_LEFT = 'left';
  Hammer.DIRECTION_UP = 'up';
  Hammer.DIRECTION_RIGHT = 'right';

  // pointer type
  Hammer.POINTER_MOUSE = 'mouse';
  Hammer.POINTER_TOUCH = 'touch';
  Hammer.POINTER_PEN = 'pen';

  // touch event defines
  Hammer.EVENT_START = 'start';
  Hammer.EVENT_MOVE = 'move';
  Hammer.EVENT_END = 'end';

  // hammer document where the base events are added at
  Hammer.DOCUMENT = window.document;

  // plugins and gestures namespaces
  Hammer.plugins = Hammer.plugins || {};
  Hammer.gestures = Hammer.gestures || {};

  // if the window events are set...
  Hammer.READY = false;

  /**
   * setup events to detect gestures on the document
   */
  function setup() {
    if(Hammer.READY) {
      return;
    }

    // find what eventtypes we add listeners to
    Hammer.event.determineEventTypes();

    // Register all gestures inside Hammer.gestures
    Hammer.utils.each(Hammer.gestures, function(gesture){
      Hammer.detection.register(gesture);
    });

    // Add touch events on the document
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_MOVE, Hammer.detection.detect);
    Hammer.event.onTouch(Hammer.DOCUMENT, Hammer.EVENT_END, Hammer.detection.detect);

    // Hammer is ready...!
    Hammer.READY = true;
  }

  Hammer.utils = {
    /**
     * extend method,
     * also used for cloning when dest is an empty object
     * @param   {Object}    dest
     * @param   {Object}    src
     * @parm  {Boolean}  merge    do a merge
     * @returns {Object}    dest
     */
    extend: function extend(dest, src, merge) {
      for(var key in src) {
        if(dest[key] !== undefined && merge) {
          continue;
        }
        dest[key] = src[key];
      }
      return dest;
    },


    /**
     * for each
     * @param obj
     * @param iterator
     */
    each: function(obj, iterator, context) {
      // native forEach on arrays
      if ("forEach" in obj) {
        obj.forEach(iterator, context);
      } 
      // arrays
      else if(obj.length != undefined) {
        for (var i = 0, length = obj.length; i < length; i++) {
          if (iterator.call(context, obj[i], i, obj) === false) { 
            return;
          }
        }
      }
      // objects
      else {
        for (var i in obj) {
          if (obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj) === false) { 
            return;
          }
        }
      }
    },

    /**
     * find if a node is in the given parent
     * used for event delegation tricks
     * @param   {HTMLElement}   node
     * @param   {HTMLElement}   parent
     * @returns {boolean}       has_parent
     */
    hasParent: function(node, parent) {
      while(node) {
        if(node == parent) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },


    /**
     * get the center of all the touches
     * @param   {Array}     touches
     * @returns {Object}    center
     */
    getCenter: function getCenter(touches) {
      var valuesX = [], valuesY = [];

      Hammer.utils.each(touches, function(touch) {
        // I prefer clientX because it ignore the scrolling position
        valuesX.push(typeof touch.clientX !== 'undefined' ? touch.clientX : touch.pageX );
        valuesY.push(typeof touch.clientY !== 'undefined' ? touch.clientY : touch.pageY );
      });

      return {
        pageX: ((Math.min.apply(Math, valuesX) + Math.max.apply(Math, valuesX)) / 2),
        pageY: ((Math.min.apply(Math, valuesY) + Math.max.apply(Math, valuesY)) / 2)
      };
    },


    /**
     * calculate the velocity between two points
     * @param   {Number}    delta_time
     * @param   {Number}    delta_x
     * @param   {Number}    delta_y
     * @returns {Object}    velocity
     */
    getVelocity: function getVelocity(delta_time, delta_x, delta_y) {
      return {
        x: Math.abs(delta_x / delta_time) || 0,
        y: Math.abs(delta_y / delta_time) || 0
      };
    },


    /**
     * calculate the angle between two coordinates
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    angle
     */
    getAngle: function getAngle(touch1, touch2) {
      var y = touch2.pageY - touch1.pageY,
        x = touch2.pageX - touch1.pageX;
      return Math.atan2(y, x) * 180 / Math.PI;
    },


    /**
     * angle to direction define
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {String}    direction constant, like Hammer.DIRECTION_LEFT
     */
    getDirection: function getDirection(touch1, touch2) {
      var x = Math.abs(touch1.pageX - touch2.pageX),
        y = Math.abs(touch1.pageY - touch2.pageY);

      if(x >= y) {
        return touch1.pageX - touch2.pageX > 0 ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
      }
      else {
        return touch1.pageY - touch2.pageY > 0 ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
      }
    },


    /**
     * calculate the distance between two touches
     * @param   {Touch}     touch1
     * @param   {Touch}     touch2
     * @returns {Number}    distance
     */
    getDistance: function getDistance(touch1, touch2) {
      var x = touch2.pageX - touch1.pageX,
        y = touch2.pageY - touch1.pageY;
      return Math.sqrt((x * x) + (y * y));
    },


    /**
     * calculate the scale factor between two touchLists (fingers)
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    scale
     */
    getScale: function getScale(start, end) {
      // need two fingers...
      if(start.length >= 2 && end.length >= 2) {
        return this.getDistance(end[0], end[1]) /
          this.getDistance(start[0], start[1]);
      }
      return 1;
    },


    /**
     * calculate the rotation degrees between two touchLists (fingers)
     * @param   {Array}     start
     * @param   {Array}     end
     * @returns {Number}    rotation
     */
    getRotation: function getRotation(start, end) {
      // need two fingers
      if(start.length >= 2 && end.length >= 2) {
        return this.getAngle(end[1], end[0]) -
          this.getAngle(start[1], start[0]);
      }
      return 0;
    },


    /**
     * boolean if the direction is vertical
     * @param    {String}    direction
     * @returns  {Boolean}   is_vertical
     */
    isVertical: function isVertical(direction) {
      return (direction == Hammer.DIRECTION_UP || direction == Hammer.DIRECTION_DOWN);
    },


    /**
     * stop browser default behavior with css props
     * @param   {HtmlElement}   element
     * @param   {Object}        css_props
     */
    stopDefaultBrowserBehavior: function stopDefaultBrowserBehavior(element, css_props) {
      var prop,
        vendors = ['webkit', 'khtml', 'moz', 'Moz', 'ms', 'o', ''];

      if(!css_props || !element || !element.style) {
        return;
      }

      // with css properties for modern browsers
      Hammer.utils.each(vendors, function(vendor) {
        Hammer.utils.each(css_props, function(prop) {
            // vender prefix at the property
            if(vendor) {
              prop = vendors + prop.substring(0, 1).toUpperCase() + prop.substring(1);
            }
            // set the style
            if(prop in element.style) {
              element.style[prop] = prop;
            }
        });
      });

      // also the disable onselectstart
      if(css_props.userSelect == 'none') {
        element.onselectstart = function() {
          return false;
        };
      }

      // and disable ondragstart
      if(css_props.userDrag == 'none') {
        element.ondragstart = function() {
        return false;
      };
    }
  }
  };


  /**
   * create new hammer instance
   * all methods should return the instance itself, so it is chainable.
   * @param   {HTMLElement}       element
   * @param   {Object}            [options={}]
   * @returns {Hammer.Instance}
   * @constructor
   */
  Hammer.Instance = function(element, options) {
    var self = this;

    // setup HammerJS window events and register all gestures
    // this also sets up the default options
    setup();

    this.element = element;

    // start/stop detection option
    this.enabled = true;

    // merge options
    this.options = Hammer.utils.extend(
      Hammer.utils.extend({}, Hammer.defaults),
      options || {});

    // add some css to the element to prevent the browser from doing its native behavoir
    if(this.options.stop_browser_behavior) {
      Hammer.utils.stopDefaultBrowserBehavior(this.element, this.options.stop_browser_behavior);
    }

    // start detection on touchstart
    Hammer.event.onTouch(element, Hammer.EVENT_START, function(ev) {
      if(self.enabled) {
        Hammer.detection.startDetect(self, ev);
      }
    });

    // return instance
    return this;
  };


  Hammer.Instance.prototype = {
    /**
     * bind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    on: function onEvent(gesture, handler) {
      var gestures = gesture.split(' ');
      Hammer.utils.each(gestures, function(gesture) {
        this.element.addEventListener(gesture, handler, false);
      }, this);
      return this;
    },


    /**
     * unbind events to the instance
     * @param   {String}      gesture
     * @param   {Function}    handler
     * @returns {Hammer.Instance}
     */
    off: function offEvent(gesture, handler) {
      var gestures = gesture.split(' ');
      Hammer.utils.each(gestures, function(gesture) {
        this.element.removeEventListener(gesture, handler, false);
      }, this);
      return this;
    },


    /**
     * trigger gesture event
     * @param   {String}      gesture
     * @param   {Object}      [eventData]
     * @returns {Hammer.Instance}
     */
    trigger: function triggerEvent(gesture, eventData) {
      // optional
      if(!eventData) {
        eventData = {};
      }

      // create DOM event
      var event = Hammer.DOCUMENT.createEvent('Event');
      event.initEvent(gesture, true, true);
      event.gesture = eventData;

      // trigger on the target if it is in the instance element,
      // this is for event delegation tricks
      var element = this.element;
      if(Hammer.utils.hasParent(eventData.target, element)) {
        element = eventData.target;
      }

      element.dispatchEvent(event);
      return this;
    },


    /**
     * enable of disable hammer.js detection
     * @param   {Boolean}   state
     * @returns {Hammer.Instance}
     */
    enable: function enable(state) {
      this.enabled = state;
      return this;
    }
  };


  /**
   * this holds the last move event,
   * used to fix empty touchend issue
   * see the onTouch event for an explanation
   * @type {Object}
   */
  var last_move_event = null;


  /**
   * when the mouse is hold down, this is true
   * @type {Boolean}
   */
  var enable_detect = false;


  /**
   * when touch events have been fired, this is true
   * @type {Boolean}
   */
  var touch_triggered = false;


  Hammer.event = {
    /**
     * simple addEventListener
     * @param   {HTMLElement}   element
     * @param   {String}        type
     * @param   {Function}      handler
     */
    bindDom: function(element, type, handler) {
      var types = type.split(' ');
      Hammer.utils.each(types, function(type){
        element.addEventListener(type, handler, false);
      });
    },


    /**
     * touch events with mouse fallback
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Function}      handler
     */
    onTouch: function onTouch(element, eventType, handler) {
      var self = this;

      this.bindDom(element, Hammer.EVENT_TYPES[eventType], function bindDomOnTouch(ev) {
        var sourceEventType = ev.type.toLowerCase();

        // onmouseup, but when touchend has been fired we do nothing.
        // this is for touchdevices which also fire a mouseup on touchend
        if(sourceEventType.match(/mouse/) && touch_triggered) {
          return;
        }

        // mousebutton must be down or a touch event
        else if(sourceEventType.match(/touch/) ||   // touch events are always on screen
          sourceEventType.match(/pointerdown/) || // pointerevents touch
          (sourceEventType.match(/mouse/) && ev.which === 1)   // mouse is pressed
          ) {
          enable_detect = true;
        }

        // mouse isn't pressed
        else if(sourceEventType.match(/mouse/) && !ev.which) {
          enable_detect = false;
        }


        // we are in a touch event, set the touch triggered bool to true,
        // this for the conflicts that may occur on ios and android
        if(sourceEventType.match(/touch|pointer/)) {
          touch_triggered = true;
        }

        // count the total touches on the screen
        var count_touches = 0;

        // when touch has been triggered in this detection session
        // and we are now handling a mouse event, we stop that to prevent conflicts
        if(enable_detect) {
          // update pointerevent
          if(Hammer.HAS_POINTEREVENTS && eventType != Hammer.EVENT_END) {
            count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
          }
          // touch
          else if(sourceEventType.match(/touch/)) {
            count_touches = ev.touches.length;
          }
          // mouse
          else if(!touch_triggered) {
            count_touches = sourceEventType.match(/up/) ? 0 : 1;
          }

          // if we are in a end event, but when we remove one touch and
          // we still have enough, set eventType to move
          if(count_touches > 0 && eventType == Hammer.EVENT_END) {
            eventType = Hammer.EVENT_MOVE;
          }
          // no touches, force the end event
          else if(!count_touches) {
            eventType = Hammer.EVENT_END;
          }

          // store the last move event
          if(count_touches || last_move_event === null) {
            last_move_event = ev;
          }

          // trigger the handler
          handler.call(Hammer.detection, self.collectEventData(element, eventType, self.getTouchList(last_move_event, eventType), ev));

          // remove pointerevent from list
          if(Hammer.HAS_POINTEREVENTS && eventType == Hammer.EVENT_END) {
            count_touches = Hammer.PointerEvent.updatePointer(eventType, ev);
          }
        }

        // on the end we reset everything
        if(!count_touches) {
          last_move_event = null;
          enable_detect = false;
          touch_triggered = false;
          Hammer.PointerEvent.reset();
        }
      });
    },


    /**
     * we have different events for each device/browser
     * determine what we need and set them in the Hammer.EVENT_TYPES constant
     */
    determineEventTypes: function determineEventTypes() {
      // determine the eventtype we want to set
      var types;

      // pointerEvents magic
      if(Hammer.HAS_POINTEREVENTS) {
        types = Hammer.PointerEvent.getEvents();
      }
      // on Android, iOS, blackberry, windows mobile we dont want any mouseevents
      else if(Hammer.NO_MOUSEEVENTS) {
        types = [
          'touchstart',
          'touchmove',
          'touchend touchcancel'];
      }
      // for non pointer events browsers and mixed browsers,
      // like chrome on windows8 touch laptop
      else {
        types = [
          'touchstart mousedown',
          'touchmove mousemove',
          'touchend touchcancel mouseup'];
      }

      Hammer.EVENT_TYPES[Hammer.EVENT_START] = types[0];
      Hammer.EVENT_TYPES[Hammer.EVENT_MOVE] = types[1];
      Hammer.EVENT_TYPES[Hammer.EVENT_END] = types[2];
    },


    /**
     * create touchlist depending on the event
     * @param   {Object}    ev
     * @param   {String}    eventType   used by the fakemultitouch plugin
     */
    getTouchList: function getTouchList(ev/*, eventType*/) {
      // get the fake pointerEvent touchlist
      if(Hammer.HAS_POINTEREVENTS) {
        return Hammer.PointerEvent.getTouchList();
      }
      // get the touchlist
      else if(ev.touches) {
        return ev.touches;
      }
      // make fake touchlist from mouse position
      else {
        ev.indentifier = 1;
        return [ev];
      }
    },


    /**
     * collect event data for Hammer js
     * @param   {HTMLElement}   element
     * @param   {String}        eventType        like Hammer.EVENT_MOVE
     * @param   {Object}        eventData
     */
    collectEventData: function collectEventData(element, eventType, touches, ev) {
      // find out pointerType
      var pointerType = Hammer.POINTER_TOUCH;
      if(ev.type.match(/mouse/) || Hammer.PointerEvent.matchType(Hammer.POINTER_MOUSE, ev)) {
        pointerType = Hammer.POINTER_MOUSE;
      }

      return {
        center     : Hammer.utils.getCenter(touches),
        timeStamp  : new Date().getTime(),
        target     : ev.target,
        touches    : touches,
        eventType  : eventType,
        pointerType: pointerType,
        srcEvent   : ev,

        /**
         * prevent the browser default actions
         * mostly used to disable scrolling of the browser
         */
        preventDefault: function() {
          if(this.srcEvent.preventManipulation) {
            this.srcEvent.preventManipulation();
          }

          if(this.srcEvent.preventDefault) {
            this.srcEvent.preventDefault();
          }
        },

        /**
         * stop bubbling the event up to its parents
         */
        stopPropagation: function() {
          this.srcEvent.stopPropagation();
        },

        /**
         * immediately stop gesture detection
         * might be useful after a swipe was detected
         * @return {*}
         */
        stopDetect: function() {
          return Hammer.detection.stopDetect();
        }
      };
    }
  };

  Hammer.PointerEvent = {
    /**
     * holds all pointers
     * @type {Object}
     */
    pointers: {},

    /**
     * get a list of pointers
     * @returns {Array}     touchlist
     */
    getTouchList: function() {
      var self = this;
      var touchlist = [];

      // we can use forEach since pointerEvents only is in IE10
      Hammer.utils.each(self.pointers, function(pointer){
        touchlist.push(pointer);
      });
      
      return touchlist;
    },

    /**
     * update the position of a pointer
     * @param   {String}   type             Hammer.EVENT_END
     * @param   {Object}   pointerEvent
     */
    updatePointer: function(type, pointerEvent) {
      if(type == Hammer.EVENT_END) {
        this.pointers = {};
      }
      else {
        pointerEvent.identifier = pointerEvent.pointerId;
        this.pointers[pointerEvent.pointerId] = pointerEvent;
      }

      return Object.keys(this.pointers).length;
    },

    /**
     * check if ev matches pointertype
     * @param   {String}        pointerType     Hammer.POINTER_MOUSE
     * @param   {PointerEvent}  ev
     */
    matchType: function(pointerType, ev) {
      if(!ev.pointerType) {
        return false;
      }

      var pt = ev.pointerType,
        types = {};
      types[Hammer.POINTER_MOUSE] = (pt === ev.MSPOINTER_TYPE_MOUSE || pt === Hammer.POINTER_MOUSE);
      types[Hammer.POINTER_TOUCH] = (pt === ev.MSPOINTER_TYPE_TOUCH || pt === Hammer.POINTER_TOUCH);
      types[Hammer.POINTER_PEN] = (pt === ev.MSPOINTER_TYPE_PEN || pt === Hammer.POINTER_PEN);
      return types[pointerType];
    },


    /**
     * get events
     */
    getEvents: function() {
      return [
        'pointerdown MSPointerDown',
        'pointermove MSPointerMove',
        'pointerup pointercancel MSPointerUp MSPointerCancel'
      ];
    },

    /**
     * reset the list
     */
    reset: function() {
      this.pointers = {};
    }
  };


  Hammer.detection = {
    // contains all registred Hammer.gestures in the correct order
    gestures: [],

    // data of the current Hammer.gesture detection session
    current : null,

    // the previous Hammer.gesture session data
    // is a full clone of the previous gesture.current object
    previous: null,

    // when this becomes true, no gestures are fired
    stopped : false,


    /**
     * start Hammer.gesture detection
     * @param   {Hammer.Instance}   inst
     * @param   {Object}            eventData
     */
    startDetect: function startDetect(inst, eventData) {
      // already busy with a Hammer.gesture detection on an element
      if(this.current) {
        return;
      }

      this.stopped = false;

      this.current = {
        inst      : inst, // reference to HammerInstance we're working for
        startEvent: Hammer.utils.extend({}, eventData), // start eventData for distances, timing etc
        lastEvent : false, // last eventData
        name      : '' // current gesture we're in/detected, can be 'tap', 'hold' etc
      };

      this.detect(eventData);
    },


    /**
     * Hammer.gesture detection
     * @param   {Object}    eventData
     */
    detect: function detect(eventData) {
      if(!this.current || this.stopped) {
        return;
      }

      // extend event data with calculations about scale, distance etc
      eventData = this.extendEventData(eventData);

      // instance options
      var inst_options = this.current.inst.options;

      // call Hammer.gesture handlers
      Hammer.utils.each(this.gestures, function(gesture) {
        // only when the instance options have enabled this gesture
        if(!this.stopped && inst_options[gesture.name] !== false) {
          // if a handler returns false, we stop with the detection
          if(gesture.handler.call(gesture, eventData, this.current.inst) === false) {
            this.stopDetect();
            return false;
          }
        }
      }, this);

      // store as previous event event
      if(this.current) {
        this.current.lastEvent = eventData;
      }

      // endevent, but not the last touch, so dont stop
      if(eventData.eventType == Hammer.EVENT_END && !eventData.touches.length - 1) {
        this.stopDetect();
      }

      return eventData;
    },


    /**
     * clear the Hammer.gesture vars
     * this is called on endDetect, but can also be used when a final Hammer.gesture has been detected
     * to stop other Hammer.gestures from being fired
     */
    stopDetect: function stopDetect() {
      // clone current data to the store as the previous gesture
      // used for the double tap gesture, since this is an other gesture detect session
      this.previous = Hammer.utils.extend({}, this.current);

      // reset the current
      this.current = null;

      // stopped!
      this.stopped = true;
    },


    /**
     * extend eventData for Hammer.gestures
     * @param   {Object}   ev
     * @returns {Object}   ev
     */
    extendEventData: function extendEventData(ev) {
      var startEv = this.current.startEvent;

      // if the touches change, set the new touches over the startEvent touches
      // this because touchevents don't have all the touches on touchstart, or the
      // user must place his fingers at the EXACT same time on the screen, which is not realistic
      // but, sometimes it happens that both fingers are touching at the EXACT same time
      if(startEv && (ev.touches.length != startEv.touches.length || ev.touches === startEv.touches)) {
        // extend 1 level deep to get the touchlist with the touch objects
        startEv.touches = [];
        Hammer.utils.each(ev.touches, function(touch) {
          startEv.touches.push(Hammer.utils.extend({}, touch));
        });
      }

      var delta_time = ev.timeStamp - startEv.timeStamp
        , delta_x = ev.center.pageX - startEv.center.pageX
        , delta_y = ev.center.pageY - startEv.center.pageY
        , velocity = Hammer.utils.getVelocity(delta_time, delta_x, delta_y)
        , interimAngle
        , interimDirection;

      // end events (e.g. dragend) don't have useful values for interimDirection & interimAngle
      // because the previous event has exactly the same coordinates
      // so for end events, take the previous values of interimDirection & interimAngle
      // instead of recalculating them and getting a spurious '0'
      if(ev.eventType === 'end') {
        interimAngle = this.current.lastEvent && this.current.lastEvent.interimAngle;
        interimDirection = this.current.lastEvent && this.current.lastEvent.interimDirection;
      }
      else {
        interimAngle = this.current.lastEvent && Hammer.utils.getAngle(this.current.lastEvent.center, ev.center);
        interimDirection = this.current.lastEvent && Hammer.utils.getDirection(this.current.lastEvent.center, ev.center);
      }

      Hammer.utils.extend(ev, {
        deltaTime: delta_time,

        deltaX: delta_x,
        deltaY: delta_y,

        velocityX: velocity.x,
        velocityY: velocity.y,

        distance: Hammer.utils.getDistance(startEv.center, ev.center),

        angle: Hammer.utils.getAngle(startEv.center, ev.center),
        interimAngle: interimAngle,

        direction: Hammer.utils.getDirection(startEv.center, ev.center),
        interimDirection: interimDirection,

        scale: Hammer.utils.getScale(startEv.touches, ev.touches),
        rotation: Hammer.utils.getRotation(startEv.touches, ev.touches),

        startEvent: startEv
      });

      return ev;
    },


    /**
     * register new gesture
     * @param   {Object}    gesture object, see gestures.js for documentation
     * @returns {Array}     gestures
     */
    register: function register(gesture) {
      // add an enable gesture options if there is no given
      var options = gesture.defaults || {};
      if(options[gesture.name] === undefined) {
        options[gesture.name] = true;
      }

      // extend Hammer default options with the Hammer.gesture options
      Hammer.utils.extend(Hammer.defaults, options, true);

      // set its index
      gesture.index = gesture.index || 1000;

      // add Hammer.gesture to the list
      this.gestures.push(gesture);

      // sort the list by index
      this.gestures.sort(function(a, b) {
        if(a.index < b.index) { return -1; }
        if(a.index > b.index) { return 1; }
        return 0;
      });

      return this.gestures;
    }
  };


  /**
   * Drag
   * Move with x fingers (default 1) around on the page. Blocking the scrolling when
   * moving left and right is a good practice. When all the drag events are blocking
   * you disable scrolling on that area.
   * @events  drag, drapleft, dragright, dragup, dragdown
   */
  Hammer.gestures.Drag = {
    name     : 'drag',
    index    : 50,
    defaults : {
      drag_min_distance            : 10,
      
      // Set correct_for_drag_min_distance to true to make the starting point of the drag
      // be calculated from where the drag was triggered, not from where the touch started.
      // Useful to avoid a jerk-starting drag, which can make fine-adjustments
      // through dragging difficult, and be visually unappealing.
      correct_for_drag_min_distance: true,
      
      // set 0 for unlimited, but this can conflict with transform
      drag_max_touches             : 1,
      
      // prevent default browser behavior when dragging occurs
      // be careful with it, it makes the element a blocking element
      // when you are using the drag gesture, it is a good practice to set this true
      drag_block_horizontal        : false,
      drag_block_vertical          : false,
      
      // drag_lock_to_axis keeps the drag gesture on the axis that it started on,
      // It disallows vertical directions if the initial direction was horizontal, and vice versa.
      drag_lock_to_axis            : false,
      
      // drag lock only kicks in when distance > drag_lock_min_distance
      // This way, locking occurs only when the distance has become large enough to reliably determine the direction
      drag_lock_min_distance       : 25
    },
    
    triggered: false,
    handler  : function dragGesture(ev, inst) {
      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(Hammer.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name + 'end', ev);
        this.triggered = false;
        return;
      }

      // max touches
      if(inst.options.drag_max_touches > 0 &&
        ev.touches.length > inst.options.drag_max_touches) {
        return;
      }

      switch(ev.eventType) {
        case Hammer.EVENT_START:
          this.triggered = false;
          break;

        case Hammer.EVENT_MOVE:
          // when the distance we moved is too small we skip this gesture
          // or we can be already in dragging
          if(ev.distance < inst.options.drag_min_distance &&
            Hammer.detection.current.name != this.name) {
            return;
          }

          // we are dragging!
          if(Hammer.detection.current.name != this.name) {
            Hammer.detection.current.name = this.name;
            if(inst.options.correct_for_drag_min_distance && ev.distance > 0) {
              // When a drag is triggered, set the event center to drag_min_distance pixels from the original event center.
              // Without this correction, the dragged distance would jumpstart at drag_min_distance pixels instead of at 0.
              // It might be useful to save the original start point somewhere
              var factor = Math.abs(inst.options.drag_min_distance / ev.distance);
              Hammer.detection.current.startEvent.center.pageX += ev.deltaX * factor;
              Hammer.detection.current.startEvent.center.pageY += ev.deltaY * factor;

              // recalculate event data using new start point
              ev = Hammer.detection.extendEventData(ev);
            }
          }

          // lock drag to axis?
          if(Hammer.detection.current.lastEvent.drag_locked_to_axis || (inst.options.drag_lock_to_axis && inst.options.drag_lock_min_distance <= ev.distance)) {
            ev.drag_locked_to_axis = true;
          }
          var last_direction = Hammer.detection.current.lastEvent.direction;
          if(ev.drag_locked_to_axis && last_direction !== ev.direction) {
            // keep direction on the axis that the drag gesture started on
            if(Hammer.utils.isVertical(last_direction)) {
              ev.direction = (ev.deltaY < 0) ? Hammer.DIRECTION_UP : Hammer.DIRECTION_DOWN;
            }
            else {
              ev.direction = (ev.deltaX < 0) ? Hammer.DIRECTION_LEFT : Hammer.DIRECTION_RIGHT;
            }
          }

          // first time, trigger dragstart event
          if(!this.triggered) {
            inst.trigger(this.name + 'start', ev);
            this.triggered = true;
          }

          // trigger normal event
          inst.trigger(this.name, ev);

          // direction event, like dragdown
          inst.trigger(this.name + ev.direction, ev);

          // block the browser events
          if((inst.options.drag_block_vertical && Hammer.utils.isVertical(ev.direction)) ||
            (inst.options.drag_block_horizontal && !Hammer.utils.isVertical(ev.direction))) {
            ev.preventDefault();
          }
          break;

        case Hammer.EVENT_END:
          // trigger dragend
          if(this.triggered) {
            inst.trigger(this.name + 'end', ev);
          }

          this.triggered = false;
          break;
      }
    }
  };

  /**
   * Hold
   * Touch stays at the same place for x time
   * @events  hold
   */
  Hammer.gestures.Hold = {
    name    : 'hold',
    index   : 10,
    defaults: {
      hold_timeout  : 500,
      hold_threshold: 1
    },
    timer   : null,
    handler : function holdGesture(ev, inst) {
      switch(ev.eventType) {
        case Hammer.EVENT_START:
          // clear any running timers
          clearTimeout(this.timer);

          // set the gesture so we can check in the timeout if it still is
          Hammer.detection.current.name = this.name;

          // set timer and if after the timeout it still is hold,
          // we trigger the hold event
          this.timer = setTimeout(function() {
            if(Hammer.detection.current.name == 'hold') {
              inst.trigger('hold', ev);
            }
          }, inst.options.hold_timeout);
          break;

        // when you move or end we clear the timer
        case Hammer.EVENT_MOVE:
          if(ev.distance > inst.options.hold_threshold) {
            clearTimeout(this.timer);
          }
          break;

        case Hammer.EVENT_END:
          clearTimeout(this.timer);
          break;
      }
    }
  };

  /**
   * Release
   * Called as last, tells the user has released the screen
   * @events  release
   */
  Hammer.gestures.Release = {
    name   : 'release',
    index  : Infinity,
    handler: function releaseGesture(ev, inst) {
      if(ev.eventType == Hammer.EVENT_END) {
        inst.trigger(this.name, ev);
      }
    }
  };

  /**
   * Swipe
   * triggers swipe events when the end velocity is above the threshold
   * @events  swipe, swipeleft, swiperight, swipeup, swipedown
   */
  Hammer.gestures.Swipe = {
    name    : 'swipe',
    index   : 40,
    defaults: {
      // set 0 for unlimited, but this can conflict with transform
      swipe_min_touches: 1,
      swipe_max_touches: 1,
      swipe_velocity   : 0.7
    },
    handler : function swipeGesture(ev, inst) {
      if(ev.eventType == Hammer.EVENT_END) {
        // max touches
        if(inst.options.swipe_max_touches > 0 &&
          ev.touches.length < inst.options.swipe_min_touches &&
          ev.touches.length > inst.options.swipe_max_touches) {
          return;
        }

        // when the distance we moved is too small we skip this gesture
        // or we can be already in dragging
        if(ev.velocityX > inst.options.swipe_velocity ||
          ev.velocityY > inst.options.swipe_velocity) {
          // trigger swipe events
          inst.trigger(this.name, ev);
          inst.trigger(this.name + ev.direction, ev);
        }
      }
    }
  };

  /**
   * Tap/DoubleTap
   * Quick touch at a place or double at the same place
   * @events  tap, doubletap
   */
  Hammer.gestures.Tap = {
    name    : 'tap',
    index   : 100,
    defaults: {
      tap_max_touchtime : 250,
      tap_max_distance  : 10,
      tap_always        : true,
      doubletap_distance: 20,
      doubletap_interval: 300
    },
    handler : function tapGesture(ev, inst) {
      if(ev.eventType == Hammer.EVENT_END && ev.srcEvent.type != 'touchcancel') {
        // previous gesture, for the double tap since these are two different gesture detections
        var prev = Hammer.detection.previous,
          did_doubletap = false;

        // when the touchtime is higher then the max touch time
        // or when the moving distance is too much
        if(ev.deltaTime > inst.options.tap_max_touchtime ||
          ev.distance > inst.options.tap_max_distance) {
          return;
        }

        // check if double tap
        if(prev && prev.name == 'tap' &&
          (ev.timeStamp - prev.lastEvent.timeStamp) < inst.options.doubletap_interval &&
          ev.distance < inst.options.doubletap_distance) {
          inst.trigger('doubletap', ev);
          did_doubletap = true;
        }

        // do a single tap
        if(!did_doubletap || inst.options.tap_always) {
          Hammer.detection.current.name = 'tap';
          inst.trigger(Hammer.detection.current.name, ev);
        }
      }
    }
  };

  /**
   * Touch
   * Called as first, tells the user has touched the screen
   * @events  touch
   */
  Hammer.gestures.Touch = {
    name    : 'touch',
    index   : -Infinity,
    defaults: {
      // call preventDefault at touchstart, and makes the element blocking by
      // disabling the scrolling of the page, but it improves gestures like
      // transforming and dragging.
      // be careful with using this, it can be very annoying for users to be stuck
      // on the page
      prevent_default    : false,

      // disable mouse events, so only touch (or pen!) input triggers events
      prevent_mouseevents: false
    },
    handler : function touchGesture(ev, inst) {
      if(inst.options.prevent_mouseevents && ev.pointerType == Hammer.POINTER_MOUSE) {
        ev.stopDetect();
        return;
      }

      if(inst.options.prevent_default) {
        ev.preventDefault();
      }

      if(ev.eventType == Hammer.EVENT_START) {
        inst.trigger(this.name, ev);
      }
    }
  };

  /**
   * Transform
   * User want to scale or rotate with 2 fingers
   * @events  transform, pinch, pinchin, pinchout, rotate
   */
  Hammer.gestures.Transform = {
    name     : 'transform',
    index    : 45,
    defaults : {
      // factor, no scale is 1, zoomin is to 0 and zoomout until higher then 1
      transform_min_scale   : 0.01,
      // rotation in degrees
      transform_min_rotation: 1,
      // prevent default browser behavior when two touches are on the screen
      // but it makes the element a blocking element
      // when you are using the transform gesture, it is a good practice to set this true
      transform_always_block: false
    },
    triggered: false,
    handler  : function transformGesture(ev, inst) {
      // current gesture isnt drag, but dragged is true
      // this means an other gesture is busy. now call dragend
      if(Hammer.detection.current.name != this.name && this.triggered) {
        inst.trigger(this.name + 'end', ev);
        this.triggered = false;
        return;
      }

      // atleast multitouch
      if(ev.touches.length < 2) {
        return;
      }

      // prevent default when two fingers are on the screen
      if(inst.options.transform_always_block) {
        ev.preventDefault();
      }

      switch(ev.eventType) {
        case Hammer.EVENT_START:
          this.triggered = false;
          break;

        case Hammer.EVENT_MOVE:
          var scale_threshold = Math.abs(1 - ev.scale);
          var rotation_threshold = Math.abs(ev.rotation);

          // when the distance we moved is too small we skip this gesture
          // or we can be already in dragging
          if(scale_threshold < inst.options.transform_min_scale &&
            rotation_threshold < inst.options.transform_min_rotation) {
            return;
          }

          // we are transforming!
          Hammer.detection.current.name = this.name;

          // first time, trigger dragstart event
          if(!this.triggered) {
            inst.trigger(this.name + 'start', ev);
            this.triggered = true;
          }

          inst.trigger(this.name, ev); // basic transform event

          // trigger rotate event
          if(rotation_threshold > inst.options.transform_min_rotation) {
            inst.trigger('rotate', ev);
          }

          // trigger pinch event
          if(scale_threshold > inst.options.transform_min_scale) {
            inst.trigger('pinch', ev);
            inst.trigger('pinch' + ((ev.scale < 1) ? 'in' : 'out'), ev);
          }
          break;

        case Hammer.EVENT_END:
          // trigger dragend
          if(this.triggered) {
            inst.trigger(this.name + 'end', ev);
          }

          this.triggered = false;
          break;
      }
    }
  };
  $.Hammer = Hammer;
})(Zepto)

;(function($){
  $.animates = function (obj, prop, params, ease, onMorphInit, onMorph, onMorphEnd) {
      var IE = !document.getElementsByClassName,
          getInitProp = (function (obj, prop, duration, speed, onMorphInit, jsMorph) {
            var initProp = {}, dims, cS, fS, objStyle = obj.style, font, tmpStyle, moz, maxVal = 0, help, outside, pad = [], opacity, color,  //  m = 0,is m++ plus reading from Array faster than reading from object (in anim()) ???
            // getDim = function (obj) {var dim = obj.getBoundingClientRect(); return [dim.right-dim.left,dim.bottom-dim.top,obj.offsetLeft,obj.offsetTop]},
            getDim = function (obj) {return [obj.offsetWidth, obj.offsetHeight, obj.offsetLeft, obj.offsetTop]},
            
            getStyle = function () {
              if (document.body.currentStyle) return function (obj, prop) {return obj.currentStyle[prop.replace(/\-(\w)/g, function(){return arguments[1].toUpperCase()})]}
              else return function (obj, prop) {return document.defaultView.getComputedStyle(obj,null).getPropertyValue(prop)}
            }(),
            
            units = function (obj) { // this usualy only happens with IE and OPERA
              var units = {}, oD, objStyle = obj.style, sniff = document.createElement('div'), sniffStyle = sniff.style;
              // unit sniffer -> get all units to px inside object
              sniffStyle.cssText = 'position:absolute;left:0;top:-10ex;width:10em;height:72pt;';
              obj.appendChild(sniff);
              oD = getDim(sniff).concat(getDim(obj));
              units = {em:oD[0]/10,pt:oD[1]/72, pc:oD[1]/6, 'in':oD[1], cm:oD[1]/2.54, mm:oD[1]/25.4, ex:Math.abs(oD[3])/10, '%font': oD[0]/1000, '%line': oD[0]/1000} // units as object is easyer to read out than array!! // , '%width':oD[4]/100, '%height':oD[5]/100
              
              // extra: sniff ex if font bigger in end state ... could be in extra function and only called if really needed
              sniffStyle.cssText += ';font-size:'+prop['font-size']+(prop['font-family'] ? ';font-family:'+prop['font-family'] : '')+';';
              oD = getDim(sniff);
              obj.removeChild(sniff);
              units['exn'] = Math.abs(oD[3]/10);
              
              // outer percentage meter ... could be in extra function and only called if really needed
              tmpStyle = objStyle.cssText;
              objStyle.cssText += ';position:absolute;left:0%;top:0%;';
              oD = getDim(obj);
              objStyle.cssText += ';left:-100%;top:-100%;'; // to avoid scrollbars
              oD = oD.concat(getDim(obj));
              objStyle.cssText = tmpStyle;
              units['%outX'] = (oD[2]-oD[6])/100;
              units['%outY'] = (oD[3]-oD[7])/100;
              return units;
            },
            
            unit2px = function (xS, n, dims) {
              if (xS[2] != 'px' && xS[2] != '') {
                if (xS[2] != '%') xS[1] *= dims[xS[2]];
                else if (!n.match(/^(font)/)) xS[1] *= n.match(/width|left|right|padding|margin|text-ind/) ? dims['%outX'] : dims['%outY']; // padding ?????
                else xS[1] *= dims['%'+n.split('-')[0]];
              }
            },
            
            convertColor = function(color) {
              var cS = color.split('#');
              if (cS[1]) {
                cS=cS[1].split(''); // IE
                cS = cS.length < 6 ? (cS[0]+cS[0]+cS[1]+cS[1]+cS[2]+cS[2]).split('') : cS;
                return [parseInt(cS[0]+cS[1] , 16), parseInt(cS[2]+cS[3], 16), parseInt(cS[4]+cS[5], 16)];
              } else return /rgb\((.*)\)/.exec(cS[0])[1].replace(/\s*/g, '').split(',');
            };
              obj.initStyle = obj.style.cssText; // original start state
              
              if (prop['font-size']) font = /([\-0-9\.]+)([a-z%]+)(!*)/.exec(prop['font-size']);
              
              for (var n in prop) { // faster if only px
                opacity = n.match(/opacity/);
                color = n.match(/color/);
                if (!(n.replace(/\-(\w)/g, function(){return arguments[1].toUpperCase()}) in objStyle) && !opacity) {delete(prop[n]);continue} // take everything out that can't be rendered anyhow.. // how long does this take? Is it worth it?
                fS = /([\-0-9\.]+)([a-z%]*)(\s*~*)/.exec(prop[n]) || []; // future Style
                prop[n] = prop[n].toString().replace('~', ''); // put it back to normal
                if (IE && opacity) { // new: for IE opacity
                  cS = /\opacity=([0-9]+)\)/.exec(getStyle(obj, 'filter'));
                  cS = ['',cS == null ? 100 : cS[1],''];
                  fS = ['',fS[1]*=100,''];
                  prop[n] = fS[1]+')';
                } else if (color) {
                  cS = convertColor(getStyle(obj, n == 'border-color' ? 'border-left-color' : n));
                  fS = convertColor(prop[n]);
                } else cS = /([\-0-9\.]+)(\D*)/.exec(getStyle(obj, n.match(/^(padding|margin)$/) ? n+'-left' : n.match(/^(border-width)$/) ? 'border-left-width' : n.match(/(border-radius)$/) ? (moz = (n.match(/^(\-\w+\-)/)||['',''])[1])+'border-'+(moz == '-moz-' ? 'radius-topleft' : 'top-left-radius') : n)) || ['0px',0,'px']; // current style

                if (!cS[1] && n.match(/^(height|width)/)) { // IE and OPERA  // the following code has to go different %&§#*?uuaaaaahhhh
                  objStyle.zoom = 1; // IE and OPERA doesn't react on obj.clientWidth/Height if auto or not set
                  pad[0] = /([\-0-9\.]+)([a-z%]*)/.exec(getStyle(obj, 'padding-'+(n == 'width' ? 'left' : 'top')));
                  pad[1] = /([\-0-9\.]+)([a-z%]*)/.exec(getStyle(obj, 'padding-'+(n == 'width' ? 'right' : 'bottom')));
                  if((pad[0] && pad[0][2] != 'px') || (pad[1] && pad[1][2] != 'px')) {
                    unit2px (pad[0], 'padding', dims || (dims = units(obj)));
                    unit2px (pad[1], 'padding', dims);
                  }
                  cS = ['', (n=='width' ? obj.clientWidth : obj.clientHeight)-pad[0][n=='width' ? 0 : 1]-pad[1][n=='width' ? 0 : 1], 'px'];
                }
                
                if (fS[3] && !color) { // relative addings
                  if (fS[2] && fS[2] != 'px') {
                    dims = dims || units(obj);
                    fS[1] = +fS[1]+(+cS[1])/dims[fS[2]];
                  } else fS[1] = +fS[1]+(+cS[1]);
                  prop[n] = fS[1]+fS[2];
                }
                
                if (((cS[2] && cS[2] != 'px') || (cS[2] != fS[2])) && !color) { // convert units... only if ...
                  unit2px (cS, n, dims || (dims = units(obj)));
                  unit2px (fS, n, dims);
                  if (font && n != 'font-size') {
                    if (fS[2] == 'em') fS[1] *= font[1]/(font[2] != 'em' ? dims['em'] : 1);
                    if (fS[2] == 'ex') fS[1] *= dims['exn']/dims['ex'];
                  }
                }
                
                if (color) {
                  help=[];
                  for(var m=cS.length;m--;) {
                    help[m] = fS[m] - cS[m];
                    if (maxVal < help[m]) maxVal = help[m];
                  }
                  initProp[n] = {full:cS, delta:help}; // make it faster using an array
                } else {
                  cS[1] = parseFloat(cS[1]);
                  help = parseFloat(fS[1]) - cS[1];
                  if (maxVal < Math.abs(help)) maxVal = help*(opacity && !IE ? 100 : 1);
                  initProp[n] = {pre: (IE && opacity ? 'filter:alpha(opacity=' : n+':'), full:cS[1], delta:help, unit: fS[2] == '' ? (IE && opacity ? ')' : '') : 'px'}; // make it faster using an array
                }
              }

              maxVal = 12+Math.abs(duration/maxVal*(!speed && speed != 0 ? 1 : speed));
              if (jsMorph.speed && maxVal > jsMorph.speed) ; else jsMorph.speed = maxVal;
              initProp.speed = maxVal;
              if (onMorphInit) onMorphInit(initProp, dims);
              return initProp;
          }),
        
      timer = function(res) { // as function it's faster than as an object
        if (!res) return new Date().getTime()-timer.sT||0;  // timer() = get Δtime
        else { // timer(true) = start timer
          timer.sT = new Date().getTime();
          return 0;
        }
      },

      anim = function (time, timer, backwards, frames, initProps, objs, jsMorph, IE) {
        // change: iPs.obj.backwards
        // change: jsMorph.timer ... maybe through function arguments
        
        // change: params = iPs.params; ...
        // change: prop = iPs.prop; ...
        // change: initProp = iPs.initProp; ...
        // change: initProp[n].pre (incl splitter)
        var tmpCSS, ease, cont = false, iPs, tmpTime, rewind, params, prop, initProp, val; // get this through func
        
        for (var m = initProps.length; m--;) {
          iPs = initProps[m]; params = iPs.params; prop = iPs.prop; initProp = iPs.initProp;
          tmpTime = time-(iPs.newTime || 0)-params.delay;
          if (objs && !objs[m] && !iPs.newTime) continue; // what if time elapsed
          tmpCSS = '';
          if (tmpTime > 0) { // delayed?
            rewind = (backwards || iPs.obj.backwards);
            ease = iPs.ease(tmpTime/params.duration);
            if (tmpTime < params.duration) { // still in time?
              cont = true;
              iPs.done = null;
              for (var n in prop) {
                if (n.indexOf('color')!=-1) {
                  val = [];
                  for (var o=initProp[n].full.length;o--;) val[o] = initProp[n].delta[o] ? Math.round(+initProp[n].full[o]+(!rewind ? ease : 1-ease)*initProp[n].delta[o]) : initProp[n].full[o];
                  tmpCSS += ';'+n+':rgb('+val+')';
                } else {
                  val = (!rewind ? ease : 1-ease)*initProp[n].delta; if (IE) val = Math.round(val); // IE 5.5 opacity
                  tmpCSS += ';'+initProp[n].pre+(initProp[n].full+val)+initProp[n].unit;
                }
              }
              iPs.objStyle.cssText += tmpCSS; // here we render,... only one time ;o) all things at the same time
            } else if (!iPs.done) { // end of time for this object
              // if (iPs.params.doEnd || iPs.params.doEnd == undefined) { // do the end state
              if (params.doEnd) { // do the end state
                if (!rewind) {
                  for (var n in prop) tmpCSS += ';'+initProp[n].pre+prop[n];
                  iPs.objStyle.cssText += tmpCSS;
                } else iPs.objStyle.cssText = iPs.obj.initStyle;
              } else { // otherwhise stick with calculated position
                for (var n in prop) tmpCSS += ';'+initProp[n].pre+(initProp[n].full+(!rewind ? initProp[n].delta : 0))+initProp[n].unit;
                iPs.objStyle.cssText += tmpCSS;
              }
              if (iPs.onMorphEnd) iPs.onMorphEnd(iPs.obj, timer(), frames, initProp.speed, jsMorph.speed, iPs.objStyle.cssText); // this object's end of sequence callback
              iPs.done = true;
              iPs.newTime = null;
            }
            if (iPs.onMorph) iPs.onMorph(iPs.obj, iPs.objStyle, time, frames+1, initProp.speed, jsMorph.speed, ease, iPs.objStyle.cssText);
          } else cont = true;
        }
        if (cont) jsMorph.timer = window.setTimeout(function(){anim(timer(), timer, backwards, ++frames, initProps, objs, jsMorph, IE)}, jsMorph.speed);
        else {
          jsMorph.timer = null;
          if (m<=0 && jsMorph.onMorphEnd) jsMorph.onMorphEnd(objs, timer(), frames, jsMorph.speed); // the jsMorph's end of sequence callback
        }
      },

      initProp = [];

      this.reset = function (obj, prop, params, ease, onMorphInit, onMorph, onMorphEnd) {
        // does this help with garbage collection?? win vista, chrome, yes!$&%? // or better initProp = []
        for (var n=initProp.length; n--;) {for (var m in initProp[n]) m = null; initProp[n] = null; initProp.pop()}
        if (obj) this.concat(obj, prop, params, ease, onMorphInit, onMorph, onMorphEnd);
        return this;
      };

      this.init = function (last) { // also get the cssText straight if necessary!!
        var len = initProp.length, objStyle, tmpStyle;
        for (var n = last ? len-1 : 0, m = len; n < m; n++) {
          if (initProp[n].obj.initStyle != undefined && last == undefined) {
            objStyle = initProp[n].obj.style;
            tmpStyle = objStyle.cssText;
            if (initProp[n].obj.initStyle != tmpStyle) { // more code but faster
              objStyle.cssText = initProp[n].obj.initStyle;
            } else tmpStyle = null;
          }
          initProp[n]['initProp'] = getInitProp (initProp[n].obj, initProp[n].prop, initProp[n].params.duration, initProp[n].params.speed, initProp[n].onMorphInit, this);
          if (tmpStyle && last == undefined) objStyle.cssText = tmpStyle;
        }
        return this;
      };

      this.concat = function (obj, prop, params, ease, onMorphInit, onMorph, onMorphEnd) {
        if (!obj.pop && !obj.item) obj = [obj];
        if (!params) params = {};
        for (var n = obj.length; n--;) {// make it faster feeding initProp with an array??
          if (typeof obj[n] == 'string') obj[n] = document.getElementById(obj[n]);
          initProp[initProp.length] = {obj:obj[n], objStyle:obj[n].style, prop:prop, params:{duration : params.duration || 500, delay : params.delay || 0, speed: params.speed != undefined ? params.speed : 1, doEnd : params.doEnd != undefined ? params.doEnd : true}, ease:ease || function(n) {return n}, onMorphInit:onMorphInit, onMorph:onMorph, onMorphEnd:onMorphEnd};
          this.init(true);
        }
        return this;
      };
      if (obj) this.concat (obj, prop, params, ease, onMorphInit, onMorph, onMorphEnd);

      this.stop = function (obj) {window.clearTimeout(this.timer)};

      this.start = function (obj) { // do arguments[0] also be an Array or collection !!
        var time = timer();
        if (obj && (obj.pop || obj.item)) arguments = obj; // !!!! new before Amsterdam,... to be checked
        for (var objs = [], n = arguments.length; n--;)
          for (var m = initProp.length; m--;)
            if (initProp[m].obj == arguments[n]) {
              initProp[m].newTime = this.timer ? time : .1;
              objs[m] = true;
            }
        window.clearTimeout(this.timer);
        anim(this.timer ? time : timer(true), timer, this.backwards, 1, initProp, objs.length ? objs : null, this, IE);
        return this;
      }
  }
  $.fn.animates = function(prop, params, ease, onMorphInit, onMorph, onMorphEnd){
      var $this = $(this);
      var id = $this.attr('id');
      var animate = new $.animates(id, prop, params, ease, onMorphInit, onMorph, onMorphEnd);
      animate.start();
      return animate;
  }
  $.fn.animates.Constructor = $.animates;
})(Zepto)

;(function($){
  /**
   * 模板引擎
   * 若第二个参数类型为 String 则执行 compile 方法, 否则执行 render 方法
   * @name    template
   * @param   {String}            模板ID
   * @param   {Object, String}    数据或者模板字符串
   * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
   */
    var template = function (id, content) {
        return template[
            typeof content === 'string' ? 'compile' : 'render'
        ].apply(template, arguments);
    };


    template.version = '2.0.2'; 
    template.openTag = '<%';     // 设置逻辑语法开始标签
    template.closeTag = '%>';    // 设置逻辑语法结束标签
    template.isEscape = true;    // HTML字符编码输出开关
    template.isCompress = false; // 剔除渲染后HTML多余的空白开关
    template.parser = null;      // 自定义语法插件接口



    /**
     * 渲染模板
     * @name    template.render
     * @param   {String}    模板ID
     * @param   {Object}    数据
     * @return  {String}    渲染好的HTML字符串
     */
    template.render = function (id, data) {

        var cache = template.get(id) || _debug({
            id: id,
            name: 'Render Error',
            message: 'No Template'
        });
        
        return cache(data); 
    };



    /**
     * 编译模板
     * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
     * @name    template.compile
     * @param   {String}    模板ID (可选，用作缓存索引)
     * @param   {String}    模板字符串
     * @return  {Function}  渲染方法
     */
    template.compile = function (id, source) {
        
        var params = arguments;
        var isDebug = params[2];
        var anonymous = 'anonymous';
        
        if (typeof source !== 'string') {
            isDebug = params[1];
            source = params[0];
            id = anonymous;
        }

        
        try {
            
            var Render = _compile(id, source, isDebug);
            
        } catch (e) {
        
            e.id = id || source;
            e.name = 'Syntax Error';

            return _debug(e);
            
        }
        
        
        function render (data) {
            
            try {
                
                return new Render(data, id) + '';
                
            } catch (e) {
                
                if (!isDebug) {
                    return template.compile(id, source, true)(data);
                }
                
                return _debug(e)();
                
            }
            
        }
        

        render.prototype = Render.prototype;
        render.toString = function () {
            return Render.toString();
        };
        
        
        if (id !== anonymous) {
            _cache[id] = render;
        }

        
        return render;

    };



    var _cache = template.cache = {};




    // 辅助方法集合
    var _helpers = template.helpers = {

        $include: template.render,

        $string: function (value, type) {

            if (typeof value !== 'string') {

                type = typeof value;
                if (type === 'number') {
                    value += '';
                } else if (type === 'function') {
                    value = _helpers.$string(value());
                } else {
                    value = '';
                }
            }

            return value;

        },

        $escape: function (content) {
            var m = {
                "<": "&#60;",
                ">": "&#62;",
                '"': "&#34;",
                "'": "&#39;",
                "&": "&#38;"
            };
            return _helpers.$string(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, function (s) {
                return m[s];
            });
        },

        $each: function (data, callback) {
            var isArray = Array.isArray || function (obj) {
                return ({}).toString.call(obj) === '[object Array]';
            };
             
            if (isArray(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    callback.call(data, data[i], i, data);
                }
            } else {
                for (i in data) {
                    callback.call(data, data[i], i);
                }
            }
        }
    };




    /**
     * 添加模板辅助方法
     * @name    template.helper
     * @param   {String}    名称
     * @param   {Function}  方法
     */
    template.helper = function (name, helper) {
        _helpers[name] = helper;
    };
    /**
     * 模板错误事件
     * @name    template.onerror
     * @event
     */
    template.onerror = function (e) {
        var message = 'Template Error\n\n';
        for (var name in e) {
            message += '<' + name + '>\n' + e[name] + '\n\n';
        }
        
        if (global.console) {
            console.error(message);
        }
    };
    // 获取模板缓存
    template.get = function (id) {

        var cache;
        
        if (_cache.hasOwnProperty(id)) {
            cache = _cache[id];
        } else if ('document' in global) {
            var elem = document.getElementById(id);
            
            if (elem) {
                var source = elem.value || elem.innerHTML;
                cache = template.compile(id, source.replace(/^\s*|\s*$/g, ''));
            }
        }

        return cache;
    };
    // 模板调试器
    var _debug = function (e) {

        template.onerror(e);
        
        return function () {
            return '{Template Error}';
        };
    };
    // 模板编译器
    var _compile = (function () {
        // 数组迭代
        var forEach = _helpers.$each;
        // 静态分析模板变量
        var KEYWORDS =
            // 关键字
            'break,case,catch,continue,debugger,default,delete,do,else,false'
            + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
            + ',throw,true,try,typeof,var,void,while,with'

            // 保留字
            + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
            + ',final,float,goto,implements,import,int,interface,long,native'
            + ',package,private,protected,public,short,static,super,synchronized'
            + ',throws,transient,volatile'

            // ECMA 5 - use strict
            + ',arguments,let,yield'

            + ',undefined';

        var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g;
        var SPLIT_RE = /[^\w$]+/g;
        var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
        var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
        var BOUNDARY_RE = /^,+|,+$/g;

        var getVariable = function (code) {
            return code
            .replace(REMOVE_RE, '')
            .replace(SPLIT_RE, ',')
            .replace(KEYWORDS_RE, '')
            .replace(NUMBER_RE, '')
            .replace(BOUNDARY_RE, '')
            .split(/^$|,+/);
        };
        return function (id, source, isDebug) {
            
            var openTag = template.openTag;
            var closeTag = template.closeTag;
            var parser = template.parser;

            
            var code = source;
            var tempCode = '';
            var line = 1;
            var uniq = {$data:1,$id:1,$helpers:1,$out:1,$line:1};
            var prototype = {};

            
            var variables = "var $helpers=this,"
            + (isDebug ? "$line=0," : "");

            var isNewEngine = ''.trim;// '__proto__' in {}
            var replaces = isNewEngine
            ? ["$out='';", "$out+=", ";", "$out"]
            : ["$out=[];", "$out.push(", ");", "$out.join('')"];

            var concat = isNewEngine
                ? "if(content!==undefined){$out+=content;return content;}"
                : "$out.push(content);";
                  
            var print = "function(content){" + concat + "}";

            var include = "function(id,data){"
            +     "data=data||$data;"
            +     "var content=$helpers.$include(id,data,$id);"
            +     concat
            + "}";
            
            
            // html与逻辑语法分离
            forEach(code.split(openTag), function (code, i) {
                code = code.split(closeTag);
                
                var $0 = code[0];
                var $1 = code[1];
                
                // code: [html]
                if (code.length === 1) {
                    
                    tempCode += html($0);
                 
                // code: [logic, html]
                } else {
                    
                    tempCode += logic($0);
                    
                    if ($1) {
                        tempCode += html($1);
                    }
                }
                

            });
            
            
            
            code = tempCode;
            
            
            // 调试语句
            if (isDebug) {
                code = "try{" + code + "}catch(e){"
                +       "throw {"
                +           "id:$id,"
                +           "name:'Render Error',"
                +           "message:e.message,"
                +           "line:$line,"
                +           "source:" + stringify(source)
                +           ".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')"
                +       "};"
                + "}";
            }
            
            
            code = variables + replaces[0] + code
            + "return new String(" + replaces[3] + ");";
            
            
            try {
                
                var Render = new Function("$data", "$id", code);
                Render.prototype = prototype;

                return Render;
                
            } catch (e) {
                e.temp = "function anonymous($data,$id) {" + code + "}";
                throw e;
            }



            
            // 处理 HTML 语句
            function html (code) {
                
                // 记录行号
                line += code.split(/\n/).length - 1;

                // 压缩多余空白与注释
                if (template.isCompress) {
                    code = code
                    .replace(/[\n\r\t\s]+/g, ' ')
                    .replace(/<!--.*?-->/g, '');
                }
                
                if (code) {
                    code = replaces[1] + stringify(code) + replaces[2] + "\n";
                }

                return code;
            }
            
            
            // 处理逻辑语句
            function logic (code) {

                var thisLine = line;
               
                if (parser) {
                
                     // 语法转换插件钩子
                    code = parser(code);
                    
                } else if (isDebug) {
                
                    // 记录行号
                    code = code.replace(/\n/g, function () {
                        line ++;
                        return "$line=" + line +  ";";
                    });
                    
                }
                
                
                // 输出语句. 转义: <%=value%> 不转义:<%==value%>
                if (code.indexOf('=') === 0) {

                    var isEscape = code.indexOf('==') !== 0;

                    code = code.replace(/^=*|[\s;]*$/g, '');

                    if (isEscape && template.isEscape) {

                        // 转义处理，但排除辅助方法
                        var name = code.replace(/\s*\([^\)]+\)/, '');
                        if (
                            !_helpers.hasOwnProperty(name)
                            && !/^(include|print)$/.test(name)
                        ) {
                            code = "$escape(" + code + ")";
                        }

                    } else {
                        code = "$string(" + code + ")";
                    }
                    

                    code = replaces[1] + code + replaces[2];

                }
                
                if (isDebug) {
                    code = "$line=" + thisLine + ";" + code;
                }
                
                getKey(code);
                
                return code + "\n";
            }
            
            
            // 提取模板中的变量名
            function getKey (code) {
                
                code = getVariable(code);
                
                // 分词
                forEach(code, function (name) {
                 
                    // 除重
                    if (!uniq.hasOwnProperty(name)) {
                        setValue(name);
                        uniq[name] = true;
                    }
                    
                });
                
            }
            
            
            // 声明模板变量
            // 赋值优先级:
            // 内置特权方法(include, print) > 私有模板辅助方法 > 数据 > 公用模板辅助方法
            function setValue (name) {

                var value;

                if (name === 'print') {

                    value = print;

                } else if (name === 'include') {
                    
                    prototype["$include"] = _helpers['$include'];
                    value = include;
                    
                } else {

                    value = "$data." + name;

                    if (_helpers.hasOwnProperty(name)) {

                        prototype[name] = _helpers[name];

                        if (name.indexOf('$') === 0) {
                            value = "$helpers." + name;
                        } else {
                            value = value
                            + "===undefined?$helpers." + name + ":" + value;
                        }
                    }
                    
                    
                }
                
                variables += name + "=" + value + ",";
            };


            // 字符串转义
            function stringify (code) {
                return "'" + code
                // 单引号与反斜杠转义
                .replace(/('|\\)/g, '\\$1')
                // 换行符转义(windows + linux)
                .replace(/\r/g, '\\r')
                .replace(/\n/g, '\\n') + "'";
            };
            
            
        };
    })();
    $.template = template;
})(Zepto)

;(function(){
  // __proto__ doesn't exist on IE<11, so redefine
  // the Z function to use object extension instead
  if (!('__proto__' in {})) {
    $.extend($.zepto, {
      Z: function(dom, selector){
        dom = dom || []
        $.extend(dom, $.fn)
        dom.selector = selector || ''
        dom.__Z = true
        return dom
      },
      // this is a kludge but works
      isZ: function(object){
        return $.type(object) === 'array' && '__Z' in object
      }
    })
  }

  // getComputedStyle shouldn't freak out when called
  // without a valid element as argument
  try {
    getComputedStyle(undefined)
  } catch(e) {
    var nativeGetComputedStyle = getComputedStyle;
    window.getComputedStyle = function(element){
      try {
        return nativeGetComputedStyle(element)
      } catch(e) {
        return null
      }
    }
  }
})()