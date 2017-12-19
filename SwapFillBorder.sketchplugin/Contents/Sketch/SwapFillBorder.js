var swapFillBorder = function(context) {   

    var selection = context.selection;
    var document = context.document;
    var count = selection.count();

    swapStyle()

    /**
     * Swap style
     */
    function swapStyle() {
    	if(count == 0) {
    		showMessage("Select a layer to swap fill and border");
    	}

        for(var i = 0; i < count; i++) {
            var layer = selection.objectAtIndex(i);
            var fills = {};
            var borders = {};
            
			// parse style
			borders = parseStyleBorders([[layer style] borders]);
			fills = parseStyleFills([[layer style] fills]);

			// inherit border properties
			for(var i = 0; i < fills.length; i++) {
				var fill = fills[i];
				var border = borders[i];
				if(border) {
					fill.thickness = border.thickness;
					fill.position = border.position;
				} else {
					fill.thickness = 1;
					fill.position = 0;
				}
			}

            // reset style
            resetStyle(layer);

            // set style
            setStyleFills(layer, borders);
            setStyleBorders(layer, fills);
        }

        context.document.reloadInspector();
    }

	/**
     * Set fill style
     */
    function parseStyleFills(fills) {
		var styles = [];
		var count = fills.count();

		for(var i = 0; i < count; i++) {
			var style = fills[i];
			var parsedStyle = {};

			parsedStyle.isEnabled = [style isEnabled];
			parsedStyle.fillType = [style fillType];
			parsedStyle.gradient = [style gradient];
			parsedStyle.image = [style image];
			parsedStyle.fillColor = [style color];
			parsedStyle.opacity = [[style contextSettings] opacity];
			parsedStyle.blendMode = [[style contextSettings] blendMode];

			styles.push(parsedStyle);
		}

		return styles;
	}

	/**
     * Parse border style
     */
	function parseStyleBorders(borders) {
		var styles = [];
		var count = borders.count();

		for (var i = 0; i < count; i++) {
			var style = borders[i];
			var parsedStyle = {};

			parsedStyle.isEnabled = [style isEnabled];
			parsedStyle.thickness = [style thickness];
			parsedStyle.position = [style position];
			parsedStyle.fillType = [style fillType];
			parsedStyle.fillColor = [style color];
			parsedStyle.gradient = [style gradient];
			parsedStyle.opacity = [[style contextSettings] opacity];
			parsedStyle.blendMode = [[style contextSettings] blendMode];

			styles.push(parsedStyle);
		}

		return styles;
	}

	/**
     * Set fill style
     */
    function setStyleFills(layer, fills) {
        for (var i = 0; i < fills.length; i++) {
			var style = layer.style().addStylePartOfType(0);

			[style setIsEnabled:fills[i].isEnabled];
			[style setFillType:fills[i].fillType];
			[style setGradient:fills[i].gradient];
			[style setColor:fills[i].fillColor];
			//[style setImage:fills[i].image];
			[[style contextSettings] setOpacity:fills[i].opacity];
			[[style contextSettings] setBlendMode:fills[i].blendMode];
		}
	}

	/**
     * Set border style
     */
	function setStyleBorders(layer, borders) {
		var style;

		for (var i = 0; i < borders.length; i++) {
			style = layer.style().addStylePartOfType(1);
			
			[style setIsEnabled:borders[i].isEnabled];
			[style setThickness:borders[i].thickness];
			[style setPosition:borders[i].position];
			[style setFillType:borders[i].fillType];
			[style setGradient:borders[i].gradient];
			[style setColor:borders[i].fillColor];
			[[style contextSettings] setOpacity:borders[i].opacity];
			[[style contextSettings] setBlendMode:borders[i].blendMode];
		}
	}

    /**
     * Reset Style
     */
    function resetStyle(layer) {
		var properties = ["borders", "fills"];

		for (var property in properties) {
			var propertyName = properties[property];
			layer.style()["removeAllStyle" + propertyName[0].toUpperCase() + propertyName.substring(1)]();
		}
	}

    /**
     * Show Message
     */
    function showMessage(message) {
    	document.showMessage(message);
	}

}

swapFillBorder(context);