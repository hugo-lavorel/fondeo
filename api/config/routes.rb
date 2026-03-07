Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post "signup", to: "registrations#create"
      post "login", to: "sessions#create"
      delete "logout", to: "sessions#destroy"
      get "me", to: "current_user#show"

      resource :company, only: [ :show, :create, :update ]
      resources :projects
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
