class Explorer::ImportsController < ExplorerController
 


  def create
    begin

     
     coll = current_collection
     filepath = params[:file].read
      
      flash[:info] = "got file name" + filepath
      #alert "@filepath"
     
    # redirect_to explorer_collections_path(current_database_name, current_collection_name)
    
    rescue Exception => ex
      print "Error during processing: #{$!}"
     print "Backtrace:\n\t#{ex.backtrace.join("\n\t")}"
     flash[:error] = ex.message
     #render :action => :new
    end
  
  end
end

