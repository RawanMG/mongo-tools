class Explorer::ImportsController < ExplorerController
 


  def create
         
    begin
     
     coll = current_collection
     fileobj = params[:file]
     content= fileobj.read
     lines = content.split("\n")
     
      lines.each {|line|
        if(!line.empty?)
            json = JSON.parse(line)
            if json.has_key?('_id')
                json["_id"] = BSON::ObjectId(json["_id"])
            end
            coll.insert(json)
        end
          }
 

      
     flash[:info] = "Imported collections successfully"
     
     redirect_to explorer_collection_path(current_database_name, current_collection_name)
    
    rescue Exception => ex
     flash[:error] = ex.message
     redirect_to explorer_collection_path(current_database_name, current_collection_name)
    end
 end
end

