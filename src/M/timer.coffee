class Timer extends Backbone.Model
  defaults:
    currentTime:0
    lap:0
    name:'Timer'
    status:0 ##0 = stop; 1=running, 2= paused;
    laps:null

  initialize: (data,options)->
    if options && options.interval then @interval = options.interval else @interval = 10
    @newLapCollection()
  start: =>
    @clearTick()
    if @get('lap') is 0
      @addLap 'start'
    else
      laps = @get('laps')
      lastLap = laps.get @get('lap')
      if lastLap.get('endTime') isnt null
        @reset()
        @addLap 'start'
    @timer = setInterval @tick, @interval
    @isStopped = false
    @tick()
  nextLap: (name)->
    laps = @get('laps')
    lastLap = laps.get @get('lap')
    if lastLap.get('endTime') is null
      @stopLap()
      @addLap()
  stop: =>
    @stopLap() unless @isStopped is true
    @clearTick()
    @updateCurrentTime()
    @isStopped = true
    @set 'status',0
  pause: =>
    @stopLap()
    @clearTick()
    @updateCurrentTime()
    @set 'status',2
  resume: =>
    laps = @get('laps')
    lastLap = laps.get @get('lap')
    if lastLap.get('endTime') isnt null
      @addLap('Resume')
      @start()
    else
      @nextLap('Resume')
  reset: =>
    #console.debug @timer
    isStarted = if typeof @timer isnt "number" then false else true
    #console.debug isStarted
    @clearTick()
    @set 'lap',0
    @newLapCollection()
    @updateCurrentTime()
    @start() unless isStarted is false
  tick: =>
    @updateCurrentTime()
    @set 'status',1
  addLap: (name = null)->
    laps = @get('laps')
    if laps.length isnt @get('lap')
      #console.dir @
      throw new timerLapExeption('The current Lap does not match the number of lap in the timer')
    else
      @set 'lap', @get('lap')+1
      lap = new Lap
                  id:@get('lap')
                  startTime:new Date,
                  endTime:null,
                  name: if name isnt null then name else "Lap #{@get('lap')}"
      laps.add [lap]
      @set 'laps',laps
      ##@trigger 'lap.new',@get('lap'),@
      ##@trigger 'lap.start',lap,@
  stopLap : (id = @get('lap'))->
    laps = @get('laps')
    lap = laps.get id
    lap.set 'endTime' ,new Date
    @set 'laps',laps
    ##@trigger 'lap.end', lap

  calculateTime: ->
    laps = @get('laps')
    laps.reduce (memo,lap)->
      memo+lap.getTime()
    ,0
  updateCurrentTime: ->
    time = @calculateTime()
    @set 'currentTime',time
  clearTick: =>
    clearInterval(@timer) unless @timer is undefined or null
    @timer = null ;

  onLap:(eventName,collection,model)=>
    #console.dir arguments
    @trigger 'laps.all',eventName,collection,model
    @trigger 'laps.'+eventName,collection,model

  newLapCollection: =>
    laps = @get('laps')
    if laps isnt null
      laps.off 'all',@onLap
    laps = new LapCollection()
    laps.on('all',@onLap)
    @set 'laps',laps
    laps.reset()



class timerLapExeption
  constructor: (message)->
    @message = message
  getMessage: ->
    return @message