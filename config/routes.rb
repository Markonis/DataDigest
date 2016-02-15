Rails.application.routes.draw do
  resources :groups
  resources :presentations
  resources :classifications
  resources :uploads
  root 'pages#index'
  
  resources :entities
end
