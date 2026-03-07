class ProjectPermit < ApplicationRecord
  belongs_to :project

  validates :permit_submission_date, presence: true
  validates :area_sqm, presence: true, numericality: { greater_than: 0 }
  validates :usage_description, presence: true
  validates :works_start_date, presence: true
  validates :works_duration_months, presence: true, numericality: { greater_than: 0 }
end
