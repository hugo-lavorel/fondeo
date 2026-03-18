class AddCompanyCategoryFields < ActiveRecord::Migration[8.1]
  def up
    Company.where(employee_range: "250_plus").update_all(employee_range: "250_4999")
    Company.where(annual_revenue_range: %w[2m_10m 10m_50m]).update_all(annual_revenue_range: "2m_50m")
    Company.where(annual_revenue_range: "50m_plus").update_all(annual_revenue_range: "1500m_plus")

    add_column :companies, :balance_sheet_range, :string, null: false, default: "lt_2m"
    change_column_default :companies, :balance_sheet_range, nil

    add_column :companies, :company_category, :string
  end

  def down
    remove_column :companies, :balance_sheet_range
    remove_column :companies, :company_category

    Company.where(employee_range: "250_4999").update_all(employee_range: "250_plus")

    Company.where(annual_revenue_range: "2m_50m").update_all(annual_revenue_range: "2m_10m")
    Company.where(annual_revenue_range: "1500m_plus").update_all(annual_revenue_range: "50m_plus")
  end
end
