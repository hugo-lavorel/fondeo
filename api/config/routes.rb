Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "signup", to: "registrations#create"
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      get "me", to: "current_user#show"

      resource :account, only: [ :update, :destroy ] do
        patch :password, on: :collection, action: :update_password
      end
      post "transcriptions", to: "transcriptions#create"
      resource :company, only: [ :show, :create, :update ]
      resources :projects do
        resources :expenses, only: [ :index, :create, :update, :destroy ]
        resources :process_items, only: [ :index, :create, :update, :destroy ]
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
