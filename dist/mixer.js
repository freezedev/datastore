(function() {
  define('datastore', ['eventmap', 'mixer'], function(EventMap, mixer) {
    var DataStore, doLowerCase;
    doLowerCase = function(str) {
      return str.replace(/-/g, '').replace(/_/g, '').toLowerCase();
    };
    return DataStore = (function() {
      function DataStore() {}

      DataStore.prototype.contructor = function(content) {
        mixer(DataStore.prototype, new EventMap());
        this.data = {
          collection: {},
          state: {}
        };
        if (content) {
          if (typeof content === 'string') {
            return this.fromString(content);
          } else {
            return this.set(content);
          }
        }
      };

      DataStore.prototype.fromString = function(content) {
        var e;
        try {
          return this.data.collection = JSON.parse(content);
        } catch (_error) {
          e = _error;
          return console.error("Error while parsing content: " + e);
        }
      };

      DataStore.prototype.toString = function() {
        var e;
        try {
          return JSON.stringify(this.data.collection);
        } catch (_error) {
          e = _error;
          return console.error("Error while serializing data: " + e);
        }
      };

      DataStore.prototype.add = function(key, value, state) {
        if (state == null) {
          state = 'rw';
        }
        if (!this.exists(key)) {
          this.trigger('add', key, value);
          this.data.collection[key] = value;
          if (doLowerCase(state) === 'readonly') {
            state = 'ro';
          }
          if (doLowerCase(state) === 'writeonly') {
            state = 'wo';
          }
          return this.data.state[key] = state;
        }
      };

      DataStore.prototype.exists = function(key) {
        this.trigger('exists', key);
        return Object.hasOwnProperty.call(this.data.collection, key);
      };

      DataStore.prototype.has = DataStore.exists;

      DataStore.prototype.remove = function(key) {
        this.trigger('remove', key);
        return delete this.data.collection[key];
      };

      DataStore.prototype.keys = function() {
        return Object.keys(this.data.collection);
      };

      DataStore.prototype.get = function(key) {
        if (data.state[key] !== 'wo') {
          this.trigger('get', key);
          return this.data.collection[key];
        } else {
          return void 0;
        }
      };

      DataStore.prototype.set = function(key, value) {
        var k, v;
        if (value) {
          if (this.exists(key)) {
            if (this.data.state[key] !== 'ro') {
              this.data.collection[key] = value;
              this.trigger('set', key, value);
              this.trigger('change', key, value);
            }
          } else {
            this.add(key, value);
          }
        } else {
          for (k in key) {
            v = key[k];
            this.set.call(this, k, v);
          }
        }
        return null;
      };

      DataStore.prototype.each = function(callback) {
        var key, value, _ref;
        _ref = this.data.collection;
        for (key in _ref) {
          value = _ref[key];
          callback(key, value);
        }
        return null;
      };

      DataStore.prototype.map = function(callback) {
        var key, result, value, _ref;
        result = {};
        _ref = data.collection;
        for (key in _ref) {
          value = _ref[key];
          result[key] = callback(key, value);
        }
        return result;
      };

      DataStore.prototype.filter = function(callback) {
        var key, result, value, _i, _len, _ref;
        result = {};
        _ref = data.collection;
        for (value = _i = 0, _len = _ref.length; _i < _len; value = ++_i) {
          key = _ref[value];
          if (!callback(data.collection[key])) {
            result[key] = data.collection[key];
          }
        }
        return result;
      };

      DataStore.prototype.isEmpty = function() {
        return this.keys().length === 0;
      };

      return DataStore;

    })();
  });

}).call(this);
