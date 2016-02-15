class Presentation
  include Mongoid::Document
  field :type, type: String, default: "series"
  field :name, type: String
  field :data, type: Array, default: []
  field :fetch_config, type: Hash, default: {}
  field :display_config, type: Hash, default: {}
  field :group_info, type: Hash, default: {}
  
  before_save :fetch_data, :fill_group_info
  
  def fill_group_info
    group = Group.find fetch_config[:group_id]
    self.group_info = group.to_hash
  end
  
  def fetch_data
    strategy = choose_strategy
    self.data = strategy.fetch(fetch_config)
  end
  
  def choose_strategy
    FetchStrategy::Base.new 
  end
end
