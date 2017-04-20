function closest(el, selector) {
    try {
        if(!el.parentNode){
            throw new Error('Element by querySelector "' + selector + '" not found!');
        } else {
            return el.parentNode.querySelector(selector) ? el : closest(el.parentNode, selector);
        }
    } catch (e) {
        console.error(e.name + ': ' + e.message);
    }
}



var TabPanelPrototype = Object.create(HTMLElement.prototype);
TabPanelPrototype.createdCallback = function() {
    var self = this;
    self.debag = false;



    // PRIVATE VARS ------------------------------------

	var _activeTabIdx = undefined,
        _nextActiveIndex = 1,
        _abort = false,
        _stop = false,
        _loadStatus = 0,
        _loadElem = undefined,
		_defaultActive = this.getAttribute('data-active') || 1,
		_globalName = this.getAttribute('data-id'),
        _nav = this.querySelector('tab-nav'),
        _content = this.querySelector('tab-content');


	// end PRIVATE VARS --------------------------------

	

	// PROPERIES ---------------------------------------

	this.name = 'tab-panel';
	
	// end PROPERIES -----------------------------------
	


	// INIT --------------------------------------------

	function init(){
		if(_globalName) try {
			_globalName = _globalName.replace(/-([a-z])/g, _upper );
			_globalName = _globalName.replace(_globalName[0], _globalName[0].toUpperCase() );
			
			if(window['tabPanel' + _globalName]){
				throw new Error('Attribute data-id for "ct-tab-panel" must be unique!');
			}
			
			window['tabPanel' + _globalName] = self;

		} catch (e) {
			console.error(e.name + ': ' + e.message, self);
		}

		self.setActive(_defaultActive);
        _loadElem = _createLoadElem();
	};

	// end INIT ----------------------------------------



	// METHODS -----------------------------------------

	this.setActive = function(index){
        if( !self.existIndex(index) ) return -1;

        if(_loadStatus == 0){
            self.dispatchEvent( _setActive_(index) );
        } else if(_loadStatus == 2) {
            _loadStatus = 0;
        }

        if( _checkAbort() ) return false;
        if( _checkStop(index) ) return false;
        if( _checkLoadStatus(index) ) return false;

        _activeTabIdx = index;

        var navItem = self.querySelector('tab-nav-item:nth-of-type(' + index + ')');
        var contentItem = self.querySelector('tab-content-item:nth-of-type(' + index + ')');

        var activeNavItem = _nav.querySelector('tab-nav-item.active');
        var activeContentItem = _content.querySelector('tab-content-item.active');

        if(activeNavItem){
            activeNavItem.classList.remove('active');  
        } 
        if(activeContentItem){
            activeContentItem.classList.remove('active');  
        } 
        
        navItem.classList.add('active');
        contentItem.classList.add('active');

        return index;
    };



    this.next = function() {
        return self.setActive(_activeTabIdx + 1);
    };



    this.prev = function() {
        return self.setActive(_activeTabIdx - 1);
    };



    this.getIndex = function() {
        return _activeTabIdx;
    };



    this.existIndex = function(index) {
        return self.querySelector('tab-nav-item:nth-of-type(' + index + ')') != undefined && _activeTabIdx != index;
    };



    this.abort = function() {
        _abort = true;
        
        if(self.debag){
            console.warn('tabPanel' + _globalName + ": abort event setActive");
        }
    };



    this.stop = function() {
        _stop = true;
        if(self.debag){
            console.warn('tabPanel' + _globalName + ": stop event setActive");
        }
    };



    this.continue = function() {  
        _loadStatus = 2;
        self.setActive(_nextActiveIndex);
        if(self.debag){
            console.warn('tabPanel' + _globalName + ": continue event setActive");
        }
    };



    this.startLoad = function(elem) {
        self.stop();
        _loadStatus = 1;
        _toggleLoader(true, elem);
    };



    this.endLoad = function() {
        _toggleLoader();
        self.continue();
    };



    this.errorLoad = function() {
        _toggleLoader();
        _loadStatus = 0;
        if(self.debag){
            console.error('tabPanel' + _globalName + ": data loading error");
        }
    };

	// end METHODS -------------------------------------



	// PRIVATE METHODS ---------------------------------

    _upper = function(word) {
        return word[1].toUpperCase();
    };



    _checkAbort = function() {
        if(_abort){
            _abort = false;
            return true;
        } 
        return false;
    };



    _checkStop = function(index) {
        if(_stop){
            _stop = false;
            return true;
        } 
        return false;
    };



    _checkLoadStatus = function() {
        if(_loadStatus == 0) return false;
        return true
    }



    _createLoadElem = function() {
        var elem = document.createElement('div');
        elem.classList.add('tab-panel-load');

        var content = document.createElement('div');
        var circle = document.createElement('span');
        
        for(var i=1; i<9; i++){
            content.appendChild(circle.cloneNode());
        }

        elem.appendChild(content);
        _content.appendChild(elem);

        return elem;
    };



    _toggleLoader = function (show, elem) {
        if(show){
            if(elem){
                _loadElem.innerHTML = "";
                _loadElem.appendChild(elem.cloneNode(true));
            }
            _loadElem.classList.add('show');
        } else {
            _loadElem.classList.remove('show');
        }
    };

	// end PRIVATE METHODS -----------------------------



    // CUSTOM EVENTS -----------------------------------

    var _setActive_ = function(nextIndex){
        _nextActiveIndex = nextIndex;
        return new CustomEvent("setActive", {
            bubbles: true,
            cancelable: true,
            detail: {
                nextActiveIndex: nextIndex,
            },
            
        });
    };

    // end CUSTOM EVENTS -------------------------------



	init(); 
};




