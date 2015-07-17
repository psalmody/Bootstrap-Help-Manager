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
        //add a tab
        $el.find('ul').append(BHM.tmpl($('#templateTabLI').html(),$.extend({},{clean:cleanfilename},model.attributes)));
        //add a tab-content div
        $el.find('.tab-content').append(BHM.tmpl($('#templateTabDiv').html(),$.extend({},{clean:cleanfilename},model.attributes)));

        //first tab gets active
        $el.find('ul li:first').addClass('active');
        $el.find('.tab-content .tab-pane:first').addClass('active');
    }

    //render helps by page
    var renderHelps = function( model ) {
        var $el = BHM.mc.$el;
        //we'll be attaching to this tab content
        var tab = $('#_'+clean(model.get('url')));
        //columns for JSONTable from mc settings
        var cols = BHM.mc.settings.columns.slice(0);
        cols.push(BHM.mc.settings.addButton);

        //get all helps that are on this page
        var jsondata = [];
        var helps = BHM.ch.findAll(model.get('id'),'help_page_id');
        $.each(helps,function() {
            jsondata.push(this.attributes);
        });

        //create JSONTable from group of helps
        $el.find('#_'+clean(model.get('url'))).JSONTable({
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
        if ($('#_'+clean(model.get('filename'))).length) {
            var page = BHM.cp.find(model.get('help_page_id'),'id');
            renderHelps( page );
            return true;
        }

        //get filename, find tbody and prepend a new row
        $('#_'+clean(model.get('filename')))
            .find('tbody')
            .prepend(
                BHM.tmpl($('#templateHelperRow').html(),model.get())
            );
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
            addButton: '<button class="btn btn-sm btn-block btn-default addHelper">Add</button>',
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
            //bootstrap tab click functions
            $('#helpsManager').on('click', '.nav.nav-tabs a', function(e) {
                e.preventDefault()
                $(this).tab('show')
            });

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
                    self.$el.append(BHM.tmpl($('#templateTabPanel').html(), {}));
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
