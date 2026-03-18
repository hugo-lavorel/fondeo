require "test_helper"

class Api::V1::AccountsControllerTest < ActionDispatch::IntegrationTest
  VALID_PASSWORD = "ValidPass123"

  setup do
    @user = users(:alice)
    sign_in(@user)
  end

  # PATCH /api/v1/account

  test "update profile with valid params and correct password" do
    patch "/api/v1/account", params: {
      account: {
        first_name: "Alicia",
        last_name: "Jones",
        email: "alicia@example.com",
        current_password: VALID_PASSWORD
      }
    }, as: :json

    assert_response :ok
    json = response.parsed_body
    assert_equal "Alicia", json["first_name"]
    assert_equal "alicia@example.com", json["email"]
  end

  test "update profile fails with wrong current_password" do
    patch "/api/v1/account", params: {
      account: {
        first_name: "Alicia",
        last_name: "Jones",
        email: "alicia@example.com",
        current_password: "wrongpassword"
      }
    }, as: :json

    assert_response :forbidden
  end

  test "update profile fails with invalid email" do
    patch "/api/v1/account", params: {
      account: {
        first_name: "Alice",
        last_name: "Smith",
        email: "not-an-email",
        current_password: VALID_PASSWORD
      }
    }, as: :json

    assert_response :unprocessable_entity
  end

  test "update profile requires authentication" do
    delete "/api/v1/logout", as: :json

    patch "/api/v1/account", params: {
      account: {
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@example.com",
        current_password: VALID_PASSWORD
      }
    }, as: :json

    assert_response :unauthorized
  end

  # PATCH /api/v1/account/password

  test "update password with valid params" do
    patch "/api/v1/account/password", params: {
      account: {
        current_password: VALID_PASSWORD,
        password: "NewValidPass456",
        password_confirmation: "NewValidPass456"
      }
    }, as: :json

    assert_response :ok
    assert @user.reload.authenticate("NewValidPass456")
  end

  test "update password fails with wrong current_password" do
    patch "/api/v1/account/password", params: {
      account: {
        current_password: "wrongpassword",
        password: "NewValidPass456",
        password_confirmation: "NewValidPass456"
      }
    }, as: :json

    assert_response :forbidden
  end

  test "update password fails if too short" do
    patch "/api/v1/account/password", params: {
      account: {
        current_password: VALID_PASSWORD,
        password: "Short1A",
        password_confirmation: "Short1A"
      }
    }, as: :json

    assert_response :unprocessable_entity
  end

  test "update password fails if missing complexity" do
    patch "/api/v1/account/password", params: {
      account: {
        current_password: VALID_PASSWORD,
        password: "alllowercasepass",
        password_confirmation: "alllowercasepass"
      }
    }, as: :json

    assert_response :unprocessable_entity
  end

  test "update password fails if confirmation does not match" do
    patch "/api/v1/account/password", params: {
      account: {
        current_password: VALID_PASSWORD,
        password: "NewValidPass456",
        password_confirmation: "DifferentPass456"
      }
    }, as: :json

    assert_response :unprocessable_entity
  end

  test "update password requires authentication" do
    delete "/api/v1/logout", as: :json

    patch "/api/v1/account/password", params: {
      account: {
        current_password: VALID_PASSWORD,
        password: "NewValidPass456",
        password_confirmation: "NewValidPass456"
      }
    }, as: :json

    assert_response :unauthorized
  end

  # DELETE /api/v1/account

  test "destroy account with correct password" do
    user_id = @user.id

    delete "/api/v1/account", params: {
      account: { current_password: VALID_PASSWORD }
    }, as: :json

    assert_response :no_content
    assert_nil User.find_by(id: user_id)
  end

  test "destroy account destroys associated company and projects" do
    company = @user.company
    project_ids = company.projects.ids

    delete "/api/v1/account", params: {
      account: { current_password: VALID_PASSWORD }
    }, as: :json

    assert_response :no_content
    assert_nil Company.find_by(id: company.id)
    project_ids.each { |pid| assert_nil Project.find_by(id: pid) }
  end

  test "destroy account fails with wrong password" do
    delete "/api/v1/account", params: {
      account: { current_password: "wrongpassword" }
    }, as: :json

    assert_response :forbidden
    assert User.exists?(@user.id)
  end

  test "destroy account requires authentication" do
    delete "/api/v1/logout", as: :json

    delete "/api/v1/account", params: {
      account: { current_password: VALID_PASSWORD }
    }, as: :json

    assert_response :unauthorized
  end

  private

  def sign_in(user)
    post "/api/v1/login", params: { session: { email: user.email, password: VALID_PASSWORD } }, as: :json
  end
end
