module Api
  module V1
    class SessionsController < ApplicationController
      def create
        user = User.find_by(email: session_params[:email])

        if user&.locked?
          render json: { error: "Account locked. Try again later." }, status: :too_many_requests
          return
        end

        if user&.authenticate(session_params[:password])
          user.reset_failed_logins!
          session[:user_id] = user.id
          render json: user_json(user)
        else
          user&.record_failed_login!
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        reset_session
        head :no_content
      end

      private

      def session_params
        params.require(:session).permit(:email, :password)
      end

      def user_json(user)
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      end
    end
  end
end
