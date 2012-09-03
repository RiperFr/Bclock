GA :
  track: (page)->
    if _gaq isnt undefined
      _gaq.push(["_trackPageview", "/" +page]);
