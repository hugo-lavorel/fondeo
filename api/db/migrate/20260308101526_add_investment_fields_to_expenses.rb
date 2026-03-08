class AddInvestmentFieldsToExpenses < ActiveRecord::Migration[8.1]
  def change
    add_column :expenses, :investment_type, :string
    add_column :expenses, :quotes_count, :integer
    add_column :expenses, :quote_signed_date, :date
    add_column :expenses, :works_start_date, :date
    add_column :expenses, :works_end_date, :date
    add_column :expenses, :commissioning_date, :date
  end
end
