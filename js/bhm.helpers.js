$(function() {

    var templateurl = "/dev/Bootstrap-Help-Manager/templates/bhm.helpers.html";

    var promise = BHM.collPages.fetch();

    $.when(promise).done(function() {
        var page = BHM.collPages.find(window.location.pathname,'url');

        if (!page) return false;

        var pageID = page[0].get('id');

        BHM.collHelps.set('page_id',pageID);

        BHM.collHelps.fetch(function() {
            $.get(templateurl,function(data) {
                $('body').append(data);
                BHM.collHelps.render();
            })
        });
    });

    BHM.collHelps.render = function() {
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
                        //el.closest('.btn-group').addClass('btn-group-justified');
                        //el.closest('.btn-group').find('button').wrap(btngroup);
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
        var help = BHM.collHelps.find(id,'id');
        help = help[0];
        var islarge = help.get('large')=='1' ? 'modal-lg' : '';
        var modal = $(tmpl($('#templateBHMModal').html(),{title:help.get('title'),html:help.get('html'),large:islarge}));
        modal.modal().on('hidden.bs.modal',function() {
            modal.remove();
        })
    })


})
