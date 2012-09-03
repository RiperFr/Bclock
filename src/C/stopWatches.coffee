class StopWatches extends Backbone.Router
  routes:{
    "stopWatch/add"  : "addStopWatch"
  }

  initialize:->
    $('.addStopWatch').bind 'click', =>
      @navigate 'stopWatch/add',
        trigger : true

  addStopWatch: =>
    node = document.createElement('div')
    $(node).addClass('stopWatch')
    stopWatch = new TimerView
      el: node
    $('#stopWatchContainer').append(stopWatch.el)
    stopWatch.start()
    @navigate('/')