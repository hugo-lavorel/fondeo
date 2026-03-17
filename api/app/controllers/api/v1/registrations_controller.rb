module Api
  module V1
    class RegistrationsController < ApplicationController
      def create
        unless valid_invite_token?
          render json: { error: "Token d'invitation invalide" }, status: :forbidden
          return
        end

        user = User.new(registration_params)

        if user.save
          session[:user_id] = user.id
          render json: user_json(user), status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def valid_invite_token?
        expected = Rails.application.credentials.signup_token
        received = params[:invite_token].to_s
        expected.present? && ActiveSupport::SecurityUtils.secure_compare(expected, received)
      end

      def registration_params
        params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
      end
    end
  end
end
