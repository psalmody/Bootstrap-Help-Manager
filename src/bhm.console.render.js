/*
* bhm.console.render.js render functions for BHM
*/
var BHM = (function(Vertebrate, $, my) {

    //clean the url for use as DOM id
    var clean = function(what) {
        if (typeof(what) != 'string') return what;
        return what.replace(/([.])|([/])|([ ])/g, '');
    }

    //render a single page
    var renderPage = function( model ) {
        var $el = BHM.mc.$el;
        cleanfilename = clean(model.get('url'));
        //add a panel
        $el.find('.panel-group').append(BHM.tmpl($('#templatePanel').html(),$.extend({},{clean:cleanfilename},model.attributes)));
        //first panel gets open
        $el.find('.panel-collapse:first').addClass('in');
    }

    //render helps by page
    var renderHelps = function( model ) {
        var $el = BHM.mc.$el;
        //we'll be attaching to this panel content
        var panel = $('#bhmpanel'+model.get('id')+' .panel-body');
        //columns for JSONTable from mc settings
        var cols = BHM.mc.settings.columns.slice(0);
        cols.push(BHM.mc.settings.addButton);

        //get all helps that are on this page
        var jsondata = [];
        var helps = [];
        var pageid = model.get('id');
        $.each(BHM.ch.models,function(k,v) {
            if (this.get('page_ids').indexOf(pageid) > -1) helps.push(this);
        });
        $.each(helps,function() {
            jsondata.push(this.attributes);
        });

        //create JSONTable from group of helps
        panel.JSONTable({
            data: jsondata,
            template: $('#templateHelperRow'),
            templateParams: {'filename':model.get('url')},
            columns: cols,
            success: function() {
                $('.helpHTML').hide();
            }
        });
    }

    //render only one help
    var renderHelp = function( model ) {
        var $el = BHM.mc.$el;

        //if there isn't a table yet, create one by running this as renderHelps
        if ($('#bhmpanel'+model.get('help_page_id')+' .panel-body').length) {
            var page = BHM.cp.find(model.get('help_page_id'),'id');
            renderHelps( page );
            return true;
        }

        //get filename, find tbody and prepend a new row
        var page_ids = model.get('page_ids').split(',');
        $.each(page_ids,function(k,v) {
            var prependto = false;
            $('#bhmpanel'+v+' .panel-body tbody tr').each(function() {
                var help = BHM.ch.find($(this).data('help-id'),'id');
                if (model.get('field_selecter') > help.get('field_selecter')) {
                    return true;
                } else {
                    prependto = $(this);
                    return false;
                }
            });
            var newrow = BHM.tmpl($('#templateHelperRow').html(),model.get());
            if (!prependto) {
                $('#bhmpanel'+v+' .panel-body tbody').append(newrow);
            } else {
                prependto.before(newrow);
            }

        });
        if (page_ids.length > 1) $('.help'+model.get('id')).addClass('info');

    }

    //cp - pages collections - render
    my.cp = BHM.cp || {};
    my.cp.render = function() {
        var self = this;
        var models = this.models;
        var $el = BHM.mc.$el;
        $el.find('ul').empty();
        $.each(models,function() {
            //render each page
            renderPage( this );
        });
        //add text and "Add New Page" button from template
        $el.prepend($('#templateOpeningText').html());
    }

    //ch - helps collection - render all
    my.ch = BHM.ch || {};
    my.ch.render = function() {
        var self = this;
        var pages = BHM.cp.models;
        var $el = BHM.mc.$el;
        $.each(pages,function() {
            //render helps for each page
            renderHelps( this );
        })
    }

    //publicize these functions
    my.renderHelp = function(model) {
        return renderHelp(model);
    };
    my.renderPage = function( model ) {
        return renderPage(model);
    };
    my.clean = function( filename ) {
        return clean(filename);
    }

    //keep track of console and settings in BHM.mc
    my.mc = {
        settings: {
            addButton: '<button class="btn btn-sm btn-default btn-block addHelper">Add</button>',
            columns: ['Field Selecter', 'Modal Title', 'Size', 'Content', 'Save'],
            ajaxFail: false,
            templateurl: "",
            helpersurl: "",
            pagesurl: ""
        },
        $el: '', // jQuery object which the console isn't put in
        render: function() {
            //render this object - setup a few important things
            var self = this;

            BHM.ch.url = this.settings.helpersurl;
            BHM.cp.url = this.settings.pagesurl;
            BHM.helper.prototype.url = this.settings.helpersurl;
            BHM.page.prototype.url = this.settings.pagesurl;

            //get templates and setup CKEDITOR in modal
            var dfd = $.get(self.settings.templateurl);

            //setup tabpanel, CKEDITOR in modal when templates are loaded, then fetch collections
            $.when(dfd)
                .then(function( data ) {
                    $('body').append(data);
                    CKEDITOR.replace('bhmTextareaEditor');
                    self.$el.append(BHM.tmpl($('#templatePanelGroup').html(), {}));
                })
                .then(function() {
                    return BHM.cp.fetch()
                })
                .then(function() {
                    return BHM.ch.fetch()
                });

        }
    }

    return my;
}(Vertebrate, jQuery, BHM || {}));
