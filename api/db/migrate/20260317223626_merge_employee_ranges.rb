class MergeEmployeeRanges < ActiveRecord::Migration[8.1]
  def up
    Company.where(employee_range: %w[10_49 50_249]).update_all(employee_range: "10_249")
  end

  def down
    Company.where(employee_range: "10_249").update_all(employee_range: "10_49")
  end
end
