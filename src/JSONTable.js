/**
* JSONTable plugin - takes jsondata or url and converts to bootstrap table
*/
(function ($) {

    $.fn.JSONTable = function (options) {
        var settings = $.extend({}, {
            url: false,
            data: false,
            method: 'GET',
            tableClasses: 'table-condensed table-striped',
            responsive: false,
            dataType: 'JSON',
            appendTo: false,
            noWraps: [],
            success: false,
            nodata: false,
            columns: [],
            options: {},
            template: false,
            ajaxstatus: false,
            templateParams: {}
        }, options)

        if (!settings.url && !settings.data) {
            console.log('url or data must be specified for JSONTable plugin.');
            return;
        }

        var table, thead, tbody, div;

        var self = this;

        if (settings.data) {
            formatData(settings.data, 'local, no ajax', false);
        } else {
            $.ajax({
                method: settings.method,
                url: settings.url,
                data: settings.options,
                dataType: settings.dataType
            }).done(function ( data, status, xhr ) {
                formatData( data, status, xhr );
            }).fail(function ( xhr, status, error) {
                if (typeof(settings.fail) == 'function') {
                    settings.fail(xhr, status, error);
                }
            });
        }

        function formatData( data, status, xhr ) {
            if (data.length < 1) {
                if (typeof (settings.nodata) == 'function') {
                    settings.nodata(table, status, xhr);
                }
                return self;
            }

            if (self.prop('tagName') != 'TABLE') {
                div = self;
                div.empty();
                table = $('<table class="table ' + settings.tableClasses + '"><thead></thead><tbody></tbody></table>');
                div.append(table);
                if (settings.responsive) {
                    div.addClass('table-responsive');
                }
                table.hide();
            } else {
                table = self;
                div = self.closest('div');
                if (settings.tableClasses) {
                    table.addClass(settings.tableClasses);
                }
                if (settings.responsive) {
                    div.addClass('table-responsive');
                }
            }

            if (table.find('thead').length > 0) {
                thead = table.find('thead');
            } else {
                thead = $('<thead></thead>');
                table.append(thead);
            }

            if (table.find('tbody').length > 0) {
                tbody = table.find('tbody');
                tbody.empty();
            } else {
                tbody = $('<tbody></tbody>');
                table.append(tbody);
            }


            if (thead.find('tr').length < 1) {
                var tr = $('<tr></tr>');
                thead.append(tr);
                if (settings.columns.length > 0) {
                    $.each(settings.columns, function (i) {
                        var th = $('<th></th>');
                        tr.append(th);
                        th.html(settings.columns[i]);
                    })
                } else {
                    $.each(data[0], function (k, v) {
                        var th = $('<th></th>');
                        tr.append(th);
                        th.html(k);
                    });
                }
            }
            $(data).each(function () {
                if (settings.template) {
                    tbody.append(BHM.tmpl(settings.template.html(),$.extend(this,settings.templateParams)));
                    return;
                }
                var tr = $('<tr></tr>');
                tbody.append(tr);
                $.each(this, function (k, v) {
                    var td = $('<td></td>');
                    if (settings.noWraps.indexOf(k) >= 0 || settings.noWraps.indexOf('allrows') >= 0) {
                        td.addClass('noWrap');
                    }
                    tr.append(td);
                    td.html(v);
                })
            });

            table.show();
            if (typeof (settings.success) == 'function') {
                settings.success(table, status, xhr );
            }
            return self;
        }

    }

}(jQuery));
