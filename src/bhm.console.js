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
            var page = getPageFor($(this));
            var modelel = getElForHelp(model);
            var panel = modelel.closest('.panel');
            BHM.ch.remove(model);
            var help_pages = model.get('page_ids').split(',');
            $.when(model.delete()).done(function() {
                modelel.fadeOut(300,function() {
                    modelel.remove();
                    $.each(help_pages,function() {
                        if (!panel.find('tbody tr').length) {
                            page.delete();
                            panel.fadeOut(300,function() {
                                $(this).remove();
                                self.find('.panel-title').children('a').click();
                            })
                        }
                    })
                });
            });

        }).on('click','.addHelper',function() {
            var page = getPageFor($(this));
            var model = new BHM.helper({
                id: BHM.ch.next('id').toString(),
                "page_ids": page.get('id').toString()
            });
            BHM.ch.add(model);
            BHM.renderHelp( model );
            getElForHelp( model ).find('.saveHelp').addClass('btn-warning');
        }).on('click','.editHelp',function() {
            var model = getHelpFor($(this));
            var modal = $('#bhmEditHtmlModal');
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
