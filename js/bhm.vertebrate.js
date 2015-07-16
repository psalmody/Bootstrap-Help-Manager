/**
*
* Define models & collection for Vertebrate.js
*
*/

var BHM = (function(Vertebrate, $, my) {

    my.helpersurl = '/dev/Bootstrap-Help-Manager/bhm.helpers.php';
    my.pagesurl = '/dev/Bootstrap-Help-Manager/bhm.pages.php';

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
