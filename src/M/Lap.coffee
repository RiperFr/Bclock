class Lap extends Backbone.Model
  defaults:
    startTime:null,
    endTime:null,
    name: 'lap'

  initialize: (data,options)->
    if data and data.startTime is undefined
      @set 'startTime', new Date()
  getTime: ->
    startTime = @get('startTime')
    endTime = if @get('endTime') is null then new Date() else @get('endTime')
    endTime-startTime

