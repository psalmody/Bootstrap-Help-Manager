if (typeof($) == 'undefined') {
    console.log('Vertebrate.js requires jQuery 1.11+');
}

/**
*

In progress:
* add delete functions

*
*/
(function() {

    Vertebrate = {
        settings: {},
        get: function(setting) {
            return (typeof(setting)) == 'undefined' ?
                this.settings :
                this.settings[setting];
        },
        set: function(setting, value) {
            return this.settings[setting] = value;
        },
        shared: {
            fn: function() {
                this.attributes = {};
                this.changedattrs = [];
                this.set = function(attr, value) {
                    this.attributes[attr] = value;
                    this.changedattrs.push(attr);
                    $('body').trigger('vertebrate.changeattr', [this, this.attributes, this.changedattrs]);
                    return true;
                };
                this.get = function(attr) {
                    if (typeof(attr) == 'undefined') return this.attributes;
                    return this.attributes[attr];
                };
                this.has = function(attr) {
                    return (typeof(this.attributes[attr]) == 'undefined') ? false : true;
                };
                this.hasChanged = function(attr) {
                    var attr = typeof(attr) == 'undefined' ? false : attr;
                    if (!attr) {
                        return this.changedattrs.length > 0 ? true : false;
                    }
                    return this.changedattrs.indexOf(attr) >= 0 ? true : false;
                };
            }
        }
    };

    Vertebrate.Model = function(options) {
        var self = this;
        Vertebrate.shared.fn.call(this);
        var options = typeof(options) == 'undefined' ? false : options;
        if (options) {
            $.each(options,function(k,v){
                if (typeof(v) == 'object') {
                    self[k] = $.extend(self[k],v);
                } else {
                    self[k] = v;
                }
            })
        }
        this.save = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'POST',
                data: { data: JSON.stringify(this.get()) },
                success: function(data, status, xhr) {
                    self.changedattrs = [];
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        this.fetch = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'GET',
                data: this.get(),
                success: function(data, status, xhr) {
                    self.changedattrs = [];
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        this.delete = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'DELETE',
                data: JSON.stringify(this.get()),
                success: function(data, status, xhr) {
                    $('body').trigger('vertebrate.deleted', [self, self.attributes, data, status, xhr]);
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
    };

    Vertebrate.Model.prototype = Object.create(Vertebrate.shared.fn);
    Vertebrate.Model.prototype.constructor = Vertebrate.Model;

    Vertebrate.Model.Extend = function(options) {
        var model = function(opts) {
            Vertebrate.Model.call(this, options);
            var self = this;
            var opts = typeof(opts) == 'undefined' ? false : opts;
            if (opts) {
                $.each(opts,function(k,v){
                    if (typeof(v) == 'object') {
                        $.extend(self[k],v);
                    } else {
                        self[k] = v;
                    }
                })
            }
            return this;
        }
        model.prototype = Object.create(Vertebrate.Model.prototype);
        model.prototype.constructor = model;
        return model;
    };

    Vertebrate.Collection = function(options) {
        Vertebrate.shared.fn.call(this, options);
        this.model = false;
        this.models = [];
        this.added = [];
        this.removed = [];
        var self = this;
        $.each(options,function(k,v){
            if (typeof(v) == 'object') {
                $.extend(self[k],v);
            } else {
                self[k] = v;
            }
        })
        this.save = function(callback) {
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'POST',
                data: {
                    "data": JSON.stringify([this.get(), this.models])
                },
                success: function(data, status, xhr) {
                    self.removed = [];
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        this.fetch = function(callback) {
            if (!self.model) {
                console.log('No model defined. Models must be defined before fetch call.');
                return false;
            }
            var promise = $.ajax({
                url: typeof(this.url) == 'undefined' ? Vertebrate.get('url') : this.url,
                method: 'GET',
                dataType: 'JSON',
                data: this.get(),
                success: function(data, status, xhr) {
                    self.models = [];
                    $.each(data, function(i) {
                        self.models.push(new self.model({
                            attributes: data[i]
                        }));
                    });
                    self.removed = [];
                    if (typeof(callback) == 'function') callback.call(self,data, status, xhr);
                }
            });
            return promise;
        };
        this.find = function(term, attr) {
            var attr = (typeof(attr) == 'undefined') ? false : attr;
            var term = (attr) ? term.toString() : Number(term);
            var found = false;
            if (attr) {
                var founds = [];
                $.each(self.models, function(k, v) {
                    if (v.attributes[attr] == term) {
                        found = true;
                        founds.push(this);
                    }
                });
                if (!found) return false;
                return founds;
            } else {
                return self.models[term];
            }
        };
        this.add = function(model) {
            self.models.push(model);
            self.added.push(model);
        };
        this.remove = function(model) {
            var newmodels = self.models.filter(function(m) {
                return m != model;
            });
            self.models = newmodels;
            self.removed.push(model);
            $('body').trigger('vertebrate.removed', [self, self.removed, self.models]);
            return true;
        };
        this.max = function(attr) {
            var greatest = 0;
            $.each(self.models,function(k,v) {
                if (Number(v.attributes[attr]) > greatest) {
                    greatest = v.attributes[attr];
                }
            });
            return greatest;
        };
    };

    Vertebrate.Collection.prototype = Object.create(Vertebrate.shared.fn);
    Vertebrate.Collection.prototype.constructor = Vertebrate.Collection;

    Vertebrate.Collection.Extend = function(options) {
        function collection(opts) {
            Vertebrate.Collection.call(this, options);
            var self = this;
            $.each(options,function(k,v){
                if (typeof(v) == 'object') {
                    $.extend(self[k],v);
                } else {
                    self[k] = v;
                }
            })
        }
        collection.prototype = Object.create(Vertebrate.Collection.prototype);
        collection.prototype.constructor = collection;
        return collection;
    };

})();
