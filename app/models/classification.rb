class Classification
  include Mongoid::Document
  field :description, type: String
  field :threshold, type: Integer, default: 80
  field :limit, type: Integer, default: 0
  field :result_groups, type: Array, default: []
 
  before_save :classify_all
   
  def classify_all
    entities = self.limit.zero? ? 
      Entity.where(group: nil) : Entity.where(group: nil).limit(self.limit) 

    self.result_groups = entities.map { |entity|
      classify_one(entity)
    }.uniq.map{|group| group.to_hash}
  end

  def classify_one (entity)
    best_group = find_best_group(entity) || Group.new
    add_to_group(best_group, entity)
    best_group
  end

  def find_best_group(entity)
    strategy = choose_strategy
    best = Group.all
      .map {|g| [g, strategy.calculate_similarity(entity, g)]}
      .reject {|item| item[1] < threshold}
      .sort {|a, b| a[1] <=> b[1]}.last
    best ? best[0] : nil
  end
  
  def add_to_group(group, entity)
    group.entities << entity
    group.save
    entity.group = group
    entity.save
  end
  
  def choose_strategy
    ClassificationStrategy::Strict.new
  end
end
