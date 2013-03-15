class ServerStatusObject
  include MongoMapper::Document
<<<<<<< HEAD
  connection(MongoConnections.stats)
  set_database_name Settings.stats.database
=======
  connection(Mongo::Connection.new(Settings.stats.host, Settings.stats.port))
  set_database_name Settings.stats.db
>>>>>>> implemented Rspec tests

  key :host, String
  key :timestamp, Time

  one :op_counters
  one :connections
  one :cursors

  def initialize
<<<<<<< HEAD
    db = MongoMapper.connection[MongoMapper.connection.database_names[0]]
    stats = db.command( { serverStatus: 1 } )
    scrub!(stats)

=======
    MongoMapper.connection ||= Mongo::Connection.new(Settings.mongo.host, Settings.mongo.port)
    db = MongoMapper.connection[MongoMapper.connection.database_names[0]]
    stats = db.command( { serverStatus: 1 } )
    scrub!(stats)
    
>>>>>>> implemented Rspec tests
    self.timestamp = stats["localTime"]
    self.host = stats["host"]
    self.op_counters = stats["opcounters"]
    self.connections = stats["connections"]
    self.cursors = stats["cursors"]

    self.save
  end

<<<<<<< HEAD
  # Exclude some parameters in the returned JSON result
  # see example at bottom of file
  def as_json(options = {})
    options = { 
      :include => {:connections => {:except => [:id]}, 
                   :cursors => {:except => [:id]}, 
                   :op_counters => {:except => [:id]}}, 
      :except => [:id]
    }.update(options)
    super(options)
  end

=======
>>>>>>> implemented Rspec tests
  private
  def scrub!(hash)
    # scrubs the keys of the hash to change offending "." and "$" characters
    q = [hash]
    while (!q.empty?)
      curr = q.pop()
      curr.keys.each do |key|
        # replace key with newkey by adding newkey and deleting old key
        newkey = key
        if key.include? "." or key.include? "$"
          newkey = newkey.gsub(".", ",")
          newkey.gsub!("$", "#")
          curr[newkey] = curr[key]
          curr.delete(key)
        end
        q << curr[newkey] if curr[newkey].is_a?(Hash)
      end
    end
    hash
  end
end

<<<<<<< HEAD


# format:
=======
# format: 
>>>>>>> implemented Rspec tests
# {
#   "host" : "hostname:port",
#   "opcounters" : {
#     "insert" : 4500,
#     "query" : 4832,
#     "update" : 2,
#     "delete" : 58,
#     "getmore" : 0,
#     "command" : 181
#   },
#   "connections" : {
#     "current" : 1,
#     "available" : 203
#   },
#   "cursors" : {
#     "totalOpen" : 0,
#     "clientCursors_size" : 0,
#     "timedOut" : 0
#   },
<<<<<<< HEAD
#   "timestamp" : ISODate("2013-04-01T03:16:43.382Z"),
=======
#   "localTime" : ISODate("2013-04-01T03:16:43.382Z"),
>>>>>>> implemented Rspec tests
# }

