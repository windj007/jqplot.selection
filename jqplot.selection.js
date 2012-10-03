(function($) {
    $.jqplot.Selection = function() {

        this.show = $.jqplot.config.enablePlugins;

        this.renderer = new $.jqplot.LineRenderer();
        this.rendererOptions = {
                showLine : false,
                showMarker : true
            };

        this.markerRenderer = new $.jqplot.MarkerRenderer();
        this.selectedMarkerOptions = {
                size: 15
        };

        // indices of selected points in series.data array 
        this.selectedPoints = [];

        this.onSelect = null;
        this.onDeselect = null;
    };
    
    $.jqplot.postSeriesInitHooks.push(parseSelectionOptions);
    $.jqplot.postDrawSeriesHooks.push(drawSelection);
    $.jqplot.postInitHooks.push(subscribeEvents);
    
    // called within scope of a series
    function parseSelectionOptions (target, data, seriesDefaults, options, plot) {
        this.selection = new $.jqplot.Selection();
        options = options || {};
        $.extend(true, this.selection,
                { selectedMarkerOptions: { color : this.color } },
                seriesDefaults.selection,
                options.selection);
        this.selection.renderer.init.call(this.selection, null);
        this.selection.markerRenderer.init.call(this.selection.markerRenderer, this.selection.selectedMarkerOptions);
    }
    
    // called within scope of series object
    function drawSelection(sctx, options) {
        // if we have options, merge trendline options in with precedence
        options = $.extend(true, {}, this.selection, options);

        if (options.show) {
            var data = this.data;
            var points = $.map(options.selectedPoints, function (idx) { return [data[idx]]; });
            var gridData = this.renderer.makeGridData.call(this, points);
            this.selection.renderer.draw.call(this.selection, sctx, gridData, {});
        }
    }
    
    // called within scope of plot object
    function subscribeEvents(plot, data, options) {
        this.target.bind('jqplotDataClick', $.proxy(onPointClick, this));
        this.togglePoint = $.proxy(togglePoint, this);
    }
    
    // called within scope of plot object
    function onPointClick(ev, seriesIndex, pointIndex, data) {
        this.togglePoint(seriesIndex, pointIndex);
    }
    
    function togglePoint(seriesIndex, pointIndex) {
        var series = this.series[seriesIndex];
        if (!series.selection || !series.selection.show)
            return;
        var found_idx = series.selection.selectedPoints.indexOf(pointIndex);
        
        var args = [seriesIndex, pointIndex];
        if (found_idx == -1) { // has not been selected before
            series.selection.selectedPoints.push(pointIndex);
            this.drawSeries({}, seriesIndex);
            
            if (series.selection.onSelect)
                series.selection.onSelect.apply(this, args);
            this.target.trigger('jqplotPointSelected', args);
        } else {
            series.selection.selectedPoints.splice(found_idx, 1);
            this.drawSeries({}, seriesIndex);
            
            if (series.selection.onDeselect)
                series.selection.onDeselect.apply(this, args);
            this.target.trigger('jqplotPointDeselected', args);
        }
    }

})(jQuery);