class ProcessItem < ApplicationRecord
  belongs_to :project

  DIRECTIONS = %w[input output].freeze

  validates :name, presence: true
  validates :direction, presence: true, inclusion: { in: DIRECTIONS }
  validates :percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }, allow_nil: true
  validate :total_percentage_within_limit

  private

  def total_percentage_within_limit
    return unless percentage.present? && direction.present?

    siblings = project.process_items.where(direction: direction)
    siblings = siblings.where.not(id: id) if persisted?
    total = siblings.sum(:percentage) + percentage
    return unless total > 100

    render_direction = direction == "input" ? "entrants" : "sortants"
    errors.add(:percentage, "La somme des pourcentages des #{render_direction} ne peut pas depasser 100% (actuellement #{total}%)")
  end
end
