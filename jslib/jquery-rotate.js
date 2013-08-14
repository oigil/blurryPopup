/*!
 * 2013.3.30 수정내용 (oigil@daumcorp.com)
 * 1. option으로 rotated에 함수넣으면 callback실행됨.
 * 2. 이미 회전값이 있는 상태에서 ui-rotatable-handle 클릭하면 회전값 초기화됨. 
 * 
 * 
 * jQuery Element Rotation Plugin
 *
 * Requires jQueryUI 
 *
 * Copyright (c) 2010 Pavel Markovnin
 * Dual licensed under the MIT and GPL licenses.
 *
 * http://vremenno.net
 */

(function($) {
	$.fn.rotatable = function(options) {
	
		// Default Values
		var defaults = {
 			rotatorClass: 'ui-rotatable-handle',
 			mtx:          [1, 0, 0, 1],
 			rotated: function(){
 			}
  		},  opts        = $.extend(defaults, options),
  		    _this       = this,
  		    _rotator;      
  		  
  		// Initialization 
  		this.intialize = function() {
        	this.createHandler();
        	
        	dims = {
				'w': _this.width(),
				'h': _this.height()
			};
        	this.updateRotationMatrix(opts.mtx);
        };
        
        // Create Rotation Handler
        this.createHandler = function() {
        	_rotator = $('<div class="'+ opts.rotatorClass+ '"></div>');
  			_this.append(_rotator);
  			
  			this.bindRotation();
        };
                
        // Bind Rotation to Handler
        this.bindRotation = function() {
        
        	// IE Fix
        	if($.browser.msie) {
	        	_rotator.mousedown(function(e) {
	        		e.stopPropagation();
	        	});
	        
	        	_rotator.mouseup(function(e) {
	        		e.stopPropagation();
	        	});
	        }
			
        	_rotator.draggable({
				handle: _rotator,
				helper: 'clone',
				revert: false,
				start:  function(e) {
        			e.stopPropagation();
        			e.stopImmediatePropagation();
        			
        			// TL Corner Coords
        			tl_coords = {
        				'x': parseInt(_this.parent().css('left')),
						'y': parseInt(_this.parent().css('top'))
        			};
        			
        			// Element Width & Height()
        			dims = {
        				'w': _this.width(),
        				'h': _this.height()
        			};
					
					// Center Coords
					center_coords = {
						'x': _this.offset().left + _this.width()  * 0.5,
						'y': _this.offset().top  + _this.height() * 0.5
					};
				},
				drag:  function(e) {
        			e.stopPropagation();
        			e.stopImmediatePropagation();
        			
					// Mouse Coords
					mouse_coords = {
						'x': e.pageX,
						'y': e.pageY
					};	
					
					angle = _this.radToDeg(_this.getAngle(mouse_coords, center_coords)) - 90;
					if($.browser.msie)
						angle = - angle;
					
					//시프트키
					if(e.shiftKey){
						if(angle <= -22.5 && angle > -67.5){
							angle = -45;
						}else if(angle <= -67.5 || angle > 247.5){
							angle = -89.999;
						}else if(angle <= 247.5 && angle > 202.5){
							angle = 225;
						}else if(angle <= 202.5 && angle > 157.5){
							angle = 179.999;
						}else if(angle <= 157.5 && angle > 112.5){
							angle = 135;
						}else if(angle <= 112.5 && angle > 67.5){
							angle = 89.999;
						}else if(angle <= 67.5 && angle > 22.5){
							angle = 45;
						}else if(angle <= 22.5 && angle > -22.5){
							angle = 0;
						};
						return _this.rotate(angle);
						
					}else{
						return _this.rotate(angle);
					};
					
				},
				stop: function(){
					opts.rotated();
				}
        	}).click(function(e){
        		e.stopPropagation();
    			e.stopImmediatePropagation();
    			opts.mtx = [1,0,0,1];
        		_this.intialize();
        		opts.rotated();
        	})
        };
        
        // Get Angle
        this.getAngle = function(ms, ctr) {
        	var x     = ms.x - ctr.x,
        	    y     = - ms.y + ctr.y,
        	    hyp   = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
        	    angle = Math.acos(x / hyp);
        	
        	if (y < 0) {    
        		angle = 2 * Math.PI - angle;
        	}
        	
		    return angle;
        };
        
        // Convert from Degrees to Radians
        this.degToRad = function(d) {
        	return (d * (Math.PI / 180));
        };
        
        // Convert from Radians to Degrees
        this.radToDeg = function(r) {
        	return (r * (180 / Math.PI));
        };
        
        // Rotate Element to the Given Degree
        this.rotate = function(degree) {
        	var cos = Math.cos(_this.degToRad(-degree)),
        	    sin = Math.sin(_this.degToRad(-degree)),
        	    mtx = [cos, sin, (-sin), cos];
        	    
        	this.updateRotationMatrix(mtx);
        };
        
        // Get CSS Transform Matrix (transform: matrix)
        this.getRotationMatrix = function() {
        	var _matrix = _this.css('transform') ? _this.css('transform') : 'matrix(1, 0, 0, 1, 0, 0)';
			    _m      = _matrix.split(','),
        	    m       = [];
        	    
        	for (i = 0; i < 4; i++) {
        		m[i] = parseFloat(_m[i].replace('matrix(', ''));
        	}
        	        	
        	return m;
        };
        
        // Update CSS Transform Matrix (transform: matrix)
        this.updateRotationMatrix = function(m) {
        	var matrix = 'matrix('+ m[0] +', '+ m[1] +', '+ m[2] +', '+ m[3] +', 0, 0)',
        	    ie_matrix = "progid:DXImageTransform.Microsoft.Matrix(M11='"+m[0]+"', M12='"+m[1]+"', M21='"+m[2]+"', M22='"+m[3]+"', sizingMethod='auto expand')";        	
        	  
        	_this.css({
				'-moz-transform'   : matrix,
				'-o-transform'     : matrix,
        		'-webkit-transform': matrix,
        		'-ms-transform'    : matrix,
				'transform'        : matrix,
				'filter'           : ie_matrix,
				'-ms-filter'       : '"' + ie_matrix + '"'
			});
        	
        	// IE Fix
        	if($.browser.msie) {
        		var	coef    = dims.w / dims.h,
	        	    _height = _this.parent().parent().height()
	        	    _width  = coef * _height,
	        	    _top    = (dims.h - _height) / 2,
	        	    _left   = (dims.w - _width) / 2;
	        	
	        	_this.parent().parent().css({
	        		'width'      : _width
	        	});
	        	
	        	_this.parent().css({
	        		'left': _left,
	        		'top' : _top
	        	});
        	};
        	
        };
        
        return this.intialize();  		
	}
})(jQuery);