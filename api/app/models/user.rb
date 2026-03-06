class User < ApplicationRecord
  has_secure_password

  belongs_to :company, optional: true

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :password, length: { minimum: 12 }, if: :password_required?
  validate :password_complexity, if: :password_required?

  MAX_LOGIN_ATTEMPTS = 5
  LOCKOUT_DURATION = 30.minutes

  def locked?
    locked_until.present? && locked_until > Time.current
  end

  def record_failed_login!
    increment!(:failed_login_attempts)
    update!(locked_until: LOCKOUT_DURATION.from_now) if failed_login_attempts >= MAX_LOGIN_ATTEMPTS
  end

  def reset_failed_logins!
    update!(failed_login_attempts: 0, locked_until: nil)
  end

  private

  def password_required?
    password_digest_changed? || new_record?
  end

  def password_complexity
    return if password.blank?

    unless password.match?(/[a-z]/) && password.match?(/[A-Z]/) && password.match?(/\d/)
      errors.add(:password, "must include at least one lowercase letter, one uppercase letter, and one digit")
    end
  end
end
