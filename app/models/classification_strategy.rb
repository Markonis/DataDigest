module ClassificationStrategy
  class Base
    def calculate_similarity(entity, group)
      raise "Subclass responsability"
    end
  end
  
  class Strict < Base
    def calculate_similarity(entity, group)
      if group.empty?
        100
      else
        group_number_of_attributes = group.number_of_attributes
        entity_number_of_attributes = entity.number_of_attributes
        
        max_number_of_attributes = [
          entity_number_of_attributes,
          group_number_of_attributes].max
  
        part = 100 / max_number_of_attributes
        
        entity.data.keys.select{
          |a| group.include_data_attribute? a
        }.size * part
      end
    end
  end
end