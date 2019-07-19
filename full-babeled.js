"use strict";

(async function () {
  var sleep = function sleep(ms) {
    return new Promise(function (res) {
      return setTimeout(res, ms);
    });
  };

  console.log('build template');

  var dates = function () {
    var d72 = {
      year: 2019,
      month: 7,
      day: 2
    };
    var d7 = {
      year: 2019,
      month: 7,
      day: 1
    };
    return ['07', '7', 'february', 'feb', 'February', 'Feb', 'FEBRUARY', 'FEB'].reduce(function (p, m) {
      return [].concat(p, ['-', '/', ' ', ',', ', '].reduce(function (pp, d) {
        return [].concat(pp, [{
          s: "2019" + d + m + d + "02",
          ...d72
        }, {
          s: "2019" + d + m + d + "2",
          ...d72
        }, {
          s: "2019" + d + m,
          ...d7
        }, {
          s: "2019" + d + m,
          ...d7
        }, {
          s: "02" + d + m + d + "2019",
          ...d72
        }, {
          s: "2" + d + m + d + "2019",
          ...d72
        }]);
      }, []));
    }, []);
  }();

  var timePrefixes = [' ', 'T', 'T '];
  var times = [{
    s: '01:02:03',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 0
  }, {
    s: '01:02:03.456',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 456
  }, {
    s: '01:02:03.056',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 56
  }, {
    s: '01:02:03.006',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 6
  }, {
    s: '1:2:3',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 0
  }, {
    s: '1:2:3.456',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 456
  }, {
    s: '1:2:3.56',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 56
  }, {
    s: '1:2:3.6',
    hour: 1,
    minute: 2,
    second: 3,
    ms: 6
  }].reduce(function (p, c) {
    return [].concat(p, [{ ...c
    }, { ...c,
      s: c.s + "Z"
    }, { ...c,
      s: c.s + "GMT"
    }, { ...c,
      s: c.s + "Z GMT"
    }]);
  }, []);
  console.log('build list');
  var consoleText = document.getElementById('console');
  var listMaxLength = dates.length * timePrefixes.length * times.length;
  var list = [];
  var index = 0,
      add = {};

  for (var _iterator = dates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var d = _ref;

    for (var _i3 = 0, _timePrefixes = timePrefixes; _i3 < _timePrefixes.length; _i3++) {
      var tp = _timePrefixes[_i3];

      for (var _iterator2 = times, _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i4 >= _iterator2.length) break;
          _ref2 = _iterator2[_i4++];
        } else {
          _i4 = _iterator2.next();
          if (_i4.done) break;
          _ref2 = _i4.value;
        }

        var t = _ref2;
        index++;
        add = { ...d,
          ...t,
          s: "" + d.s + tp + t.s
        };
        list = [].concat(list, [add]);
        consoleText.innerText = "building... " + index / listMaxLength * 100 + " %";
        await sleep(1);
      }
    }
  }

  console.log({
    list: list
  });
  console.log('analyze list');
  index = 0;
  var result = {
    invalid: [],
    ok: [],
    ng: []
  };

  for (var _i2 = 0, _list = list; _i2 < _list.length; _i2++) {
    var l = _list[_i2];
    index++;
    var s = l.s,
        year = l.year,
        month = l.month,
        day = l.day,
        hour = l.hour,
        minute = l.minute,
        second = l.second,
        ms = l.ms;

    var _d = new Date(s);

    var ex = {
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second,
      ms: ms
    };
    var res = {
      year: _d.getFullYear(),
      month: _d.getMonth() + 1,
      day: _d.getDate(),
      hour: _d.getHours(),
      minute: _d.getMinutes(),
      second: _d.getSeconds(),
      ms: _d.getMilliseconds()
    };
    var json = {
      ex: JSON.stringify(ex),
      res: JSON.stringify(res)
    };
    var domOK = "<table>\n            <thead><tr><th>" + s + "</th></tr></thead>\n            <tbody></tbody>\n        </table>";
    var dom = "<table>\n            <thead><tr><th>" + s + "</th></tr></thead>\n            <tbody>\n                <tr><th>ANSWER</th><th>" + json.res + "</th></tr>\n                <tr><th>EXPECT</th><th>" + json.ex + "</th></tr>\n            </tbody>\n        </table>";

    if (_d.toString() === "Invalid Date") {
      result.invalid = [].concat(result.invalid, [s]);
      document.getElementById('id').innerHTML += dom;
    } else {
      if (json.ex === json.res) {
        result.ok = [].concat(result.ok, [s]);
        document.getElementById('ok').innerHTML += domOK;
      } else {
        result.ng = [].concat(result.ng, [s]);
        document.getElementById('ng').innerHTML += dom;
      }
    }

    consoleText.innerText = "analyzing... " + index / listMaxLength * 100 + " %";
    await sleep(1);
  }

  console.log(result);
  consoleText.innerText = "OK: " + result.ok.length + ", invalid: " + result.invalid.length + ", NG: " + result.ng.length;
})();
