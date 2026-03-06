module Api
  module V1
    class RegistrationsController < ApplicationController
      def create
        user = User.new(registration_params)

        if user.save
          session[:user_id] = user.id
          render json: user_json(user), status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def registration_params
        params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
      end
    end
  end
end
