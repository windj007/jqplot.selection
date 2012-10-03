(function($) {
    
/**
 * Class: $.jqplot.Data
 * Plugin stores plot instance in jQuery data object with key "jqplot".
 */
$.jqplot.Data = function(options) {
    $.extend(true, this, options);
};

// called with scope of plot
$.jqplot.Data.init = function (target, data, opts){
    var options = opts || {};
    this.plugins.data = new $.jqplot.Data(options.data);
    var p = this.plugins.data;
    $("#"+target).data("jqplot", this);
};

$.jqplot.postInitHooks.push($.jqplot.Data.init);
    
        
})(jQuery);