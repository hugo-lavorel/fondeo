class Project < ApplicationRecord
  belongs_to :company
  has_one :permit, class_name: "ProjectPermit", dependent: :destroy

  validates :name, presence: true

  accepts_nested_attributes_for :permit, allow_destroy: true
end
