/*
* bhm.BHMclient.js - jQuery plugin
*/
(function($, BHM) {

    $.fn.BHMClient = function( options ) {
        this.settings = $.extend({},{
            templateurl: "",
            helpersurl: "",
            pagesurl: "",
            indexpage: ""
        },options);

        BHM.ch.url = this.settings.helpersurl;
        BHM.cp.url = this.settings.pagesurl;

        var self = this;

        var promise = BHM.cp.fetch();

        $.when(promise).done(function() {

            //first, look for the page
            var page = BHM.cp.find(window.location.pathname,'url');
            //if we can't find the page, check for index
            if (!page) {
                var indexpage = self.settings.indexpage;
                if (typeof(indexpage) == 'string') {
                    //if indexpage is a string, add it to url
                    page = BHM.cp.find(window.location.pathname+self.settings.indexpage,'url');
                    if (!page) return false;
                } else if (indexpage.length > 0) {
                    //if indexpage is an array, loop through each array item
                    for (var i=0; i<indexpage.length; i++) {
                        page = BHM.cp.find(window.location.pathname+indexpage[i],'url');
                        if (typeof(page) == 'object') break;
                    }
                    if (!page) return false
                }
            };

            var pageID = page.get('id');

            BHM.ch.set('page_id',pageID);

            BHM.ch.fetch(function() {
                $.get(self.settings.templateurl,function(data) {
                    $('body').append(data);
                    BHM.ch.render();
                })
            });
        });

        $('body').on('click','.bhm-helper',function() {
            var id = $(this).data('bhm-helper');
            var help = BHM.ch.find(id,'id');
            var islarge = help.get('large')=='1' ? 'modal-lg' : '';
            var modal = $(BHM.tmpl($('#templateBHMModal').html(),{title:help.get('title'),html:help.get('html'),large:islarge}));
            modal.modal().on('hidden.bs.modal',function() {
                modal.remove();
            })
        });

    }


}(jQuery, BHM));
