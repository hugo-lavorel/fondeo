module Api
  module V1
    class CurrentUserController < ApplicationController
      before_action :require_authentication

      def show
        render json: {
          id: current_user.id,
          email: current_user.email,
          first_name: current_user.first_name,
          last_name: current_user.last_name
        }
      end
    end
  end
end
