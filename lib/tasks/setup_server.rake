require 'yaml'

# Load the statistics YAML file
<<<<<<< HEAD
config_path = File.expand_path("config/application.yml", Rails.root)
begin
  CONFIG = YAML.load_file(config_path)
	CONFIG = CONFIG[Rails.env]["stats"]
rescue Errno::ENOENT
  raise "Make sure the settings file #{config_path} exists."
end

=======
CONFIG = YAML.load_file("#{Rails.root}/config/stats.yml")[Rails.env]
>>>>>>> implemented Rspec tests

namespace :setup do
	# set up the path and logpath
	directory CONFIG["path"]
	directory CONFIG["logpath"]

	desc "set up mongodb server on this computer for monitoring data"
	task :server do
		puts "setting up the secondary stats server"
<<<<<<< HEAD
		sh "mongod --dbpath #{CONFIG['path']} --port #{CONFIG['port']}\
		 --fork --logpath #{CONFIG['logpath']}"
=======
		sh "mongod --dbpath #{CONFIG['path']} --port #{CONFIG['stats_port']} --fork --logpath #{CONFIG['logpath']}"
>>>>>>> implemented Rspec tests
	end
end
