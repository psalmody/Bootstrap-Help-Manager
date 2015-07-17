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
