json.array!(@presentations) do |presentation|
  json.extract! presentation, :id, :type, :data, :fetch_strategy, :display_strategy
  json.url presentation_url(presentation, format: :json)
end
