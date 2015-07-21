/**
*  Bootstrap-Help-Manager v 0.5.1
*  https://github.com/psalmody/Bootstrap-Help-Manager
*/
/**
* JSONTable plugin - takes jsondata or url and converts to bootstrap table
*/
(function ($) {

    $.fn.JSONTable = function (options) {
        var settings = $.extend({}, {
            url: false,
            data: false,
            method: 'GET',
            tableClasses: 'table-condensed table-striped',
            responsive: false,
            dataType: 'JSON',
            appendTo: false,
            noWraps: [],
            success: false,
            nodata: false,
            columns: [],
            options: {},
            template: false,
            ajaxstatus: false,
            templateParams: {}
        }, options)

        if (!settings.url && !settings.data) {
            console.log('url or data must be specified for JSONTable plugin.');
            return;
        }

        var table, thead, tbody, div;

        var self = this;

        if (settings.data) {
            formatData(settings.data, 'local, no ajax', false);
        } else {
            $.ajax({
                method: settings.method,
                url: settings.url,
                data: settings.options,
                dataType: settings.dataType
            }).done(function ( data, status, xhr ) {
                formatData( data, status, xhr );
            }).fail(function ( xhr, status, error) {
                if (typeof(settings.fail) == 'function') {
                    settings.fail(xhr, status, error);
                }
            });
        }

        function formatData( data, status, xhr ) {
            if (data.length < 1) {
                if (typeof (settings.nodata) == 'function') {
                    settings.nodata(table, status, xhr);
                }
                return self;
            }

            if (self.prop('tagName') != 'TABLE') {
                div = self;
                div.empty();
                table = $('<table class="table ' + settings.tableClasses + '"><thead></thead><tbody></tbody></table>');
                div.append(table);
                if (settings.responsive) {
                    div.addClass('table-responsive');
                }
                table.hide();
            } else {
                table = self;
                div = self.closest('div');
                if (settings.tableClasses) {
                    table.addClass(settings.tableClasses);
                }
                if (settings.responsive) {
                    div.addClass('table-responsive');
                }
            }

            if (table.find('thead').length > 0) {
                thead = table.find('thead');
            } else {
                thead = $('<thead></thead>');
                table.append(thead);
            }

            if (table.find('tbody').length > 0) {
                tbody = table.find('tbody');
                tbody.empty();
            } else {
                tbody = $('<tbody></tbody>');
                table.append(tbody);
            }


            if (thead.find('tr').length < 1) {
                var tr = $('<tr></tr>');
                thead.append(tr);
                if (settings.columns.length > 0) {
                    $.each(settings.columns, function (i) {
                        var th = $('<th></th>');
                        tr.append(th);
                        th.html(settings.columns[i]);
                    })
                } else {
                    $.each(data[0], function (k, v) {
                        var th = $('<th></th>');
                        tr.append(th);
                        th.html(k);
                    });
                }
            }
            $(data).each(function () {
                if (settings.template) {
                    tbody.append(BHM.tmpl(settings.template.html(),$.extend(this,settings.templateParams)));
                    return;
                }
                var tr = $('<tr></tr>');
                tbody.append(tr);
                $.each(this, function (k, v) {
                    var td = $('<td></td>');
                    if (settings.noWraps.indexOf(k) >= 0 || settings.noWraps.indexOf('allrows') >= 0) {
                        td.addClass('noWrap');
                    }
                    tr.append(td);
                    td.html(v);
                })
            });

            table.show();
            if (typeof (settings.success) == 'function') {
                settings.success(table, status, xhr );
            }
            return self;
        }

    }

}(jQuery));
;
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
var BHM = (function(my){
  var cache = {};

  my.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };

  return my;
})(BHM || {});
;
/**
* bhm.vertebrate.js - define Vertebrate models & collections
*/

var BHM = (function(Vertebrate, $, my) {

    my.helper = Vertebrate.Model.Extend({
        attributes: {
            id: -1,
            field_selecter: '',
            title: '',
            large: false,
            html: '',
            page_ids: []
        },
        /*url: BHM.helpersurl*/
    })

    my.page = Vertebrate.Model.Extend({
        attributes: {
            "id": -1,
            "url": ''
        },
        /*url: BHM.pagesurl*/
    });

    my.helpers = Vertebrate.Collection.Extend({
        model: my.helper,
        /*url: BHM.helpersurl*/
    });

    my.pages = Vertebrate.Collection.Extend({
        model: my.page,
        /*url: BHM.pagesurl*/
    });


    my.cp = new my.pages();
    my.ch = new my.helpers();

    return my;
}(Vertebrate, jQuery, BHM || {}));
;
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
;
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



