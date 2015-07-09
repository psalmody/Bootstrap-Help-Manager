/**
*
* Define models & collection for Vertebrate.js
*
*/

var BHM = {};

BHM.helpersurl = '/dev/Bootstrap-Help-Manager/bhm.helpers.php';
BHM.pagesurl = '/dev/Bootstrap-Help-Manager/bhm.pages.php';

BHM.helper = Vertebrate.Model.Extend({
    attributes: {
        id: -1,
        field_selecter: '',
        title: '',
        large: false,
        html: ''
    },
    url: BHM.helpersurl
})

BHM.page = Vertebrate.Model.Extend({
    attributes: {
        "id": -1,
        "url": ''
    },
    url: BHM.pagesurl
});

BHM.helpers = Vertebrate.Collection.Extend({
    model: BHM.helper,
    url: BHM.helpersurl
});

BHM.pages = Vertebrate.Collection.Extend({
    model: BHM.page,
    url: BHM.pagesurl
});


BHM.collPages = new BHM.pages();
BHM.collHelps = new BHM.helpers();
