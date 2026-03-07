class ReplaceCompanySectorWithNaf < ActiveRecord::Migration[8.1]
  def up
    add_column :companies, :naf_code, :string, limit: 6
    add_column :companies, :naf_label, :string

    change_column_null :companies, :naf_code, false
    change_column_null :companies, :naf_label, false

    remove_column :companies, :sector

    add_index :companies, :naf_code
  end

  def down
    add_column :companies, :sector, :string

    remove_index :companies, :naf_code
    remove_column :companies, :naf_code
    remove_column :companies, :naf_label
  end
end
