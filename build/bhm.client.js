/**
*  Bootstrap-Help-Manager v 0.2.1
*  https://github.com/psalmody/Bootstrap-Help-Manager
*/
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
;/**
* begin bhm.vertebrate.js
* Define models & collection for Vertebrate.js
*
*/

var BHM = (function(Vertebrate, $, my) {

    my.helpersurl = '/dev/Bootstrap-Help-Manager/src/bhm.helpers.php';
    my.pagesurl = '/dev/Bootstrap-Help-Manager/src/bhm.pages.php';

    my.helper = Vertebrate.Model.Extend({
        attributes: {
            id: -1,
            field_selecter: '',
            title: '',
            large: false,
            html: ''
        },
        url: my.helpersurl
    })

    my.page = Vertebrate.Model.Extend({
        attributes: {
            "id": -1,
            "url": ''
        },
        url: my.pagesurl
    });

    my.helpers = Vertebrate.Collection.Extend({
        model: my.helper,
        url: my.helpersurl
    });

    my.pages = Vertebrate.Collection.Extend({
        model: my.page,
        url: my.pagesurl
    });


    my.cp = new my.pages();
    my.ch = new my.helpers();

    return my;
}(Vertebrate, jQuery, BHM || {}));
;/* Begin bhm.client.js */
$(function() {

    var templateurl = "/dev/Bootstrap-Help-Manager/templates/bhm.client.html";

    var promise = BHM.cp.fetch();

    $.when(promise).done(function() {
        var page = BHM.cp.find(window.location.pathname,'url');

        if (!page) return false;

        var pageID = page.get('id');

        BHM.ch.set('page_id',pageID);

        BHM.ch.fetch(function() {
            $.get(templateurl,function(data) {
                $('body').append(data);
                BHM.ch.render();
            })
        });
    });

    BHM.ch.render = function() {
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
                    el.closest('.btn-group').append(tmpl($('#templateBHMButtonGroup').html(),{"id":a.id}));
                    if (el.hasClass('btn-block')) {
                        el.removeClass('btn-block');
                    }
                break;
                case 'INPUT':
                    el.wrap(inputgroup);
                    el.closest('.input-group').append(tmpl($('#templateBHMInputGroup').html(),{"id":a.id}));
                break;
                case 'SELECT':
                    el.wrap(inputgroup);
                    el.after(tmpl($('#templateBHMInputGroup').html(),{"id":a.id}));
                break;
                case 'TEXTAREA':
                    if (el.closest('.form-group').find('label').length) {
                        el.closest('.form-group').find('label').append(tmpl($('#templateBHMHelper').html(),{"id":a.id}));
                    } else {
                        el.closest('.form-group').prepend(tmpl($('#templateBHMHelper').html(),{"id":a.id}));
                    }
                break;
                default:
                    el.append(tmpl($('#templateBHMHelper').html(),{"id":a.id}));
            }
        });
    }

    $('body').on('click','.bhm-helper',function() {
        var id = $(this).data('bhm-helper');
        var help = BHM.ch.find(id,'id');
        var islarge = help.get('large')=='1' ? 'modal-lg' : '';
        var modal = $(tmpl($('#templateBHMModal').html(),{title:help.get('title'),html:help.get('html'),large:islarge}));
        modal.modal().on('hidden.bs.modal',function() {
            modal.remove();
        })
    })


})
