do (root = @, name = 'DataStore') ->
  root.udefine.globals[name.toLowerCase()] = root[name]

  root.udefine.inject[name.toLowerCase()] = {name, root}