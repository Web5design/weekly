/*!
 * weekly - jQuery Weekly Calendar Plugin
 * v0.0.16
 * https://github.com/jgallen23/weekly
 * copyright Greg Allen 2013
 * MIT License
*/
/**
 * Date helpers
 */

(function(w){
  var oldRef = w.dateUtils;

  var dateUtils = {
    noConflict: function() {
      w.dateUtils = oldRef;
      return dateUtils;
    },
    getFirstDayOfWeek: function(date, offset) {
      offset = offset || 0;
      var first = date.getDate() - date.getDay();
      var newDate = new Date(date.getTime());
      newDate.setDate(first + (offset * 7));
      return newDate;
    },
    getLastDayOfWeek: function(date, weekOffset) {
      weekOffset = weekOffset || 0;
      var first = date.getDate() - date.getDay();
      var newDate = new Date(date.getTime());
      newDate.setDate(first + 6 + (weekOffset * 7));
      return newDate;
    },
    getdateUtils: function(date, weekOffset) {
      var daysInWeek = 7;

      var days = [];
      var sunday = this.getFirstDayOfWeek(date, weekOffset);

      for (var i = 0, c = daysInWeek; i < c; i++) {
        var d = new Date(sunday.getTime());
        d.setDate(d.getDate() - d.getDay() + i);
        days.push(d);
      }
      return days;
    },
    getTimes: function(startTime, endTime) {
      var end = endTime + 12;

      var times = [];
      for (var i = startTime; i <= end; i++) {
        var hour = (i > 12) ? i - 12 : i;
        var timeString = hour+':00 ';

        timeString += (i > 11) ? 'PM' : 'AM';

        times.push(timeString);
      }

      return times;
    },
    getWeekSpan: function(date, offset) {
      var first = this.getFirstDayOfWeek(date, offset);
      var last = this.getLastDayOfWeek(date, offset);

      var span = TimeFormat('%M %d', first) + ' - ';
      if (first.getMonth() == last.getMonth()) {
        span += TimeFormat('%d', last);
      } else {
        span += TimeFormat('%M %d', last);
      }
      return span;
    }
  };

  w.dateUtils = dateUtils;
})(window);
/**
 * Simple date and time formatter based on php's date() syntax.
 */

