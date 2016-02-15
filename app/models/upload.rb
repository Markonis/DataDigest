class Upload
  include Mongoid::Document
  VALID_CONTENT_TYPES = ['application/json']
  
  field :filename, type: String
  field :content, type: String
  field :content_type, type: String
  
  # validates :content_type, inclusion: VALID_CONTENT_TYPES
  validates :filename, presence: true

  after_create :create_entities
  
  def create_entities
    json_data = JSON.parse content
    
    if(json_data.kind_of?(Array))
      json_data.each do |item|
        create_entity(item)
      end
    else
      create_entity(json_data)
    end
  end
  
  def create_entity(data)
    entity = Entity.new
    entity.data = data
    entity.save
  end
end
