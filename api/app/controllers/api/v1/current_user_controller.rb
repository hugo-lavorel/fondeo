module Api
  module V1
    class CurrentUserController < ApplicationController
      before_action :require_authentication

      def show
        render json: user_json(current_user)
      end
    end
  end
end
