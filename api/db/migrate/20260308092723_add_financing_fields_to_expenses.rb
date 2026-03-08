class AddFinancingFieldsToExpenses < ActiveRecord::Migration[8.1]
  def change
    add_column :expenses, :financing_type, :string, null: false, default: "self_funded"
    add_column :expenses, :loan_rate, :decimal, precision: 5, scale: 2
    add_column :expenses, :loan_first_payment_date, :date
  end
end
