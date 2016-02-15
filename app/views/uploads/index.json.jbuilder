json.array!(@uploads) do |upload|
  json.extract! upload, :id, :filename, :content
  json.url upload_url(upload, format: :json)
end
