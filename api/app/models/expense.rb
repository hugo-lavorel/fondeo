class Expense < ApplicationRecord
  belongs_to :project

  FINANCING_TYPES = %w[self_funded loan leasing].freeze
  INVESTMENT_TYPES = %w[building equipment software consulting training r_and_d].freeze

  validates :name, presence: true
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :financing_type, presence: true, inclusion: { in: FINANCING_TYPES }
  validates :investment_type, presence: true, inclusion: { in: INVESTMENT_TYPES }
  validates :loan_rate, presence: true, numericality: { greater_than: 0 }, if: -> { financing_type == "loan" }
  validates :loan_first_payment_date, presence: true, if: -> { financing_type == "loan" }
  validates :quotes_count, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end
