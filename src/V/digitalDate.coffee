class DigitalDate extends Backbone.View
  template: _.template """
                <div class="DayOfWeek">Monday</div>
                <div class="DayOfMonth">06</div>
                <div class="MonthOfYear">08</div>
                <div class="YearOfLife">2012</div>
              """
  className: "digitalDate"
  initialize: (options)->
    @interval = if options.updateInterval then options.updateInterval else 1000
    @$el.addClass(@className)
    @render()
    @start()

  start: =>
    clearInterval(@timer) unless @timer is undefined or null
    @timer = setInterval(@tick, @interval)
    @tick()
  stop: =>
    clearInterval(@timer) unless @timer is undefined or null

  render: =>
    @$el.html @template({})
    @nodes =
      DayOfWeek: @$('.DayOfWeek')
      DayOfMonth: @$('.DayOfMonth')
      MonthOfYear: @$('.MonthOfYear')
      YearOfLife: @$('.YearOfLife')
    @start()
  format: (number,format = 2)->
    result = ''+number
    if result.length <format
      neededZero = format-result.length
      for i in [1..neededZero]
        result = '0'+result
      result
    else
      result
  tick: =>
    date = new Date()
    @nodes.DayOfWeek.html @getDow date.getDay()
    @nodes.DayOfMonth.html @format date.getDate()
    @nodes.MonthOfYear.html @getMoy date.getMonth()
    @nodes.YearOfLife.html @format date.getFullYear(),4

  locale : 'fr'
  getDow :(dow =1)=>
    if dow <0 or dow >  7 then dow = 1
    @dow[@locale][dow]

  getMoy: (moy=1)=>
    if moy <0 or moy >  12 then moy = 1
    @moy[@locale][moy]
  dow:
    fr : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
    en : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  moy:
    fr : ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre']
    en : ['January','February','March','April','May','June','July','August','September','October','November','December']