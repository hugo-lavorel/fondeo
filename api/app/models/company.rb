class Company < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :projects, dependent: :destroy

  EMPLOYEE_RANGES      = %w[lt_10 10_249 250_4999 5000_plus].freeze
  REVENUE_RANGES       = %w[lt_2m 2m_50m 50m_1500m 1500m_plus].freeze
  BALANCE_SHEET_RANGES = %w[lt_2m 2m_43m 43m_2000m 2000m_plus].freeze
  CATEGORIES           = %w[tpe pme eti grande_entreprise].freeze

  normalizes :siren, with: ->(siren) { siren.gsub(/\s/, "") }

  validates :name, presence: true
  validates :siren, presence: true, uniqueness: true,
    format: { with: /\A\d{9}\z/, message: "must be 9 digits" }
  validates :naf_code, presence: true, format: { with: /\A\d{2}\.\d{2}[A-Z]\z/ }
  validates :naf_label, presence: true
  validates :employee_range, presence: true, inclusion: { in: EMPLOYEE_RANGES }
  validates :annual_revenue_range, presence: true, inclusion: { in: REVENUE_RANGES }
  validates :balance_sheet_range, presence: true, inclusion: { in: BALANCE_SHEET_RANGES }
end
