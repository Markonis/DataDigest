module FetchStrategy
  class Base
    def query(config)
      Entity.where(group_id: config[:group_id])
    end
    def fetch(config)
      query(config).to_a.map{|entity| entity.data}
    end
  end
end