(function($) {
    $.fn.BHMConsole = function(opts) {

        var mc = BHM.mc;
        mc.settings = $.extend({},mc.settings,opts);
        mc.$el = this;
        mc.render();

        var self = this;

        var getPageFor = function( $obj ) {
            return BHM.cp.find($obj.closest('.panel-default').data('pageid'),'id');
        };
        var getHelpFor = function( $obj ) {
            return BHM.ch.find($obj.closest('tr').data('help-id'),'id');
        };
        var getElForHelp = function( model ) {
            return $('.help'+model.get('id'));
        };


        $(document).on('vertebrate:fetched', function(e, c, ms) {
            c.render();
        }).on('vertebrate:changeattr',function(e,m,mattr,mchanged) {
            if (m.has('url')) return false;
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
            var help = getHelpFor( $(this) );
            help.save();
            var el = getElForHelp(help);
            el.find('.saveHelp').removeClass('btn-warning');
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
                        $.when($('#bhmpanel'+page.get('id')).fadeOut(300)).then(function() {
                            return $('#bhmpanelheader'+page.get('id')).fadeOut(300);
                        }).then(function() {
                            $('#bhmpanel'+page.get('id')).closest('.panel-default').remove();
                            self.find('.panel-title a:first').click();
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
                id: BHM.ch.next('id').toString()
            });
            BHM.ch.add(model);
            BHM.renderHelp( model );
            getElForHelp( model ).find('.saveHelp').addClass('btn-warning');
        }).on('click','.editHelp',function() {
            var model = getHelpFor($(this));
            var modal = $('#bhmEditHtmlModal');
            $('#bhmEditHtmlModalFilename').text(model.get('filename'));
            $('#bhmEditHtmlModalFieldselecter').text(model.get('field_selecter'));
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
                "page_ids": id
            })
            BHM.cp.add(page);
            BHM.ch.add(help);
            BHM.renderPage(page);
            BHM.renderHelp(help);
            page.save();
            help.save();
            $('#bhmpanelheader'+page.get('id')+' a:first').click();
        }).on('click','.bhm-change-url',function() {
            page = getPageFor($(this));
            var newurl = prompt("Enter the new url:",page.get('url'));
            if (!newurl) return false;
            page.set('url',newurl);
            page.save();
            $(this).closest('.panel-title').children('a').text(newurl);
        }).on('click','.addToPages',function() {
            help = getHelpFor($(this));
            var modal = $('#bhmSelectMultipleModal');
            modal.data('helpid',help.get('id'));
            var pages = BHM.cp.models;
            var rows = [];
            $.each(pages,function() {
                var checkbox = '<input type="checkbox" value="'+this.get('id')+'">';
                var row = {
                    "checkbox": checkbox,
                    url: this.get('url')
                };
                rows.push(row);
            });
            modal.find('.modal-body').JSONTable({
                data: rows,
                columns: ['Appears On:','Page:']
            })
            modal.find('.modal-body tbody input[type="checkbox"]').each(function() {
                if (help.get('page_ids').indexOf($(this).val()) > -1) $(this).attr('checked',true);
            })
            modal.modal();
        });

        //setup modal dialog
        $('body').on('click','#bhmEditHtmlModal .btn-save-html', function() {
            var modal = $('#bhmEditHtmlModal'),
                model = BHM.ch.find(modal.data('helpId'),'id');
            model.set('html',CKEDITOR.instances['bhmTextareaEditor'].getData());
            CKEDITOR.instances['bhmTextareaEditor'].setData('');
            $('#bhmEditHtmlModal').modal('hide');
        });

        //setup multi-page dialog
        $('body').on('click','#bhmSelectMultipleModal .btn-save-page-ids',function() {
            var modal = $('#bhmSelectMultipleModal'),
                model = BHM.ch.find(modal.data('helpid'),'id');
            //setup modal with all pages in it as checkboxes
            var newpageids = [];
            if (!modal.find('input[type="checkbox"]:checked').length) {
                alert('At least one checkbox must be selected.');
                return false;
            }
            //for each checkbox :checked, make list of ids
            modal.find('input[type="checkbox"]:checked').each(function() {
                newpageids.push($(this).val());
            })
            var el = getElForHelp(model);
            if (newpageids.length > 1) {
                //we show the info class on helps that have multiple pages
                el.addClass('info');
            } else {
                el.removeClass('info');
            }
            newpageids = newpageids.join(',');
            //set, hide the modal
            model.set('page_ids',newpageids);
            modal.modal('hide');
            //re-render this model
            el.remove();
            BHM.renderHelp(model);
            var newel = getElForHelp(model);
            //mark as needing saved
            newel.find('.saveHelp').addClass('btn-warning');
            //make sure at least the first model is visible
            if (!newel.first().is(':visible')) {
                newel.first().closest('.panel').find('.panel-title').children('a').click();
            }
        })

    }
}(jQuery));

// Prevent bootstrap dialog from blocking focusin - necessary for CKEDITOR
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".cke_dialog_body").length) {
		e.stopImmediatePropagation();
	}
});
