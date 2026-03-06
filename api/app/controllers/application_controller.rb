class ApplicationController < ActionController::API
  include ActionController::Cookies

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def require_authentication
    render json: { error: "Unauthorized" }, status: :unauthorized unless current_user
  end
end
