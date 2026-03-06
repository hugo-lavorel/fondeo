class CreateCompanies < ActiveRecord::Migration[8.1]
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.string :siren, null: false, limit: 9
      t.text :activity_description
      t.string :sector, null: false
      t.string :employee_range, null: false
      t.string :annual_revenue_range, null: false
      t.boolean :has_rd_team, default: false, null: false

      t.timestamps
    end

    add_index :companies, :siren, unique: true

    add_reference :users, :company, foreign_key: true, null: true
  end
end
