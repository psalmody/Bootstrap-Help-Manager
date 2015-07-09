(function($) {
    $('#helpsManager').on('click','.nav.nav-tabs a',function(e) {
        e.preventDefault()
        $(this).tab('show')
    })

    $.fn.ManageHelperConsole = function( opts ) {
        var helpconsole = this;
        var settings = helpconsole.settings
        var self = this;

        helpconsole.settings = $.extend({},{
            addButton: '<button class="btn btn-sm btn-block btn-default addHelper">Add</button>',
            columns: ['Field Selecter','Modal Title','Size','Content','Save'],
            ajaxFail: false,
            templates: 'templates/bhm.console.html'
        }, helpconsole.settings, opts);

        BHM.collPages.render = function() {
            var models = this.models;
            $.each(models,function() {
                makeTab(this);
            })
        }

        this._init = function( opts ) {

            setupTabs();

            BHM.collHelps.fetch(function() {
                BHM.collPages.fetch(function() {
                    this.render();
                    addNewTab();
                })
            })

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
            makeTable(tabContent,page);
            return tabContent;
        }

        var makeTable = function( obj, page ) {
            var cols = self.settings.columns.slice(0);
            cols.push(self.settings.addButton);
            var jsondata = [];
            var helps = BHM.collHelps.find(page.get('id').toString(),'help_page_id');
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
            newhelp.set('id',(Number(BHM.collHelps.max('id'))+1).toString());
            BHM.collHelps.add(newhelp);
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
            BHM.collHelps.remove(help);
            tr.fadeOut(500,function() {
                $(this).remove();
                //better check if this is the last help on that page and delete page
                var allhelps = BHM.collHelps.find(help.get('help_page_id'),'help_page_id');
                if (!allhelps) {
                    var page = BHM.collPages.find(help.get('help_page_id'),'id');
                    page = page[0];
                    removePage(page);
                    page.delete();
                    BHM.collPages.remove(page);
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
            newpage.set('id',Number(BHM.collPages.max('id'))+1);
            BHM.collPages.add(newpage);
            newpage.save();
            newpage.fetch();
            BHM.collPages.add(newpage);
            var newhelp = new BHM.helper();
            newhelp.set('help_page_id',newpage.get('id'));
            newhelp.set('id',Number(BHM.collHelps.max('id'))+1);
            newhelp.set('filename',url);
            BHM.collHelps.add(newhelp);
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
            var arr = BHM.collHelps.find( help.toString(), 'id' );
            return arr[0];
        }

        function getPageFor( obj ) {
            var arr = BHM.collPages.find(obj.closest('.tab-pane').data('id').toString(),'id');
            return arr[0];
        }


    }



}(jQuery));

// Prevent bootstrap dialog from blocking focusin - necessary for CKEDITOR
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".cke_dialog_body").length) {
		e.stopImmediatePropagation();
	}
});
