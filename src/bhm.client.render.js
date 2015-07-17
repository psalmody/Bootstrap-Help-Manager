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
