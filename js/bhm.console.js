;
// $().JSONTable plugin
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
                    tbody.append(tmpl(settings.template.html(),$.extend(this,settings.templateParams)));
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

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function(){
  var cache = {};

  this.tmpl = function tmpl(str, data){
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
})();

(function($) {
    $('#helpsManager').on('click','.nav.nav-tabs a',function(e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $.fn.ManageHelperConsole = function( opts ) {
        var helpconsole = this;
        var settings = helpconsole.settings;
        var self = this;

        helpconsole.settings = $.extend({},{
            addButton: '<button class="btn btn-sm btn-block btn-default addHelper">Add</button>',
            columns: ['Field Selecter','Modal Title','Size','Content','Save'],
            ajaxFail: false,
            templates: 'templates/bhm.console.html'
        }, helpconsole.settings, opts);

        this._init = function( opts ) {

            //setup tab layout
            setupTabs();

            //setup vertebrate view
            setupVertebrate();

            //setup ckeditor styles
            var cssfiles = $(document).find('link[rel="stylesheet"]');
            var arrcss = ['body{padding:5px;}'];
            cssfiles.each(function() {
                arrcss.push($(this).attr('href'));
            });
            CKEDITOR.config.contentsCss = arrcss;
            CKEDITOR.config.height = 500;
            CKEDITOR.config.htmlEncodeOutput = false;
            CKEDITOR.config.entities = false;
        }

        var clean = function( what ) {
            if (typeof(what) != 'string') return what;
            return what.replace(/([.])|([/])|([ ])/g,'');
        }

        var setupTabs = function() {
            self.append(tmpl($('#templateTabPanel').html(),{}));
        }

        var addNewTab = function() {
            var template = tmpl($('#templateTabLI').html(),{clean:'NewPage',url:'New Page'});
            self.find('ul').append(template);
        }

        var makeTab = function( page, active ) {
            cleanfilename = clean(page.get('url'));
            active = typeof(active) != 'undefined' ? active : false;
            self.find('ul').append(tmpl($('#templateTabLI').html(),$.extend({},{clean:cleanfilename},page.attributes)));

            self.find('.tab-content').append(tmpl($('#templateTabDiv').html(),$.extend({},{clean:cleanfilename},page.attributes)));

            if (active) {
                $('#tab_'+cleanfilename).closest('li').addClass('active');
                $('#_'+cleanfilename).addClass('active');
            } else {
                self.find('ul li:first').addClass('active');
                self.find('.tab-content .tab-pane:first').addClass('active');
            }

            var tabContent = typeof(cleanfilename) == 'string' ? $('#_'+cleanfilename) : cleanfilename;
        }

        var makeTable = function( obj, page ) {
            var cols = self.settings.columns.slice(0);
            cols.push(self.settings.addButton);
            var jsondata = [];
            var helps = BHM.ch.find(page.get('id').toString(),'help_page_id');
            if ($.isArray(helps)) {
                $.each(helps,function() {
                    jsondata.push(this.attributes);
                });
            } else {
                jsondata[0] = helps.attributes;
            }

            obj.JSONTable({
                data: jsondata,
                template: $('#templateHelperRow'),
                templateParams: {'filename':page.get('url')},
                columns: cols,
                success: function() {
                    $('.helpHTML').hide();
                }
            });
            return true;
        }

        //make sure templates are loaded
        var dfd = new $.Deferred;
        if ($('#templateTermRow').length) {
            dfd.resolve();
        } else {
            $.get(self.settings.templates,function(data) {
                $(data).appendTo('body');
                dfd.resolve();
            })
        }
        //initatiate once templates are loaded
        $.when(dfd).done(function() {
            self._init();
        })

        self.on('click','.addHelper',function() {
            var page = getPageFor($(this));
            addHelp( page );
        }).on('click','.editHelp',function() {
            editHelp(getHelpFor($(this)));
        }).on('click','.saveHelp',function() {
            var help = getHelpFor($(this));
            help.save();
            markSaved( help );
        }).on('click','.deleteHelp',function() {
            deleteHelp( getHelpFor($(this)) );
        }).on('change','input[type="text"]',function() {
            var help = getHelpFor($(this));
            help.set($(this).data('attr'),$(this).val());
            if ($(this).val() != $(this).data('value')) markEdited(help);
        }).on('change','input[type="checkbox"]',function() {
            var help = getHelpFor($(this));
            var value = $(this).is(':checked') ? 1 : 0;
            help.set('large',value);
            if (value != $(this).data('value')) markEdited(help);
        }).on('click','#tab_NewPage',function() {
            addNewPage();
        }).on('click','ul.nav-tabs a',function(e) {
            e.preventDefault();
            if ($(this).prop('id') != 'tab_NewPage') {
                $(this).tab('show');
            }
        });

        var ckeditorcount=0;

        function addHelp( page ) {
            var newhelp = new BHM.helper({});
            newhelp.set('id',(Number(BHM.ch.max('id'))+1).toString());
            BHM.ch.add(newhelp);
            console.log(newhelp.get());
            var tbody = $('#_'+clean(page.get('url'))+' tbody');
            var tr = $(tmpl($('#templateHelperRow').html(),$.extend(newhelp.get(),{filename:page.get('url')})));
            tbody.prepend(tr);
            markEdited(newhelp);
        }

        function editHelp( help ) {
            modal = tmpl($('#templateModal').html(),{
                'filename': help.get('filename'),
                'field_selecter': help.get('field_selecter'),
                'html': help.get('html'),
                'id': help.get('id'),
                'random': ckeditorcount
            });
            var modal = $(modal).modal().on('shown.bs.modal',function(e) {
                CKEDITOR.replace('ckeditor'+ckeditorcount);
                //CKEDITOR.add

            }).on('hide.bs.modal',function() {
                CKEDITOR.instances['ckeditor'+ckeditorcount].destroy();
                ckeditorcount++;
            }).on('click','.btn-save-html',function() {
                var ckid = 'ckeditor'+ckeditorcount;
                var ckhtml = CKEDITOR.instances[ckid].getData();
                if (help.get('html').replace(/\n/g,"") !== ckhtml.replace(/\n/g,"")) {
                    help.set('html',ckhtml);
                    markEdited( help );
                }
                modal.modal('hide');
            });
        };

        function markEdited( help ) {
            $('#help'+help.get('id')+' .saveHelp').addClass('btn-warning');
        }

        function markSaved( help ) {
            $('#help'+help.get('id')+' .saveHelp').removeClass('btn-warning').addClass('btn-success');
            setTimeout(function() {
                $('#help'+help.get('id')+' .saveHelp').removeClass('btn-success');
            },5000)
        }

        function deleteHelp( help ) {
            var tr = $('#help'+help.get('id'));
            tr.addClass('danger');
            var sure = confirm('Are you sure you want to delete this helper?');
            if (!sure) {
                tr.removeClass('danger');
                return false;
            };

            help.delete();
            BHM.ch.remove(help);
            tr.fadeOut(500,function() {
                $(this).remove();
                //better check if this is the last help on that page and delete page
                var allhelps = BHM.ch.find(help.get('help_page_id'),'help_page_id');
                if (!allhelps) {
                    var page = BHM.cp.find(help.get('help_page_id'),'id');
                    page = page[0];
                    removePage(page);
                    page.delete();
                    BHM.cp.remove(page);
                }
            });
        }

        function addNewPage() {
            var url = prompt('Copy full url after domain name:');
            if(!url) {
                self.find('ul.nav-tabs li:first').click();
                return false;
            }
            var newpage = new BHM.page();
            newpage.set('url',url);
            newpage.set('id',Number(BHM.cp.max('id'))+1);
            BHM.cp.add(newpage);
            newpage.save();
            newpage.fetch();
            BHM.cp.add(newpage);
            var newhelp = new BHM.helper();
            newhelp.set('help_page_id',newpage.get('id'));
            newhelp.set('id',Number(BHM.ch.max('id'))+1);
            newhelp.set('filename',url);
            BHM.ch.add(newhelp);
            newhelp.save();
            makeTab(newpage);
            $('#tab_'+clean(url)).click();
            $('#tab_NewPage').closest('li').detach().appendTo(self.find('ul.nav-tabs'));
        }

        function removePage( page ) {
            var cleanurl = clean(page.get('url'));
            $('#_'+cleanurl).fadeOut(500,function() {
                $(this).remove();
                $('#tab_'+cleanurl).fadeOut(500,function() {
                    $(this).remove();
                    self.find('ul.nav-tabs li a:first').click();
                })
            });
        }

        function getHelpFor( obj ) {
            var tr = obj.closest('tr'),
                help = tr.data('id');
            var arr = BHM.ch.find( help.toString(), 'id' );
            return arr[0];
        }

        function getPageFor( obj ) {
            var arr = BHM.cp.find(obj.closest('.tab-pane').data('id').toString(),'id');
            return arr[0];
        }

        function setupVertebrate() {

            BHM.cp.render = function() {
                var models = this.models;
                $.each(models,function() {
                    makeTab(this);
                })
            }

            BHM.ch.render = function() {
                var page = BHM.cp.find('');
                //makeTable(tabContent,page);
            }

            $(document).on('vertebrate:fetched',function(e,c,ms) {
                c.render();
                //if (!$('#tab_NewPage').length) addNewTab();
            })



            BHM.ch.fetch()
            BHM.cp.fetch()
        }


    }



}(jQuery));

// Prevent bootstrap dialog from blocking focusin - necessary for CKEDITOR
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".cke_dialog_body").length) {
		e.stopImmediatePropagation();
	}
});
