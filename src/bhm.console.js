/* bhm.console.js */

//setup ckeditor styles
(function(CKEDITOR, $) {
    //css for CKEDITOR is every stylesheet on this page
    var cssfiles = $(document).find('link[rel="stylesheet"]');
    var arrcss = ['body{padding:5px;}'];
    cssfiles.each(function() {
        arrcss.push($(this).attr('href'));
    });
    CKEDITOR.config.contentsCss = arrcss;
    CKEDITOR.config.height = 500;
    CKEDITOR.config.htmlEncodeOutput = false;
    CKEDITOR.config.entities = false;
}(CKEDITOR, jQuery));


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
        $el.find('ul').append(tmpl($('#templateTabLI').html(),$.extend({},{clean:cleanfilename},model.attributes)));
        //add a tab-content div
        $el.find('.tab-content').append(tmpl($('#templateTabDiv').html(),$.extend({},{clean:cleanfilename},model.attributes)));

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
                tmpl($('#templateHelperRow').html(),model.get())
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
            templates: '../templates/bhm.console.html',
            helpersurl: "/dev/Bootstrap-Help-Manager/src/bhm.helpers.php",
            pagesurl: "/dev/Bootstrap-Help-Manager/src/bhm.pages.php"
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

            BHM.helpersurl = this.settings.helpersurl;
            BHM.pagesurl = this.settings.pagesurl;

            //get templates and setup CKEDITOR in modal
            var dfd = $.get(self.settings.templates);

            //setup tabpanel, CKEDITOR in modal when templates are loaded, then fetch collections
            $.when(dfd)
                .then(function( data ) {
                    $('body').append(data);
                    CKEDITOR.replace('bhmTextareaEditor');
                    self.$el.append(tmpl($('#templateTabPanel').html(), {}));
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



(function($) {
    $.fn.BHMConsole = function(opts) {

        var mc = BHM.mc;
        mc.settings = $.extend({},mc.settings,opts);
        mc.$el = this;
        mc.render();

        var self = this;

        var getPageFor = function( $obj ) {
            return BHM.cp.find($obj.closest('.tab-pane').data('page-id'),'id');
        };
        var getHelpFor = function( $obj ) {
            return BHM.ch.find($obj.closest('tr').data('help-id'),'id');
        };
        var getElForHelp = function( model ) {
            return $('#help'+model.get('id'));
        };


        $(document).on('vertebrate:fetched', function(e, c, ms) {
            c.render();
        }).on('vertebrate:changeattr',function(e,m,mattr,mchanged) {
            getElForHelp(m).find('.saveHelp').addClass('btn-warning');
        });

        $(this).on('change','input[type="text"]',function() {
            var model = getHelpFor($(this)),
                attr = $(this).data('attr'),
                val = $(this).val();
            if (val == model.get(attr)) return false;
            model.set($(this).data('attr'),$(this).val());
        }).on('click','input[type="checkbox"]',function() {
            var val = $(this).is(':checked') ? 1 : 0,
                model = getHelpFor($(this)),
                old = model.get($(this).data('attr'));
            if (val == old) return false;
            model.set($(this).data('attr'),val);
        }).on('click','.saveHelp',function() {
            getHelpFor( $(this) ).save();
            $(this).removeClass('btn-warning');
        }).on('click','.deleteHelp',function() {
            var sure = confirm('Are you sure you want to delete this row?');
            if (!sure) return false;
            var model = getHelpFor($(this));
            BHM.ch.remove(model);
            $.when(model.delete()).done(function() {
                if (!BHM.ch.findAll(model.get('help_page_id'),'help_page_id')) {
                    var page = BHM.cp.find(model.get('help_page_id'),'id');
                    $.when(page.delete()).done(function() {
                        var cleanurl = BHM.clean(page.get('url'));
                        $.when($('#_'+cleanurl).fadeOut(300)).then(function() {
                            return $('#tab_'+cleanurl).closest('li').fadeOut(300);
                        }).then(function() {
                            $('#tab_'+cleanurl).closest('li').remove();
                            $('#_'+cleanurl).remove();
                            self.find('.nav-tabs li:first a').click();
                        })

                    });
                }
                getElForHelp(model)
                .fadeOut(300,function() {
                    $(this).remove();
                })
            });

        }).on('click','.addHelper',function() {
            var page = getPageFor($(this));
            var model = new BHM.helper({
                id: BHM.ch.next('id').toString(),
                filename: page.get('url'),
                help_page_id: page.get('id')
            });
            BHM.ch.add(model);
            BHM.renderHelp( model );
            getElForHelp( model ).find('.saveHelp').addClass('btn-warning');
        }).on('click','.editHelp',function() {
            var model = getHelpFor($(this));
            var modal = $('#bhmModal');
            $('#bhmModalFilename').text(model.get('filename'));
            $('#bhmModalFieldselecter').text(model.get('field_selecter'));
            CKEDITOR.instances['bhmTextareaEditor'].setData(model.get('html'));
            modal.data('helpId',model.get('id'));
            modal.modal();
        }).on('click','#BHMaddPage',function() {
            var url = prompt('Enter the relative url of the page to add to:');
            if (url.length < 1) return false;
            var id = BHM.cp.next('id').toString();;
            var page = new BHM.page({
                "id": id,
                "url": url
            });
            var help = new BHM.helper({
                "id": BHM.ch.next('id'),
                "filename": url,
                "help_page_id": id
            })
            BHM.cp.add(page);
            BHM.ch.add(help);
            BHM.renderPage(page);
            BHM.renderHelp(help);
            page.save();
            help.save();
            $('#tab_'+BHM.clean(url)).click();
        });

        //setup modal dialog
        $('body').on('click','#bhmModal .btn-save-html', function() {
            var modal = $('#bhmModal'),
                model = BHM.ch.find(modal.data('helpId'),'id');
            model.set('html',CKEDITOR.instances['bhmTextareaEditor'].getData());
            CKEDITOR.instances['bhmTextareaEditor'].setData('');
            $('#bhmModal').modal('hide');
        });

    }
}(jQuery));

// Prevent bootstrap dialog from blocking focusin - necessary for CKEDITOR
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".cke_dialog_body").length) {
		e.stopImmediatePropagation();
	}
});
