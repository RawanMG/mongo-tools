class Explorer::CollectionsController < ExplorerController
  def index
    redirect_to explorer_path(current_database_name)
  end

  def create
    begin
     conn = MongoMapper.connection
     db = conn.db(current_database_name)
     @trimmed = params[:coll].strip
    
     db.create_collection(@trimmed)
     flash[:info] = "The collection was added successfully"

     redirect_to explorer_collection_path(current_database_name, @trimmed )
    
    rescue Exception => ex
     flash[:error] = ex.message
     #render :action => :new
    end
  
  end
 
  def update
    begin
     @trimmed = params[:coll].strip
     current_collection.rename(@trimmed)
     flash[:info] = "The collection was renamed successfully"
     redirect_to explorer_collection_path(current_database_name,  @trimmed )
    rescue Exception => ex
     flash[:error] = ex.message
     redirect_to explorer_collection_path(current_database_name,  @trimmed )
   end
  end
  
  def edit
    begin
      
    rescue Exception => ex
     flash[:error] = ex.message
     render :action => :edit
    end
  end

  def destroy
    begin
     conn = MongoMapper.connection
     db = conn.db(current_database_name)
     db.drop_collection(current_collection_name)
     flash[:info] = "The collection was removed successfully" #is not displayed???
   
    rescue Exception => ex
     flash[:error] = ex.message
    end
    redirect_to explorer_collections_path(current_database_name)
  end

#GET
  def new
    begin
    conn = MongoMapper.connection
     db = conn.db(current_database_name)
     @trimmed = params[:coll].strip
    
     db.create_collection(@trimmed)
     flash[:info] = "The collection was added successfully"

     redirect_to explorer_collection_path(current_database_name, @trimmed )
    rescue Exception => ex
     flash[:error] = ex.message
     render :action => :new
    end
  end

  def show
    begin
      if current_collection.nil?
        raise "Empty Collection"
      end
      
    @opts = {}
    #convert string to bool
    @explain = params[:explain] == "true"

    #parse out params
    @query = params[:query] ? Crack::JSON.parse("{#{params[:query]}}") : {}
    @opts[:fields] = params[:fields] ? Crack::JSON.parse("{#{params[:fields]}}") : {}
    @opts[:skip] = params[:skip].to_i
    @opts[:limit] = params[:limit].to_i
    #default range - should notify user if greater than range.
    @opts[:limit] = 25 unless (1..1000).include?(@opts[:limit])

    sort = params[:sort] ? Crack::JSON.parse("{#{params[:sort]}}") : {}
    sort.each_pair { |k,v| sort[k] = (v.to_i == -1) ? Mongo::DESCENDING : Mongo::ASCENDING }
    @opts[:sort] = sort

    @opts.delete_if { |k,v| v.kind_of?(Hash) && v.empty? }
    @opts[:fields].delete("_id") if @opts[:fields] && @opts[:fields].include?("_id")
    @results = current_collection.find(@query, @opts)
    render layout: !request.xhr?
    
    if not current_collection
      flash[:error] = "That collection doesn't exist"
    end
    @collection = current_collection
 rescue Exception => ex
     flash[:error] = ex.message
     
    end
  end

end