(function(w) {
  var oldRef = w.TimeFormat;

  var months = 'January|February|March|April|May|June|July|August|September|October|November|December'.split('|');
  var days = 'Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday'.split('|');

  var TimeFormat = function(format, time) {
    if(!time instanceof Date) return;
    // Implements PHP's date format syntax.
    return format.replace(/%d|%D|%j|%l|%S|%w|%F|%m|%M|%n|%Y|%y|%a|%A|%g|%G|%h|%H|%i|%s|%u|%e/g, function(match) {
      switch(match) {
        case '%d':
          return ("0" + time.getDate()).substr(-2,2);
        case '%D':
          return days[time.getDay()].substr(0,3);
        case '%j':
          return time.getDate();
        case '%l':
          return days[time.getDay()];
        case '%S':
          if(time.getDate() === 1) {
            return 'st';
          } else if(time.getDate() === 2) {
            return 'nd';
          } else if(time.getDate() === 3) {
            return 'rd';
          } else {
            return 'th';
          }
          break;
        case '%w':
          return time.getDay();
        case '%F':
          return months[time.getMonth()];
        case '%m':
          return ("0" + time.getMonth()).substr(-2,2);
        case '%M':
          return months[time.getMonth()].substr(0,3);
        case '%n':
          return time.getMonth();
        case '%Y':
          return time.getFullYear();
        case '%y':
          return time.getFullYear().toString().substr(-2,2);
        case '%a':
          return time.getHours() > 11 ? 'pm' : 'am';
        case '%A':
          return time.getHours() > 11 ? 'PM' : 'AM';
        case '%g':
          return time.getHours() > 12 ? time.getHours() -12 : time.getHours();
        case '%G':
        return time.getHours();
        case '%h':
          return ("0" + (time.getHours() > 12 ? time.getHours() -12 : time.getHours())).substr(-2,2);
        case '%H':
          return ("0" + time.getHours()).substr(-2,2);
        case '%i':
          return ("0" + time.getMinutes()).substr(-2,2);
        case '%s':
          return ("0" + time.getSeconds()).substr(-2,2);
        case '%u':
          return time.getMilliseconds();
        case '%e':
          return time.getTimezoneOffset();
      }
    });
  };

  TimeFormat.noConflict = function() {
    w.TimeFormat = oldRef;
    return TimeFormat;
  };

  w.TimeFormat = TimeFormat;

})(window);
(function($) {

  $.declare('weekly', {
    defaults: {
      startTime: 8,
      endTime: 6,
      weekOffset: 0,
      currentDate: new Date(),
      autoRender: true,
      fitText: true,
      fitTextMin: 12,
      fitTextMax: 15,
      template: '<div class="weekly-time-navigation">  <% if (showPreviousWeekButton) { %>  <button class="weekly-previous-week weekly-change-week-button" data-action="prevWeek">&laquo; <span class="week"></span></button>  <% } %>  <button class="weekly-next-week weekly-change-week-button" data-action="nextWeek"><span class="week"></span> &raquo;</button>  <button class="weekly-jump-today weekly-change-today-button" data-action="jumpToday">Today</button>  <div class="weekly-header"></div></div><div class="weekly-days"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">    <%= timef(\'%D %m/%d\', date) %>  </div><% } %></div><div class="weekly-times"><% for (var i = 0; i < times.length; i++) { var time = times[i]; %>  <div class="weekly-time" data-time="<%= time %>"><%= time %></div><% } %></div><div class="weekly-grid"><% for (var i = 0; i < dates.length; i++) { var date = dates[i]; %>  <div class="weekly-day" style="width:<%= 100/dates.length %>%" data-date="<%= timef(\'%Y-%n-%j\', date) %>">    <% for (var ii = 0; ii < times.length; ii++) { var time = times[ii]; %>      <div class="weekly-time" data-time="<%= time %>">&nbsp;</div>    <% } %>  </div><% } %></div>',
      readOnly: false,
      enableResize: true,
      enableDelete: true,
      autoSplit: false,
      allowPreviousWeeks: true
    },

    events: {
      'click .weekly-event': 'eventClicked'
    },

    init: function() {
      this.events = [];

      if (this.readOnly) {
        this.enableResize = false;
        this.enableDelete = false;
      }

      if (this.autoRender) {
        this.update();
      }
    },

    update: function() {
      var data = {
        timef: TimeFormat,
        getWeekSpan: dateUtils.getWeekSpan,
        currentDate: this.currentDate,
        dates: dateUtils.getdateUtils(this.currentDate, this.weekOffset),
        times: dateUtils.getTimes(this.startTime, this.endTime),
        showPreviousWeekButton: (this.allowPreviousWeeks || (this.weekOffset !== 0))
      };
      this.render(data);

      for(var i = 0, c = this.events.length; i < c; i++) {
        this.renderEvent(this.events[i]);
      }

      this.timeDifference = (this.endTime + 13) - this.startTime;

      if(!this.readOnly) {
        this.registerClickToCreate();
        this.registerModifyEvent();
      }

      this.highlightToday();

      if(!this.weekOffset) {
        this.el.find(".weekly-change-today-button").css('display', 'none');
      } else {
        this.el.find(".weekly-change-today-button").css('display', 'block');
      }

      this.el.find('.weekly-time-navigation .weekly-previous-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset - 1));
      this.el.find('.weekly-time-navigation .weekly-next-week .week').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset + 1));

      this.el.find('.weekly-time-navigation .weekly-header').html(dateUtils.getWeekSpan(this.currentDate, this.weekOffset));

      if (this.fitText) {
        this.el.find(".weekly-days .weekly-day, .weekly-times .weekly-time").fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }
      this.emit('weekChange', { dates: data.dates, times: data.times });
    },

    highlightToday: function() {
      var today = new Date();

      this.el.find('[data-date="' + TimeFormat('%Y-%n-%j', today) + '"]').addClass('weekly-today');
    },

    registerClickToCreate: function() {
      this.mouseDown = false;
      this.pendingEvent = null;
      this.pendingEventStart = null;

      var gridDays = this.el.find('.weekly-grid .weekly-day');

      // Make sure anything previously bound is bound no more.
      gridDays.unbind('mousedown mousemove mouseup mouseout click');

      gridDays.on('mousedown', this.proxy(function(event){
        if(event.which !== 1 || $(event.target).is('.weekly-dragger')) return;
        this.mouseDown = true;

        if(this.pendingEvent) {
          this.pendingEvent.remove();
          this.pendingEvent = null;
        }
      }));

      gridDays.on('mouseup', this.proxy(function(){
        this.mouseDown = false;

        if(this.pendingEvent) {
          var eventData = this.pendingEvent.data();

          var parsedDate = eventData.date.split('-');

          this.addEvent({
            start: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.starttime),
            end: new Date(parsedDate[0], parsedDate[1], parsedDate[2], eventData.endtime)
          });

          this.pendingEvent.remove();
          this.pendingEvent = null;
          this.pendingEventStart = null;
        }
      }));

      gridDays.on('mousemove', this.proxy(function(event){
        if(this.mouseDown) {
          this.createEvent(event);
        }
      }));

      gridDays.on('click', this.proxy(function(event){
        if($(event.target).is('.weekly-time,.weekly-day')) {
          this.createEvent(event);
          gridDays.trigger('mouseup');
        }
      }));

      gridDays.on('mouseleave', this.proxy(function(event){
        if(this.mouseDown) {
          gridDays.trigger('mouseup');
        }
      }));
    },

    registerModifyEvent: function() {
      this.mouseModifyDown = false;

      var eventDraggers = this.el.find('.weekly-grid');

      this.currentDragger = null;

      // Make sure anything previously bound is bound no more.
      eventDraggers.find('.weekly-dragger').unbind('mousedown mousemove mouseup mouseout click');

      eventDraggers.on('mousedown', '.weekly-dragger', this.proxy(function(event){
        if(event.which !== 1) return;
        this.mouseModifyDown = true;

        this.currentDragger = $(event.target);

        this.eventOffset = 0;
      }));

      eventDraggers.on('mouseup', '.weekly-day', this.proxy(function(){
        this.mouseModifyDown = false;

        this.currentDragger = null;
      }));

      eventDraggers.on('mousemove', '.weekly-day', this.proxy(function(event){
        if(this.mouseModifyDown) {
          this.modifyEvent(event);
        }
      }));

      eventDraggers.on('mouseleave', this.proxy(function(event){
        if(this.mouseModifyDown) {
          this.currentDragger.trigger('mouseup');
        }
      }));
    },

    createEvent: function(event) {
      var target = $(event.currentTarget);
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);

      var tempStart = Math.floor(mouseOffsetTop / hourHeight) * hourHeight;
      var tempEnd = Math.ceil(mouseOffsetTop / hourHeight) * hourHeight;

      if(this.pendingEventStart === null) {
        this.pendingEventStart = tempStart;
      }

      if(this.pendingEventEnd === null || tempEnd > this.pendingEventStart) {
        this.pendingEventEnd = tempEnd;
      }

      if(!this.pendingEvent) {
        target.append('<div class="weekly-event-pending"></div>');
        this.pendingEvent = target.find('.weekly-event-pending');
        this.pendingEvent.data('date', target.data('date'));
      }

      this.pendingEvent.css({
        top: this.pendingEventStart,
        bottom: dayHeight - this.pendingEventEnd
      });

      this.pendingEvent.data('starttime', ((this.pendingEventStart / hourHeight) || 0) + this.startTime);
      this.pendingEvent.data('endtime', ((this.pendingEventEnd / hourHeight) || 1) + this.startTime);
    },

    modifyEvent: function(event) {
      var target = this.currentDragger.parents('.weekly-event');
      var targetOffset = target.parent().offset();
      var mouseOffsetTop = event.pageY - targetOffset.top;
      var dayHeight = $(event.currentTarget).height();
      var hourHeight = Math.round(dayHeight / this.timeDifference);

      var tempEnd = Math.ceil(mouseOffsetTop / hourHeight) * hourHeight;

      if(tempEnd < (targetOffset.top + dayHeight)) {
        target.css({
          bottom: dayHeight - tempEnd
        });
      }

      var duration = target.outerHeight() / hourHeight;
      var end = new Date(target.data('start'));
      end.setHours(end.getHours() + duration);
      target.data('end', end);

      this.events[target.data('_index')].end = end;

      this.el.trigger('modifyEvent', this.events[target.data('_index')]);
    },

    nextWeek: function() {
      this.changeDate(1);
    },

    prevWeek: function() {
      this.changeDate(-1);
    },

    jumpToday: function() {
      this.changeDate(0);
    },

    changeDate: function(offsetWeek) {
      if(!offsetWeek) {
        this.weekOffset = 0;
      } else {
        this.weekOffset += offsetWeek;
      }

      this.update();
    },

    renderEvent: function(event) {
      var startDate = event.start.getFullYear() + "-" + event.start.getMonth() + "-" + event.start.getDate();
      var startTime = event.start.toTimeString().slice(0,5);
      var endDate = event.end.getFullYear() + "-" + event.end.getMonth() + "-" + event.end.getDate();
      var endTime = event.end.toTimeString().slice(0,5);

      var topOffset = 100 - this.getTimeOffsetPercent(startTime);
      var bottomOffset = this.getTimeOffsetPercent(endTime);

      var eventTemplate = $('<div class="weekly-event"></div>');

      eventTemplate.data(event);

      eventTemplate.css({
        top: topOffset + '%',
        bottom: bottomOffset + '%'
      }).append([
        '<button data-action="removeEvent" class="weekly-delete">×</button>',
        '<div class="weekly-event-time">' + TimeFormat('%g:%i', event.start) + ' - ' + TimeFormat('%g:%i%a', event.end) + '</div>',
        '<div class="weekly-event-title">' + event.title + '</div>',
        '<div class="weekly-event-desc">' + event.description + '</div>',
        '<div class="weekly-dragger"></div>'
      ].join(''));

      if (!this.enableResize) {
        eventTemplate.find('.weekly-dragger').remove();
      }

      if (!this.enableDelete) {
        eventTemplate.find('.weekly-delete').remove();
      }

      if (event.type) {
        eventTemplate.addClass('weekly-event-'+event.type.replace(/ /g, '-'));
      }

      var selectedDay = this.el.find('.weekly-grid .weekly-day[data-date="' + startDate + '"]');

      selectedDay.append(eventTemplate);

      if (this.fitText) {
        selectedDay.find(".weekly-event-title").fitText(1, {
          'minFontSize': this.fitTextMin,
          'maxFontSize': this.fitTextMax
        });
      }
    },

    toFraction: function(time) {
      if(time.toString().indexOf(':') === -1) {
        return time;
      }

      var parts = time.toString().split(':');

      return parseFloat(parts[0] + '.' + 100/(60/parts[1]));
    },

    getTimeOffsetPercent: function(time) {
      time = this.toFraction(time) - this.startTime;

      var diff = this.timeDifference - time;

      if(diff < 0) {
        diff = time - this.timeDifference;
      }

      var percent = (diff / this.timeDifference) * 100;

      return percent;
    },

    splitEvent: function(event) {
      var diff = event.end.getTime() - event.start.getTime();
      var hour = 60 * 60 * 1000;
      var count = Math.ceil(diff / hour); //divide by 1 hour
      var startTime = event.start.getTime();
      var events = [];
      for (var i = 0; i < count; i++) {
        var newEvent = $.extend({}, event); //clone event
        newEvent.start = new Date(startTime + (hour * i));
        newEvent.end = new Date(startTime + (hour * (i+1)));
        events.push(newEvent);
      }
      return events;
    },

    addEvent: function(event) {
      if(event instanceof Array) {
        for(var i = 0, c = event.length; i < c; i++) {
          this.addEvent(event[i]);
        }
        return;
      }

      if (this.autoSplit) {
        event = this.splitEvent(event);
      } else {
        event = [event];
      }

      for (var x = 0, y = event.length; x < y; x++) {
        var e = event[x];

        e = $.extend({
          title: '',
          description: '',
          start: null,
          end: null
        }, e);

        e._index = this.events.length;

        this.renderEvent(e);
        this.events.push(e);
      }

      var eventData = (this.autoSplit) ? event : event[0];
      this.emit('addEvent', [eventData]);
    },

    removeEvent: function(e) {
      var el = $(e.target).parents('.weekly-event');
      var event = el.data();

      this.events.splice(event._index, 1);
      el.remove();

      this.el.trigger('removeEvent', event);

      return false;
    },

    clearEvents: function() {
      this.el.find('.weekly-event').remove();

      this.events = [];

      this.el.trigger('clearEvents');
    },

    eventClicked: function(e) {
      var el = $(e.currentTarget);
      var event = el.data();
      this.emit('eventClick', [event, el]);
    }

  });

})(jQuery);
