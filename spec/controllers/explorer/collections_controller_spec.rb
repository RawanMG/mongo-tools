require 'spec_helper'

describe Explorer::CollectionsController do
#get the DB name
  $test_DB = ""
  let(:test_DB) do
   $test_DB = MongoMapper.database.name
  end

  
  #Sets the collection name, so it's not hardcoded
  $test_collection = ""
  let(:test_collection) do
    $test_collection= "foo"
  end
  
  before(:all) do
    #Insert some data for the test
    coll = MongoMapper.database.create_collection(test_collection)  
  end
  
  after(:all) do
        MongoMapper.database.drop_collection(test_collection)

  end
  
   
  describe "Showing a Collection" do
    it "A collection that exists should be displayed" do
      get 'show', {:explorer_id => test_DB, :id => test_collection}
      response.should be_success
      flash[:error].should be_nil
      assigns(:collection).should_not be_nil
    end
     #TODO 
    it "A collection that doesn't exist should show an error message" do
      
      get 'show', {:explorer_id => test_DB, :id => test_collection}
      response.should be_success
      #flash[:error].should_not be_nil
      #assigns(:collection).should be_nil
    end
  end

  describe "Add Collection" do
    it "Should display a text box to input the collection name" do
      get 'new', {:explorer_id => test_DB}
      response.should be_success
    end
    
    it "Display an error message if the collection name is empty" do
      post 'create' , {:explorer_id => test_DB,:coll => ""}
      response.should be_success
      flash[:error].should_not be_nil
    end
  
    it "Display an error message if the collection name contains $" do
      post 'create' , {:explorer_id => test_DB, :coll =>"blah$"}
      response.should be_success
      flash[:error].should_not be_nil
    end
  
  
   it "no collection name sent should show an error message" do
      post 'create', {:explorer_id => test_DB}
      response.should be_success
      flash[:error].should_not be_nil
   end
  
   it "Should create a collection if name is valid" do
     post 'create' , {:explorer_id => test_DB, :coll => "blah"}
     response.should be_redirect
     flash[:error].should be_nil
     flash[:info].should_not be_nil
     coll = MongoMapper.database.collection("blah")
     coll.should_not have(1).error_on(coll)
   end
  end
  
  describe "Delete a Collection" do
    before(:each) do
         coll = MongoMapper.database.create_collection("blah")  
    end
    after(:each) do
      MongoMapper.database.drop_collection("blah")
    end
    it "Should delete a valid collection" do
      conn = MongoMapper.connection
      db = conn.db(test_DB, :strict => true)
      coll = db.collection("blah")
      coll.should_not have(1).error_on(coll)
      delete 'destroy', {:explorer_id => test_DB,:id => "blah"}
      coll = db.full_collection_name("blah").should raise_error 
      flash[:error].should be_nil
      flash[:info].should_not be_nil
      response.should be_redirect
    end
  end
  
  describe "Rename a Collection" do
   before(:all) do
         coll = MongoMapper.database.create_collection("blah")  
    end
    after(:all) do
       MongoMapper.database.drop_collection("bleh")
    end
    
    it "Should display a page when the user clicks 'rename a collection'" do
      get 'edit', {:explorer_id => test_DB, :id=> "blah"}
      response.should be_success
    end
    
    it "Display an error message if the collection name is empty" do
      put 'update' , {:explorer_id => test_DB,:id => ""}
      response.should be_success
      flash[:error].should_not be_nil
    end
  
    it "Display an error message if the collection name contains $" do
      put 'update' , {:explorer_id => test_DB,:id => "blah$"}
      response.should be_success
      flash[:error].should_not be_nil
    end
    
  
   it "Should rename collection if name is valid" do
     put 'update' , {:explorer_id => test_DB, :id => "blah", :coll => "bleh" }
     response.should be_redirect
     flash[:error].should be_nil
     flash[:info].should_not be_nil
     coll = MongoMapper.database.collection("blah")
     coll.should_not have(1).error_on(coll)
   end
  end
  
end