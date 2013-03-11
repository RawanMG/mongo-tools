require 'spec_helper'

describe Explorer::CollectionsController do
#get the DB name
  $test_DB = ""
  let (test_DB) do
   $test_DB = MongoMapper.database.name
  end


  describe "Showing a Collection" do
    it "A collection that exists should be displayed" do
      get 'show', {:explorer_id => test_DB, :collection_id => test_collection}
      response.should be_success
      flash[:error].should be_nil
      assigns(:collection).should_not be_nil
    end
    
    it "A collection that doesn't exist should show an error message" do
      get 'show', {:explorer_id => test_DB, :collection_id => test_collection}
      response.should be_success
      flash[:error].should_not be_nil
      assigns(:collection).should be_nil
    end
  end

  describe "Add Collection"
    it "Should display a text box to input the collection name"
      get 'new', {:explorer_id => test_DB}
      response.should be_success
   end
    
    it "Display an error message if the collection name is empty"
      post 'create' , {:explorer_id => test_DB,:coll => ""}
      response.should be_success
      flash[:error].should_not be_nil
    end
  
    it "Display an error message if the collection name contains $"
      post 'create' , {:explorer_id => test_DB, :coll =>"blah$"}
      response.should be_success
      flash[:error].should_not be_nil
     end
  
   it "Display an error message if the collection name begins with 'system.'"
     post 'create' , {:explorer_id => test_DB, :coll =>"system.blah"}
     response.should be_success
     flash[:error].should_not be_nil
   end
  
   it "Display an error message if the collection name begins or ends with '.'"
     post 'create' , {:explorer_id => test_DB, :coll =>"blah."}
     response.should be_success
     flash[:error].should_not be_nil
   end
  
   it "no collection name sent should show an error message" do
      post 'create', {:explorer_id => test_DB}
      response.should be_success
      flash[:error].should_not be_nil
   end
  
   it "Should create a collection if name is valid"
     post 'create' , {:explorer_id => test_DB, :coll => "blah"}
     response.should be_redirect
     flash[:error].should be_nill
     flash[:info].should_not be_nil
     coll = MongoMapper.database.collection(test_collection)
     coll.should_not be_nil
   end
  end
  
  describe "Delete a Collection" do
    it "Should delete a valid collection"
      MongoMapper.database.create_collection("blah")
      coll = MongoMapper.database.collection("blah")
      coll.should_not be_nil
      delete 'destroy', {:explorer_id => test_DB, :collection_id => "blah"}
      coll = MongoMapper.database.collection("blah")
      flash[:error].should be_nil
      flash[:info].should_not be_nil
      coll.should be_nil
      response.should be_redirect
    end
  end
  
end