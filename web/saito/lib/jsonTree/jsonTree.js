/**
 * JSON Tree library (a part of jsonTreeViewer)
 * http://github.com/summerstyle/jsonTreeViewer
 *
 * Copyright 2017 Vera Lobacheva (http://iamvera.com)
 * Released under the MIT license (LICENSE.txt)
 */

var jsonTree = (function() {
    
    /* ---------- Utilities ---------- */
    var utils = {
        
        /*
         * Returns js-"class" of value
         * 
         * @param val {any type***REMOVED*** - value
         * @returns {string***REMOVED*** - for example, "[object Function]"
         */
        getClass : function(val) {
            return Object.prototype.toString.call(val);
    ***REMOVED***,
        
        /**
         * Checks for a type of value (for valid JSON data types).
         * In other cases - throws an exception
         * 
         * @param val {any type***REMOVED*** - the value for new node
         * @returns {string***REMOVED*** ("object" | "array" | "null" | "boolean" | "number" | "string")
         */
        getType : function(val) {
            if (val === null) {
                return 'null';
        ***REMOVED***
            
            switch (typeof val) {
                case 'number':
                    return 'number';
                
                case 'string':
                    return 'string';
                
                case 'boolean':
                    return 'boolean';
        ***REMOVED***
            
            switch(utils.getClass(val)) {
                case '[object Array]':
                    return 'array';
                
                case '[object Object]':
                    return 'object';
        ***REMOVED***
            
            throw new Error('Bad type: ' + utils.getClass(val));
    ***REMOVED***,
        
        /**
         * Applies for each item of list some function
         * and checks for last element of the list
         * 
         * @param obj {Object | Array***REMOVED*** - a list or a dict with child nodes
         * @param func {Function***REMOVED*** - the function for each item
         */
        forEachNode : function(obj, func) {
            var type = utils.getType(obj),
                isLast;
        
            switch (type) {
                case 'array':
                    isLast = obj.length - 1;
                    
                    obj.forEach(function(item, i) {
                        func(i, item, i === isLast);
                ***REMOVED***);
                    
                    break;
                
                case 'object':
                    var keys = Object.keys(obj).sort();
                    
                    isLast = keys.length - 1;
                    
                    keys.forEach(function(item, i) {
                        func(item, obj[item], i === isLast);
                ***REMOVED***);
                    
                    break;
        ***REMOVED***
            
    ***REMOVED***,
        
        /**
         * Implements the kind of an inheritance by
         * using parent prototype and
         * creating intermediate constructor
         * 
         * @param Child {Function***REMOVED*** - a child constructor
         * @param Parent {Function***REMOVED*** - a parent constructor
         */
        inherits : (function() {
            var F = function() {***REMOVED***;
            
            return function(Child, Parent) {
                F.prototype = Parent.prototype;
                Child.prototype = new F();
                Child.prototype.constructor = Child;
        ***REMOVED***;
    ***REMOVED***)(),
        
        /*
         * Checks for a valid type of root node*
         *
         * @param {any type***REMOVED*** jsonObj - a value for root node
         * @returns {boolean***REMOVED*** - true for an object or an array, false otherwise
         */
        isValidRoot : function(jsonObj) {
            switch (utils.getType(jsonObj)) {
                case 'object':
                case 'array':
                    return true;
                default:
                    return false;
        ***REMOVED***
    ***REMOVED***,

        /**
         * Extends some object
         */
        extend : function(targetObj, sourceObj) {
            for (var prop in sourceObj) {
                if (sourceObj.hasOwnProperty(prop)) {
                    targetObj[prop] = sourceObj[prop];
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***
***REMOVED***;
    
    
    /* ---------- Node constructors ---------- */
    
    /**
     * The factory for creating nodes of defined type.
     * 
     * ~~~ Node ~~~ is a structure element of an onject or an array
     * with own label (a key of an object or an index of an array)
     * and value of any json data type. The root object or array
     * is a node without label.
     * {...
     * [+] "label": value,
     * ...***REMOVED***
     * 
     * Markup:
     * <li class="jsontree_node [jsontree_node_expanded]">
     *     <span class="jsontree_label-wrapper">
     *         <span class="jsontree_label">
     *             <span class="jsontree_expand-button" />
     *             "label"
     *         </span>
     *         :
     *     </span>
     *     <(div|span) class="jsontree_value jsontree_value_(object|array|boolean|null|number|string)">
     *         ...
     *     </(div|span)>
     * </li>
     *
     * @param label {string***REMOVED*** - key name
     * @param val {Object | Array | string | number | boolean | null***REMOVED*** - a value of node
     * @param isLast {boolean***REMOVED*** - true if node is last in list of siblings
     * 
     * @return {Node***REMOVED***
     */
    function Node(label, val, isLast) {
        var nodeType = utils.getType(val);
        
        if (nodeType in Node.CONSTRUCTORS) {
            return new Node.CONSTRUCTORS[nodeType](label, val, isLast);
    ***REMOVED*** else {
            throw new Error('Bad type: ' + utils.getClass(val));
    ***REMOVED***
***REMOVED***
    
    Node.CONSTRUCTORS = {
        'boolean' : NodeBoolean,
        'number'  : NodeNumber,
        'string'  : NodeString,
        'null'    : NodeNull,
        'object'  : NodeObject,
        'array'   : NodeArray  
***REMOVED***;
    
    
    /*
     * The constructor for simple types (string, number, boolean, null)
     * {...
     * [+] "label": value,
     * ...***REMOVED***
     * value = string || number || boolean || null
     *
     * Markup:
     * <li class="jsontree_node">
     *     <span class="jsontree_label-wrapper">
     *         <span class="jsontree_label">"age"</span>
     *         :
     *     </span>
     *     <span class="jsontree_value jsontree_value_(number|boolean|string|null)">25</span>
     *     ,
     * </li>
     *
     * @abstract
     * @param label {string***REMOVED*** - key name
     * @param val {string | number | boolean | null***REMOVED*** - a value of simple types
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function _NodeSimple(label, val, isLast) {
        if (this.constructor === _NodeSimple) {
            throw new Error('This is abstract class');
    ***REMOVED***
        
        var self = this,
            el = document.createElement('li'),
            labelEl,
            template = function(label, val) {
                var str = '\
                    <span class="jsontree_label-wrapper">\
                        <span class="jsontree_label">"' +
                            label +
                        '"</span> : \
                    </span>\
                    <span class="jsontree_value-wrapper">\
                        <span class="jsontree_value jsontree_value_' + self.type + '">' +
                            val +
                        '</span>' +
                        (!isLast ? ',' : '') + 
                    '</span>';
    
                return str;
        ***REMOVED***;
            
        self.label = label;
        self.isComplex = false;
    
        el.classList.add('jsontree_node');
        el.innerHTML = template(label, val);
    
        self.el = el;

        labelEl = el.querySelector('.jsontree_label');
    
        labelEl.addEventListener('click', function(e) {
            if (e.altKey) {
                self.toggleMarked();
                return;
        ***REMOVED***

            if (e.shiftKey) {
                document.getSelection().removeAllRanges();
                alert(self.getJSONPath());
                return;
        ***REMOVED***
    ***REMOVED***, false);
***REMOVED***

    _NodeSimple.prototype = {
        constructor : _NodeSimple,

        /**
         * Mark node
         */
        mark : function() {
            this.el.classList.add('jsontree_node_marked');    
    ***REMOVED***,

        /**
         * Unmark node
         */
        unmark : function() {
            this.el.classList.remove('jsontree_node_marked');    
    ***REMOVED***,

        /**
         * Mark or unmark node
         */
        toggleMarked : function() {
            this.el.classList.toggle('jsontree_node_marked');    
    ***REMOVED***,

        /**
         * Expands parent node of this node
         *
         * @param isRecursive {boolean***REMOVED*** - if true, expands all parent nodes
         *                                (from node to root)
         */
        expandParent : function(isRecursive) {
            if (!this.parent) {
                return;
        ***REMOVED***
               
            this.parent.expand(); 
            this.parent.expandParent(isRecursive);
    ***REMOVED***,

        /**
         * Returns JSON-path of this 
         * 
         * @param isInDotNotation {boolean***REMOVED*** - kind of notation for returned json-path
         *                                    (by default, in bracket notation)
         * @returns {string***REMOVED***
         */
        getJSONPath : function(isInDotNotation) {
            if (this.isRoot) {
                return "$";
        ***REMOVED***

            var currentPath;

            if (this.parent.type === 'array') {
                currentPath = "[" + this.label + "]";
        ***REMOVED*** else {
                currentPath = isInDotNotation ? "." + this.label : "['" + this.label + "']";
        ***REMOVED***

            return this.parent.getJSONPath(isInDotNotation) + currentPath; 
    ***REMOVED***
***REMOVED***;
    
    
    /*
     * The constructor for boolean values
     * {...
     * [+] "label": boolean,
     * ...***REMOVED***
     * boolean = true || false
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {boolean***REMOVED*** - value of boolean type, true or false
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function NodeBoolean(label, val, isLast) {
        this.type = "boolean";
    
        _NodeSimple.call(this, label, val, isLast);
***REMOVED***
    utils.inherits(NodeBoolean,_NodeSimple);
    
    
    /*
     * The constructor for number values
     * {...
     * [+] "label": number,
     * ...***REMOVED***
     * number = 123
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {number***REMOVED*** - value of number type, for example 123
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function NodeNumber(label, val, isLast) {
        this.type = "number";
    
        _NodeSimple.call(this, label, val, isLast);
***REMOVED***
    utils.inherits(NodeNumber,_NodeSimple);
    
    
    /*
     * The constructor for string values
     * {...
     * [+] "label": string,
     * ...***REMOVED***
     * string = "abc"
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {string***REMOVED*** - value of string type, for example "abc"
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function NodeString(label, val, isLast) {
        this.type = "string";
    
        _NodeSimple.call(this, label, '"' + val + '"', isLast);
***REMOVED***
    utils.inherits(NodeString,_NodeSimple);
    
    
    /*
     * The constructor for null values
     * {...
     * [+] "label": null,
     * ...***REMOVED***
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {null***REMOVED*** - value (only null)
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function NodeNull(label, val, isLast) {
        this.type = "null";
    
        _NodeSimple.call(this, label, val, isLast);
***REMOVED***
    utils.inherits(NodeNull,_NodeSimple);
    
    
    /*
     * The constructor for complex types (object, array)
     * {...
     * [+] "label": value,
     * ...***REMOVED***
     * value = object || array
     *
     * Markup:
     * <li class="jsontree_node jsontree_node_(object|array) [expanded]">
     *     <span class="jsontree_label-wrapper">
     *         <span class="jsontree_label">
     *             <span class="jsontree_expand-button" />
     *             "label"
     *         </span>
     *         :
     *     </span>
     *     <div class="jsontree_value">
     *         <b>{</b>
     *         <ul class="jsontree_child-nodes" />
     *         <b>***REMOVED***</b>
     *         ,
     *     </div>
     * </li>
     *
     * @abstract
     * @param label {string***REMOVED*** - key name
     * @param val {Object | Array***REMOVED*** - a value of complex types, object or array
     * @param isLast {boolean***REMOVED*** - true if node is last in list of parent childNodes
     */
    function _NodeComplex(label, val, isLast) {
        if (this.constructor === _NodeComplex) {
            throw new Error('This is abstract class');
    ***REMOVED***
        
        var self = this,
            el = document.createElement('li'),
            template = function(label, sym) {
                var comma = (!isLast) ? ',' : '',
                    str = '\
                        <div class="jsontree_value-wrapper">\
                            <div class="jsontree_value jsontree_value_' + self.type + '">\
                                <b>' + sym[0] + '</b>\
                                <span class="jsontree_show-more">&hellip;</span>\
                                <ul class="jsontree_child-nodes"></ul>\
                                <b>' + sym[1] + '</b>' +
                            '</div>' + comma +
                        '</div>';
    
                if (label !== null) {
                    str = '\
                        <span class="jsontree_label-wrapper">\
                            <span class="jsontree_label">' +
                                '<span class="jsontree_expand-button"></span>' +
                                '"' + label +
                            '"</span> : \
                        </span>' + str;
            ***REMOVED***
    
                return str;
        ***REMOVED***,
            childNodesUl,
            labelEl,
            moreContentEl,
            childNodes = [];
    
        self.label = label;
        self.isComplex = true;
    
        el.classList.add('jsontree_node');
        el.classList.add('jsontree_node_complex');
        el.innerHTML = template(label, self.sym);
    
        childNodesUl = el.querySelector('.jsontree_child-nodes');
    
        if (label !== null) {
            labelEl = el.querySelector('.jsontree_label');
            moreContentEl = el.querySelector('.jsontree_show-more');
    
            labelEl.addEventListener('click', function(e) {
                if (e.altKey) {
                    self.toggleMarked();
                    return;
            ***REMOVED***

                if (e.shiftKey) {
                    document.getSelection().removeAllRanges();
                    alert(self.getJSONPath());
                    return;
            ***REMOVED***

                self.toggle(e.ctrlKey || e.metaKey);
        ***REMOVED***, false);
            
            moreContentEl.addEventListener('click', function(e) {
                self.toggle(e.ctrlKey || e.metaKey);
        ***REMOVED***, false);
    
            self.isRoot = false;
    ***REMOVED*** else {
            self.isRoot = true;
            self.parent = null;
    
            el.classList.add('jsontree_node_expanded');
    ***REMOVED***
    
        self.el = el;
        self.childNodes = childNodes;
        self.childNodesUl = childNodesUl;
    
        utils.forEachNode(val, function(label, node, isLast) {
            self.addChild(new Node(label, node, isLast));
    ***REMOVED***);
    
        self.isEmpty = !Boolean(childNodes.length);
        if (self.isEmpty) {
            el.classList.add('jsontree_node_empty');
    ***REMOVED***
***REMOVED***

    utils.inherits(_NodeComplex, _NodeSimple);
    
    utils.extend(_NodeComplex.prototype, {
        constructor : _NodeComplex,
        
        /*
         * Add child node to list of child nodes
         *
         * @param child {Node***REMOVED*** - child node
         */
        addChild : function(child) {
            this.childNodes.push(child);
            this.childNodesUl.appendChild(child.el);
            child.parent = this;
    ***REMOVED***,
    
        /*
         * Expands this list of node child nodes
         *
         * @param isRecursive {boolean***REMOVED*** - if true, expands all child nodes
         */
        expand : function(isRecursive){
            if (this.isEmpty) {
                return;
        ***REMOVED***
            
            if (!this.isRoot) {
                this.el.classList.add('jsontree_node_expanded');
        ***REMOVED***
    
            if (isRecursive) {
                this.childNodes.forEach(function(item, i) {
                    if (item.isComplex) {
                        item.expand(isRecursive);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***,
    
        /*
         * Collapses this list of node child nodes
         *
         * @param isRecursive {boolean***REMOVED*** - if true, collapses all child nodes
         */
        collapse : function(isRecursive) {
            if (this.isEmpty) {
                return;
        ***REMOVED***
            
            if (!this.isRoot) {
                this.el.classList.remove('jsontree_node_expanded');
        ***REMOVED***
    
            if (isRecursive) {
                this.childNodes.forEach(function(item, i) {
                    if (item.isComplex) {
                        item.collapse(isRecursive);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***,
    
        /*
         * Expands collapsed or collapses expanded node
         *
         * @param {boolean***REMOVED*** isRecursive - Expand all child nodes if this node is expanded
         *                                and collapse it otherwise
         */
        toggle : function(isRecursive) {
            if (this.isEmpty) {
                return;
        ***REMOVED***
            
            this.el.classList.toggle('jsontree_node_expanded');
            
            if (isRecursive) {
                var isExpanded = this.el.classList.contains('jsontree_node_expanded');
                
                this.childNodes.forEach(function(item, i) {
                    if (item.isComplex) {
                        item[isExpanded ? 'expand' : 'collapse'](isRecursive);
                ***REMOVED***
            ***REMOVED***);
        ***REMOVED***
    ***REMOVED***,

        /**
         * Find child nodes that match some conditions and handle it
         * 
         * @param {Function***REMOVED*** matcher
         * @param {Function***REMOVED*** handler
         * @param {boolean***REMOVED*** isRecursive
         */
        findChildren : function(matcher, handler, isRecursive) {
            if (this.isEmpty) {
                return;
        ***REMOVED***
            
            this.childNodes.forEach(function(item, i) {
                if (matcher(item)) {
                    handler(item);
            ***REMOVED***

                if (item.isComplex && isRecursive) {
                    item.findChildren(matcher, handler, isRecursive);
            ***REMOVED***
        ***REMOVED***);
    ***REMOVED***
***REMOVED***);
    
    
    /*
     * The constructor for object values
     * {...
     * [+] "label": object,
     * ...***REMOVED***
     * object = {"abc": "def"***REMOVED***
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {Object***REMOVED*** - value of object type, {"abc": "def"***REMOVED***
     * @param isLast {boolean***REMOVED*** - true if node is last in list of siblings
     */
    function NodeObject(label, val, isLast) {
        this.sym = ['{', '***REMOVED***'];
        this.type = "object";
    
        _NodeComplex.call(this, label, val, isLast);
***REMOVED***
    utils.inherits(NodeObject,_NodeComplex);
    
    
    /*
     * The constructor for array values
     * {...
     * [+] "label": array,
     * ...***REMOVED***
     * array = [1,2,3]
     *
     * @constructor
     * @param label {string***REMOVED*** - key name
     * @param val {Array***REMOVED*** - value of array type, [1,2,3]
     * @param isLast {boolean***REMOVED*** - true if node is last in list of siblings
     */
    function NodeArray(label, val, isLast) {
        this.sym = ['[', ']'];
        this.type = "array";
    
        _NodeComplex.call(this, label, val, isLast);
***REMOVED***
    utils.inherits(NodeArray, _NodeComplex);
    
    
    /* ---------- The tree constructor ---------- */
    
    /*
     * The constructor for json tree.
     * It contains only one Node (Array or Object), without property name.
     * CSS-styles of .tree define main tree styles like font-family,
     * font-size and own margins.
     *
     * Markup:
     * <ul class="jsontree_tree clearfix">
     *     {Node***REMOVED***
     * </ul>
     *
     * @constructor
     * @param jsonObj {Object | Array***REMOVED*** - data for tree
     * @param domEl {DOMElement***REMOVED*** - DOM-element, wrapper for tree
     */
    function Tree(jsonObj, domEl) {
        this.wrapper = document.createElement('ul');
        this.wrapper.className = 'jsontree_tree clearfix';
        
        this.rootNode = null;
        
        this.sourceJSONObj = jsonObj;

        this.loadData(jsonObj);
        this.appendTo(domEl);
***REMOVED***
    
    Tree.prototype = {
        constructor : Tree,
        
        /**
         * Fill new data in current json tree
         *
         * @param {Object | Array***REMOVED*** jsonObj - json-data
         */
        loadData : function(jsonObj) {
            if (!utils.isValidRoot(jsonObj)) {
                alert('The root should be an object or an array');
                return;
        ***REMOVED***

            this.sourceJSONObj = jsonObj;
            
            this.rootNode = new Node(null, jsonObj, 'last');
            this.wrapper.innerHTML = '';
            this.wrapper.appendChild(this.rootNode.el);
    ***REMOVED***,
        
        /**
         * Appends tree to DOM-element (or move it to new place)
         *
         * @param {DOMElement***REMOVED*** domEl 
         */
        appendTo : function(domEl) {
            domEl.appendChild(this.wrapper);
    ***REMOVED***,
        
        /**
         * Expands all tree nodes (objects or arrays) recursively
         *
         * @param {Function***REMOVED*** filterFunc - 'true' if this node should be expanded
         */
        expand : function(filterFunc) {
            if (this.rootNode.isComplex) {
                if (typeof filterFunc == 'function') {
                    this.rootNode.childNodes.forEach(function(item, i) {
                        if (item.isComplex && filterFunc(item)) {
                            item.expand();
                    ***REMOVED***
                ***REMOVED***);
            ***REMOVED*** else {
                    this.rootNode.expand('recursive');
            ***REMOVED***
        ***REMOVED***
    ***REMOVED***,
       
        /**
         * Collapses all tree nodes (objects or arrays) recursively
         */
        collapse : function() {
            if (typeof this.rootNode.collapse === 'function') {
                this.rootNode.collapse('recursive');
        ***REMOVED***
    ***REMOVED***,

        /**
         * Returns the source json-string (pretty-printed)
         * 
         * @param {boolean***REMOVED*** isPrettyPrinted - 'true' for pretty-printed string
         * @returns {string***REMOVED*** - for exemple, '{"a":2,"b":3***REMOVED***'
         */
        toSourceJSON : function(isPrettyPrinted) {
            if (!isPrettyPrinted) {
                return JSON.stringify(this.sourceJSONObj);
        ***REMOVED***

            var DELIMETER = "[%^$#$%^%]",
                jsonStr = JSON.stringify(this.sourceJSONObj, null, DELIMETER);

            jsonStr = jsonStr.split("\n").join("<br />");
            jsonStr = jsonStr.split(DELIMETER).join("&nbsp;&nbsp;&nbsp;&nbsp;");

            return jsonStr;
    ***REMOVED***,

        /**
         * Find all nodes that match some conditions and handle it
         */
        findAndHandle : function(matcher, handler) {
            this.rootNode.findChildren(matcher, handler, 'isRecursive');
    ***REMOVED***,

        /**
         * Unmark all nodes
         */
        unmarkAll : function() {
            this.rootNode.findChildren(function(node) {
                return true;
        ***REMOVED***, function(node) {
                node.unmark();
        ***REMOVED***, 'isRecursive');
    ***REMOVED***
***REMOVED***;

    
    /* ---------- Public methods ---------- */
    return {
        /**
         * Creates new tree by data and appends it to the DOM-element
         * 
         * @param jsonObj {Object | Array***REMOVED*** - json-data
         * @param domEl {DOMElement***REMOVED*** - the wrapper element
         * @returns {Tree***REMOVED***
         */
        create : function(jsonObj, domEl) {
            return new Tree(jsonObj, domEl);
    ***REMOVED***
***REMOVED***;
***REMOVED***)();
