/**
*  Bootstrap-Help-Manager v 0.4.0
*  https://github.com/psalmody/Bootstrap-Help-Manager
*/
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
            html: ''
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
/*
* bhm.client.render.js - render function for client side
*/
var BHM = (function(Vertebrate, $, my) {
    my.ch = BHM.ch || {};
    my.ch.render = function() {
        var coll = this;
        $.each(coll.models,function() {
            var a = this.get();
            var el = $(a.field_selecter);
            var tag = el.prop('tagName');
            var inputgroup = $('<div></div>',{"class":"input-group"});
            switch(tag) {
                case 'BUTTON':
                    var btngroup = $('<div></div>',{"class":"btn-group"});
                    el.wrap(btngroup);
                    el.closest('.btn-group').append(BHM.tmpl($('#templateBHMButtonGroup').html(),{"id":a.id}));
                    if (el.hasClass('btn-block')) {
                        el.removeClass('btn-block');
                    }
                break;
                case 'INPUT':
                    el.wrap(inputgroup);
                    el.closest('.input-group').append(BHM.tmpl($('#templateBHMInputGroup').html(),{"id":a.id}));
                break;
                case 'SELECT':
                    el.wrap(inputgroup);
                    el.after(BHM.tmpl($('#templateBHMInputGroup').html(),{"id":a.id}));
                break;
                case 'TEXTAREA':
                    if (el.closest('.form-group').find('label').length) {
                        el.closest('.form-group').find('label').append(BHM.tmpl($('#templateBHMHelper').html(),{"id":a.id}));
                    } else {
                        el.closest('.form-group').prepend(BHM.tmpl($('#templateBHMHelper').html(),{"id":a.id}));
                    }
                break;
                default:
                    el.append(BHM.tmpl($('#templateBHMHelper').html(),{"id":a.id}));
            }
        });
    }

    return my;
}(Vertebrate, jQuery, BHM || {}));
;
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
