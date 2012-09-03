class TimerView extends Backbone.View
  template: _.template """
    <div class="numbers">
      <div class="hours">00</div>
      <div class="dots">:</div>
      <div class="minutes">00</div>
      <div class="dots">:</div>
      <div class="seconds">00</div>
      <div class="dot">.</div>
      <div class="dixiemes">0</div>
    </div>
    <div class="actions">
      <button class="tb iconPlay start">Start</button>
      <button class="tb iconStop stop">Stop</button>
      <button class="tb iconPause pause">Pause</button>
      <button class="tb iconResume resume">Resume</button>
      <button class="tb iconReset reset">Reset</button>
      <button class="tb iconNext nextLap">New Lap</button>
      <button class="tb iconRemove remove">Remove</button>
    </div>
    <ul class="laps"></ul>
               """
  lapTemplate : _.template """
  <li>{{name}} : {{startTime}} - {{endTime}}</li>
  """
  events:
    "click .start" : "start"
    "click .stop" : "stop"
    "click .pause" : "pause"
    "click .resume" : "resume"
    "click .reset" : "reset"
    "click .nextLap" : "nextLap"
    "click .remove" : "stopAndRemove"

  className:'timer'

  initialize:(options)->
    if options then  @updateInterval = options.ubdateInterval unless options.ubdateInterval is undefined
    @model = if options and options.model is undefined then new Timer() else options.model
    @$el.addClass @className
    @render()
    @model.on 'change',_.throttle(@update,100)
    @model.on 'laps.all',@updateLaps

  updateLaps: =>
    laps = @model.get 'laps'
    ul = @.$('ul.laps')
    ul.html ''
    laps.each (item)=>
      ul.html "#{ul.html()}#{@lapTemplate(item.toJSON())}"

  format: (number,format = 2)->
    result = ''+number
    if result.length <format
      neededZero = format-result.length
      for i in [1..neededZero]
        result = '0'+result
      result
    else
      result

  update:=>
    time = @model.get('currentTime');
    dixiemes = time/1
    secondes  = time/1000
    minutes = secondes/60
    hours = minutes/60

    dixiemes = dixiemes-(Math.floor(secondes)*1000)
    secondes = secondes-(Math.floor(minutes)*60)
    minutes = minutes-(Math.floor(hours)*60)

    @nodes.hours.html(@format Math.floor(hours));
    @nodes.minutes.html(@format Math.floor(minutes));
    @nodes.secondes.html(@format Math.floor(secondes));
    @nodes.dixiemes.html(@format Math.floor(dixiemes),3);

  start: =>
    @model.start()
  stop: =>
    @model.stop()
  pause: =>
    @model.pause()
  resume:=>
    @model.resume()
  reset:=>
    @model.reset()
  nextLap:=>
    @model.nextLap()
  stopAndRemove:=>
    @stop()
    @remove()

  remove:=>
    @model.stop()
    Backbone.View.prototype.remove.apply @,arguments

  render:=>
    @.$el.html @template(@model.toJSON())
    @nodes =
      hours : @.$('.hours')
      minutes : @.$('.minutes')
      secondes : @.$('.seconds')
      dixiemes : @.$('.dixiemes')
    @update()
    @