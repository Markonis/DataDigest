class Group
  include Mongoid::Document
  field :name, type: String
  field :description, type: String, default: ""
  
  has_many :entities
  
  before_save :create_name
  
  def create_name
    self.name = new_group_name unless self.name
  end
  
  def new_group_name
    "Group #{Date.today}"
  end
  
  def size
    entities.size
  end
  
  def data_attributes
    entities.map{|entity| entity.data_attributes}.flatten.uniq
  end
  
  def number_of_attributes
    entities.map{|e| e.number_of_attributes}.max || 0
  end
  
  def include_data_attribute?(a)
    data_attributes.include? a
  end
  
  def empty?
    entities.empty?
  end
  
  def to_hash
    {
      name: self.name,
      description: self.description,
      data_attributes: self.data_attributes,
      size: self.size
    }
  end
end
