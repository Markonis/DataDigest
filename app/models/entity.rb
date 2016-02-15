class Entity
  include Mongoid::Document
  field :data, type: Hash, default: {}
  
  belongs_to :group
  
  def data_attributes
    data.keys
  end
  
  def has_data_attribute?(attribute)
    data ? data.has_key?(attribute) : false
  end
  
  def number_of_attributes
    data ? data.size : 0
  end
end