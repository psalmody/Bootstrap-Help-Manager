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
            return $('#help'+model.get('id'));
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
            $('#bhmpanelheader'+page.get('id')+' a:first').click();
        }).on('click','.bhm-change-url',function() {
            page = getPageFor($(this));
            var newurl = prompt("Enter the new url:",page.get('url'));
            if (!newurl) return false;
            page.set('url',newurl);
            page.save();
            $(this).closest('.panel-title').children('a').text(newurl);
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
