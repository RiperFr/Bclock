start= ->
  #console.debug 'start'
  clock = new DigitalClock
    el : $('#digitalClock')
    display24h : true
    displayMilli:false
    noSeconds : true

  date = new DigitalDate
    el: $('#digitalDate')

  stopWatch = new StopWatches()


  Backbone.history.start();


 ### timer = new Timer

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
###





stop= ->
  #GA.track 'stop'
  #console.debug 'stop'

pause= ->
  #GA.track 'stop'
  #console.debug "pause"

resume= ->
  #GA.track 'resume'
  #console.debug "resume"

$(document).ready(start)


## TOOLS
delay = (ms, func) -> setTimeout func, ms