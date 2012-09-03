// Generated by CoffeeScript 1.3.3
(function() {
  var DigitalClock, DigitalDate, Lap, LapCollection, Luna, StopWatches, Timer, TimerView, delay, pause, resume, start, stop, timerLapExeption,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  start = function() {
    var clock, date, stopWatch;
    clock = new DigitalClock({
      el: $('#digitalClock'),
      display24h: true,
      displayMilli: false,
      noSeconds: true
    });
    date = new DigitalDate({
      el: $('#digitalDate')
    });
    stopWatch = new StopWatches();
    return Backbone.history.start();
  };

  /* timer = new Timer
  
   stopWatch = new TimerView
     model: timer
     el: $('#stopWatch1')
  
   timer.start()
   ##delay 2000, ->
   ##  timer.pause()
   #  console.debug 'pausing ...'
   ##delay 4000, ->
   ##  timer.resume()
   ##  console.debug 'resuming ...'
   ##delay 6000, ->
   ##  timer.nextLap()
   ##  console.debug 'Lapping ...'
  
   ##delay 7000, ->
   ##  timer.reset()
   ##  console.debug 'Resetting ...'
   ##delay 8000, ->
   ##  timer.stop()
   ##  console.debug 'stopping ...'
   ##  console.debug timer.calculateTime()
  */


  stop = function() {};

  pause = function() {};

  resume = function() {};

  $(document).ready(start);

  delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  StopWatches = (function(_super) {

    __extends(StopWatches, _super);

    function StopWatches() {
      this.addStopWatch = __bind(this.addStopWatch, this);
      return StopWatches.__super__.constructor.apply(this, arguments);
    }

    StopWatches.prototype.routes = {
      "stopWatch/add": "addStopWatch"
    };

    StopWatches.prototype.initialize = function() {
      var _this = this;
      return $('.addStopWatch').bind('click', function() {
        return _this.navigate('stopWatch/add', {
          trigger: true
        });
      });
    };

    StopWatches.prototype.addStopWatch = function() {
      var node, stopWatch;
      node = document.createElement('div');
      $(node).addClass('stopWatch');
      stopWatch = new TimerView({
        el: node
      });
      $('#stopWatchContainer').append(stopWatch.el);
      stopWatch.start();
      return this.navigate('/');
    };

    return StopWatches;

  })(Backbone.Router);

  ({
    GA: {
      track: function(page) {
        if (_gaq !== void 0) {
          return _gaq.push(["_trackPageview", "/" + page]);
        }
      }
    }
  });

  Lap = (function(_super) {

    __extends(Lap, _super);

    function Lap() {
      return Lap.__super__.constructor.apply(this, arguments);
    }

    Lap.prototype.defaults = {
      startTime: null,
      endTime: null,
      name: 'lap'
    };

    Lap.prototype.initialize = function(data, options) {
      if (data && data.startTime === void 0) {
        return this.set('startTime', new Date());
      }
    };

    Lap.prototype.getTime = function() {
      var endTime, startTime;
      startTime = this.get('startTime');
      endTime = this.get('endTime') === null ? new Date() : this.get('endTime');
      return endTime - startTime;
    };

    return Lap;

  })(Backbone.Model);

  LapCollection = (function(_super) {

    __extends(LapCollection, _super);

    function LapCollection() {
      return LapCollection.__super__.constructor.apply(this, arguments);
    }

    LapCollection.prototype.model = Lap;

    return LapCollection;

  })(Backbone.Collection);

  Timer = (function(_super) {

    __extends(Timer, _super);

    function Timer() {
      this.newLapCollection = __bind(this.newLapCollection, this);

      this.onLap = __bind(this.onLap, this);

      this.clearTick = __bind(this.clearTick, this);

      this.tick = __bind(this.tick, this);

      this.reset = __bind(this.reset, this);

      this.resume = __bind(this.resume, this);

      this.pause = __bind(this.pause, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);
      return Timer.__super__.constructor.apply(this, arguments);
    }

    Timer.prototype.defaults = {
      currentTime: 0,
      lap: 0,
      name: 'Timer',
      status: 0,
      laps: null
    };

    Timer.prototype.initialize = function(data, options) {
      if (options && options.interval) {
        this.interval = options.interval;
      } else {
        this.interval = 10;
      }
      return this.newLapCollection();
    };

    Timer.prototype.start = function() {
      var laps, lastLap;
      this.clearTick();
      if (this.get('lap') === 0) {
        this.addLap('start');
      } else {
        laps = this.get('laps');
        lastLap = laps.get(this.get('lap'));
        if (lastLap.get('endTime') !== null) {
          this.reset();
          this.addLap('start');
        }
      }
      this.timer = setInterval(this.tick, this.interval);
      this.isStopped = false;
      return this.tick();
    };

    Timer.prototype.nextLap = function(name) {
      var laps, lastLap;
      laps = this.get('laps');
      lastLap = laps.get(this.get('lap'));
      if (lastLap.get('endTime') === null) {
        this.stopLap();
        return this.addLap();
      }
    };

    Timer.prototype.stop = function() {
      if (this.isStopped !== true) {
        this.stopLap();
      }
      this.clearTick();
      this.updateCurrentTime();
      this.isStopped = true;
      return this.set('status', 0);
    };

    Timer.prototype.pause = function() {
      this.stopLap();
      this.clearTick();
      this.updateCurrentTime();
      return this.set('status', 2);
    };

    Timer.prototype.resume = function() {
      var laps, lastLap;
      laps = this.get('laps');
      lastLap = laps.get(this.get('lap'));
      if (lastLap.get('endTime') !== null) {
        this.addLap('Resume');
        return this.start();
      } else {
        return this.nextLap('Resume');
      }
    };

    Timer.prototype.reset = function() {
      var isStarted;
      isStarted = typeof this.timer !== "number" ? false : true;
      this.clearTick();
      this.set('lap', 0);
      this.newLapCollection();
      this.updateCurrentTime();
      if (isStarted !== false) {
        return this.start();
      }
    };

    Timer.prototype.tick = function() {
      this.updateCurrentTime();
      return this.set('status', 1);
    };

    Timer.prototype.addLap = function(name) {
      var lap, laps;
      if (name == null) {
        name = null;
      }
      laps = this.get('laps');
      if (laps.length !== this.get('lap')) {
        throw new timerLapExeption('The current Lap does not match the number of lap in the timer');
      } else {
        this.set('lap', this.get('lap') + 1);
        lap = new Lap({
          id: this.get('lap'),
          startTime: new Date,
          endTime: null,
          name: name !== null ? name : "Lap " + (this.get('lap'))
        });
        laps.add([lap]);
        return this.set('laps', laps);
      }
    };

    Timer.prototype.stopLap = function(id) {
      var lap, laps;
      if (id == null) {
        id = this.get('lap');
      }
      laps = this.get('laps');
      lap = laps.get(id);
      lap.set('endTime', new Date);
      return this.set('laps', laps);
    };

    Timer.prototype.calculateTime = function() {
      var laps;
      laps = this.get('laps');
      return laps.reduce(function(memo, lap) {
        return memo + lap.getTime();
      }, 0);
    };

    Timer.prototype.updateCurrentTime = function() {
      var time;
      time = this.calculateTime();
      return this.set('currentTime', time);
    };

    Timer.prototype.clearTick = function() {
      if (!(this.timer === void 0 || null)) {
        clearInterval(this.timer);
      }
      return this.timer = null;
    };

    Timer.prototype.onLap = function(eventName, collection, model) {
      this.trigger('laps.all', eventName, collection, model);
      return this.trigger('laps.' + eventName, collection, model);
    };

    Timer.prototype.newLapCollection = function() {
      var laps;
      laps = this.get('laps');
      if (laps !== null) {
        laps.off('all', this.onLap);
      }
      laps = new LapCollection();
      laps.on('all', this.onLap);
      this.set('laps', laps);
      return laps.reset();
    };

    return Timer;

  })(Backbone.Model);

  timerLapExeption = (function() {

    function timerLapExeption(message) {
      this.message = message;
    }

    timerLapExeption.prototype.getMessage = function() {
      return this.message;
    };

    return timerLapExeption;

  })();

  DigitalClock = (function(_super) {

    __extends(DigitalClock, _super);

    function DigitalClock() {
      this.tick = __bind(this.tick, this);

      this.render = __bind(this.render, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);
      return DigitalClock.__super__.constructor.apply(this, arguments);
    }

    DigitalClock.prototype.template = _.template("<div class=\"hours\">00</div>\n<div class=\"dots dotsHour\">:</div>\n<div class=\"minutes\">00</div>\n<div class=\"dots dotsSeconds\">:</div>\n<div class=\"seconds\">00</div>\n<div class=\"milliseconds\">00</div>\n<div class=\"ampm\">am</div>");

    DigitalClock.prototype.className = "digitalClock";

    DigitalClock.prototype.initialize = function(options) {
      this.interval = options.displayMilli ? 10 : 100;
      this.displayMilli = options.displayMilli ? true : false;
      this.display24h = options.display24h ? true : false;
      this.noSeconds = options.noSeconds ? true : false;
      this.$el.addClass(this.className);
      this.render();
      return this.start();
    };

    DigitalClock.prototype.start = function() {
      if (!(this.timer === void 0 || null)) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(this.tick, this.interval);
      return this.tick();
    };

    DigitalClock.prototype.stop = function() {
      if (!(this.timer === void 0 || null)) {
        return clearInterval(this.timer);
      }
    };

    DigitalClock.prototype.render = function() {
      this.$el.html(this.template({}));
      if (this.displayMilli === false) {
        this.$el.addClass('noMilli');
      }
      if (this.display24h === true) {
        this.$el.addClass('display24h');
      }
      if (this.noSeconds === true) {
        this.$el.addClass('noSeconds');
      }
      this.nodes = {
        hours: this.$('.hours'),
        minutes: this.$('.minutes'),
        seconds: this.$('.seconds'),
        milliseconds: this.$('.milliseconds'),
        ampm: this.$('.ampm')
      };
      return this.start();
    };

    DigitalClock.prototype.format = function(number, format) {
      var i, neededZero, result, _i;
      if (format == null) {
        format = 2;
      }
      result = '' + number;
      if (result.length < format) {
        neededZero = format - result.length;
        for (i = _i = 1; 1 <= neededZero ? _i <= neededZero : _i >= neededZero; i = 1 <= neededZero ? ++_i : --_i) {
          result = '0' + result;
        }
        return result;
      } else {
        return result;
      }
    };

    DigitalClock.prototype.tick = function() {
      var date, hours;
      date = new Date();
      if (this.display24h) {
        this.nodes.hours.html(this.format(date.getHours()));
      } else {
        hours = date.getHours();
        this.nodes.hours.html(this.format(hours > 12 ? hours - 12 : hours));
        this.nodes.ampm.html(this.format(hours < 12 ? "am" : "pm"));
      }
      this.nodes.minutes.html(this.format(date.getMinutes()));
      this.nodes.seconds.html(this.format(date.getSeconds()));
      if (this.displayMilli !== false) {
        return this.nodes.milliseconds.html(this.format(date.getMilliseconds(), 3));
      }
    };

    return DigitalClock;

  })(Backbone.View);

  DigitalDate = (function(_super) {

    __extends(DigitalDate, _super);

    function DigitalDate() {
      this.getMoy = __bind(this.getMoy, this);

      this.getDow = __bind(this.getDow, this);

      this.tick = __bind(this.tick, this);

      this.render = __bind(this.render, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);
      return DigitalDate.__super__.constructor.apply(this, arguments);
    }

    DigitalDate.prototype.template = _.template("<div class=\"DayOfWeek\">Monday</div>\n<div class=\"DayOfMonth\">06</div>\n<div class=\"MonthOfYear\">08</div>\n<div class=\"YearOfLife\">2012</div>");

    DigitalDate.prototype.className = "digitalDate";

    DigitalDate.prototype.initialize = function(options) {
      this.interval = options.updateInterval ? options.updateInterval : 1000;
      this.$el.addClass(this.className);
      this.render();
      return this.start();
    };

    DigitalDate.prototype.start = function() {
      if (!(this.timer === void 0 || null)) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(this.tick, this.interval);
      return this.tick();
    };

    DigitalDate.prototype.stop = function() {
      if (!(this.timer === void 0 || null)) {
        return clearInterval(this.timer);
      }
    };

    DigitalDate.prototype.render = function() {
      this.$el.html(this.template({}));
      this.nodes = {
        DayOfWeek: this.$('.DayOfWeek'),
        DayOfMonth: this.$('.DayOfMonth'),
        MonthOfYear: this.$('.MonthOfYear'),
        YearOfLife: this.$('.YearOfLife')
      };
      return this.start();
    };

    DigitalDate.prototype.format = function(number, format) {
      var i, neededZero, result, _i;
      if (format == null) {
        format = 2;
      }
      result = '' + number;
      if (result.length < format) {
        neededZero = format - result.length;
        for (i = _i = 1; 1 <= neededZero ? _i <= neededZero : _i >= neededZero; i = 1 <= neededZero ? ++_i : --_i) {
          result = '0' + result;
        }
        return result;
      } else {
        return result;
      }
    };

    DigitalDate.prototype.tick = function() {
      var date;
      date = new Date();
      this.nodes.DayOfWeek.html(this.getDow(date.getDay()));
      this.nodes.DayOfMonth.html(this.format(date.getDate()));
      this.nodes.MonthOfYear.html(this.getMoy(date.getMonth()));
      return this.nodes.YearOfLife.html(this.format(date.getFullYear(), 4));
    };

    DigitalDate.prototype.locale = 'fr';

    DigitalDate.prototype.getDow = function(dow) {
      if (dow == null) {
        dow = 1;
      }
      if (dow < 0 || dow > 7) {
        dow = 1;
      }
      return this.dow[this.locale][dow];
    };

    DigitalDate.prototype.getMoy = function(moy) {
      if (moy == null) {
        moy = 1;
      }
      if (moy < 0 || moy > 12) {
        moy = 1;
      }
      return this.moy[this.locale][moy];
    };

    DigitalDate.prototype.dow = {
      fr: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    DigitalDate.prototype.moy = {
      fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    return DigitalDate;

  })(Backbone.View);

  Luna = (function(_super) {

    __extends(Luna, _super);

    function Luna() {
      this.tick = __bind(this.tick, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);
      return Luna.__super__.constructor.apply(this, arguments);
    }

    Luna.prototype.template = _.template("<div class=\"DayOfWeek\">Monday</div>\n<div class=\"DayOfMonth\">06</div>\n<div class=\"MonthOfYear\">08</div>\n<div class=\"YearOfLife\">2012</div>");

    Luna.prototype.className = "luna";

    Luna.prototype.initialize = function(options) {
      this.interval = options.updateInterval ? options.updateInterval : 1000;
      this.$el.addClass(this.className);
      this.render();
      return this.start();
    };

    Luna.prototype.start = function() {
      this.timer = setInterval(this.tick, this.interval);
      return this.tick();
    };

    Luna.prototype.stop = function() {};

    Luna.prototype.tick = function() {};

    return Luna;

  })(Backbone.View);

  TimerView = (function(_super) {

    __extends(TimerView, _super);

    function TimerView() {
      this.render = __bind(this.render, this);

      this.remove = __bind(this.remove, this);

      this.stopAndRemove = __bind(this.stopAndRemove, this);

      this.nextLap = __bind(this.nextLap, this);

      this.reset = __bind(this.reset, this);

      this.resume = __bind(this.resume, this);

      this.pause = __bind(this.pause, this);

      this.stop = __bind(this.stop, this);

      this.start = __bind(this.start, this);

      this.update = __bind(this.update, this);

      this.updateLaps = __bind(this.updateLaps, this);
      return TimerView.__super__.constructor.apply(this, arguments);
    }

    TimerView.prototype.template = _.template("<div class=\"numbers\">\n  <div class=\"hours\">00</div>\n  <div class=\"dots\">:</div>\n  <div class=\"minutes\">00</div>\n  <div class=\"dots\">:</div>\n  <div class=\"seconds\">00</div>\n  <div class=\"dot\">.</div>\n  <div class=\"dixiemes\">0</div>\n</div>\n<div class=\"actions\">\n  <button class=\"tb iconPlay start\">Start</button>\n  <button class=\"tb iconStop stop\">Stop</button>\n  <button class=\"tb iconPause pause\">Pause</button>\n  <button class=\"tb iconResume resume\">Resume</button>\n  <button class=\"tb iconReset reset\">Reset</button>\n  <button class=\"tb iconNext nextLap\">New Lap</button>\n  <button class=\"tb iconRemove remove\">Remove</button>\n</div>\n<ul class=\"laps\"></ul>");

    TimerView.prototype.lapTemplate = _.template("<li>{{name}} : {{startTime}} - {{endTime}}</li>");

    TimerView.prototype.events = {
      "click .start": "start",
      "click .stop": "stop",
      "click .pause": "pause",
      "click .resume": "resume",
      "click .reset": "reset",
      "click .nextLap": "nextLap",
      "click .remove": "stopAndRemove"
    };

    TimerView.prototype.className = 'timer';

    TimerView.prototype.initialize = function(options) {
      if (options) {
        if (options.ubdateInterval !== void 0) {
          this.updateInterval = options.ubdateInterval;
        }
      }
      this.model = options && options.model === void 0 ? new Timer() : options.model;
      this.$el.addClass(this.className);
      this.render();
      this.model.on('change', _.throttle(this.update, 100));
      return this.model.on('laps.all', this.updateLaps);
    };

    TimerView.prototype.updateLaps = function() {
      var laps, ul,
        _this = this;
      laps = this.model.get('laps');
      ul = this.$('ul.laps');
      ul.html('');
      return laps.each(function(item) {
        return ul.html("" + (ul.html()) + (_this.lapTemplate(item.toJSON())));
      });
    };

    TimerView.prototype.format = function(number, format) {
      var i, neededZero, result, _i;
      if (format == null) {
        format = 2;
      }
      result = '' + number;
      if (result.length < format) {
        neededZero = format - result.length;
        for (i = _i = 1; 1 <= neededZero ? _i <= neededZero : _i >= neededZero; i = 1 <= neededZero ? ++_i : --_i) {
          result = '0' + result;
        }
        return result;
      } else {
        return result;
      }
    };

    TimerView.prototype.update = function() {
      var dixiemes, hours, minutes, secondes, time;
      time = this.model.get('currentTime');
      dixiemes = time / 1;
      secondes = time / 1000;
      minutes = secondes / 60;
      hours = minutes / 60;
      dixiemes = dixiemes - (Math.floor(secondes) * 1000);
      secondes = secondes - (Math.floor(minutes) * 60);
      minutes = minutes - (Math.floor(hours) * 60);
      this.nodes.hours.html(this.format(Math.floor(hours)));
      this.nodes.minutes.html(this.format(Math.floor(minutes)));
      this.nodes.secondes.html(this.format(Math.floor(secondes)));
      return this.nodes.dixiemes.html(this.format(Math.floor(dixiemes), 3));
    };

    TimerView.prototype.start = function() {
      return this.model.start();
    };

    TimerView.prototype.stop = function() {
      return this.model.stop();
    };

    TimerView.prototype.pause = function() {
      return this.model.pause();
    };

    TimerView.prototype.resume = function() {
      return this.model.resume();
    };

    TimerView.prototype.reset = function() {
      return this.model.reset();
    };

    TimerView.prototype.nextLap = function() {
      return this.model.nextLap();
    };

    TimerView.prototype.stopAndRemove = function() {
      this.stop();
      return this.remove();
    };

    TimerView.prototype.remove = function() {
      this.model.stop();
      return Backbone.View.prototype.remove.apply(this, arguments);
    };

    TimerView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.nodes = {
        hours: this.$('.hours'),
        minutes: this.$('.minutes'),
        secondes: this.$('.seconds'),
        dixiemes: this.$('.dixiemes')
      };
      this.update();
      return this;
    };

    return TimerView;

  })(Backbone.View);

}).call(this);
