define 'datastore', ['eventmap', 'mixer'], (EventMap, mixer) ->

  doLowerCase = (str) -> str.replace(/-/g, '').replace(/_/g, '').toLowerCase()

  class DataStore
  
    contructor: (content) ->
      mixer DataStore::, new EventMap()
      
      @data =
        collection: {}
        state: {}
        
      if content
        if typeof content is 'string'
          @fromString content
        else
          @set content
      
  
    fromString: (content) ->
      try
        @data.collection = JSON.parse content
      catch e
        console.error "Error while parsing content: #{e}"
    toString: ->
      try
        JSON.stringify @data.collection
      catch e
        console.error "Error while serializing data: #{e}"
  
    add: (key, value, state = 'rw') ->
      unless @exists key
        @trigger 'add', key, value
        @data.collection[key] = value
  
        state = 'ro' if doLowerCase(state) is 'readonly'
        state = 'wo' if doLowerCase(state) is 'writeonly'
  
        @data.state[key] = state
    exists: (key) ->
      @trigger 'exists', key
      Object.hasOwnProperty.call @data.collection, key
    has: @exists
    remove: (key) ->
      @trigger 'remove', key
      delete @data.collection[key]
    keys: -> Object.keys @data.collection
    get: (key) ->
      if data.state[key] isnt 'wo'
        @trigger 'get', key
        @data.collection[key]
      else
        undefined
    set: (key, value) ->
      if value
        if @exists key
          if @data.state[key] isnt 'ro'
            @data.collection[key] = value
            @trigger 'set', key, value
        else
          @add key, value
      else
        @set.call(@, k, v) for k, v of key
  
      null
    each: (callback) ->
      callback key, value for key, value of @data.collection
  
      null
    map: (callback) ->
      result = {}
      result[key] = callback key, value for key, value of data.collection
  
      result
    filter: (callback) ->
      result = {}
      for key, value in data.collection
        result[key] = data.collection[key] unless callback data.collection[key]
  
      result
    isEmpty: -> @keys().length is 0