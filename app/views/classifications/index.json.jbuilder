json.array!(@classifications) do |classification|
  json.extract! classification, :id, :threshold, :limit
  json.url classification_url(classification, format: :json)
end
