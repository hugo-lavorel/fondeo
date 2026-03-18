module Api
  module V1
    class AccountsController < ApplicationController
      before_action :require_authentication
      before_action :verify_current_password

      def update
        if current_user.update(profile_params)
          render json: user_json(current_user)
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update_password
        if current_user.update(password_params)
          render json: user_json(current_user)
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        current_user.company&.destroy
        current_user.destroy
        reset_session
        head :no_content
      end

      private

      def verify_current_password
        return if current_user.authenticate(params.dig(:account, :current_password).to_s)

        render json: { error: "Mot de passe actuel incorrect" }, status: :forbidden
      end

      def profile_params
        params.require(:account).permit(:first_name, :last_name, :email)
      end

      def password_params
        params.require(:account).permit(:password, :password_confirmation)
      end
    end
  end
end
