class Luna extends Backbone.View
  template: _.template """
                  <div class="DayOfWeek">Monday</div>
                  <div class="DayOfMonth">06</div>
                  <div class="MonthOfYear">08</div>
                  <div class="YearOfLife">2012</div>
                """
  className: "luna"
  initialize: (options)->
    @interval = if options.updateInterval then options.updateInterval else 1000 ##*60*60
    @$el.addClass(@className)
    @render()
    @start()

  start: =>
    #clearInterval(@timer) unless @timer is undefined or @timer is null
    @timer = setInterval(@tick, @interval)
    @tick()
  stop: =>
    #clearInterval(@timer) unless @timer is undefined or @timer is null

  tick: =>
    #test