var TabNavPrototype = Object.create(HTMLElement.prototype);
TabNavPrototype.createdCallback = function() {
    var self = this;



    // PROPERIES ---------------------------------------

    this.name = 'tab-nav';
    
    // end PROPERIES -----------------------------------

};



var TabNavItemPrototype = Object.create(HTMLElement.prototype);
TabNavItemPrototype.createdCallback = function() {
    var self = this;



    // PRIVATE VARS ------------------------------------

    var _index = Array.prototype.indexOf.call(self.parentNode.children, self) + 1,
        _parent = closest(self, 'tab-panel');

    // end PRIVATE VARS --------------------------------

    

    // PROPERIES ---------------------------------------

    this.name = 'tab-nav-item';
    
    // end PROPERIES -----------------------------------
    


    // EVENTS ------------------------------------------

    this.addEventListener('click', function(e) {
        _parent.setActive(_index);
    });

    // end EVENTS --------------------------------------

};



var TabContentPrototype = Object.create(HTMLElement.prototype);
TabContentPrototype.createdCallback = function() {
    var self = this;



};



var TabContentItemPrototype = Object.create(HTMLElement.prototype);
TabContentItemPrototype.createdCallback = function() {
    var self = this;
    
   

};



var TabControlPrototype = Object.create(HTMLElement.prototype);
TabControlPrototype.createdCallback = function() {
    var self = this;



    // PRIVATE VARS ------------------------------------

    var _controlEvent = this.getAttribute('data-event') || "next",
        _controlParams = this.getAttribute('data-params') || "[]",
        _parent = closest(self, 'tab-panel');

    // end PRIVATE VARS --------------------------------

    

    // PROPERIES ---------------------------------------

    this.name = 'tab-control';
    
    // end PROPERIES -----------------------------------
    


   // EVENTS ------------------------------------------

    this.addEventListener('click', function(e) {
        _parent[_controlEvent].apply(false, eval(_controlParams) );
    });

    // end EVENTS --------------------------------------

};



document.registerElement('tab-panel', {prototype: TabPanelPrototype});
document.registerElement('tab-nav', {prototype: TabNavPrototype});
document.registerElement('tab-nav-item', {prototype: TabNavItemPrototype});
document.registerElement('tab-content', {prototype: TabContentPrototype});
document.registerElement('tab-content-item', {prototype: TabContentItemPrototype});
document.registerElement('tab-control', {prototype: TabControlPrototype});

