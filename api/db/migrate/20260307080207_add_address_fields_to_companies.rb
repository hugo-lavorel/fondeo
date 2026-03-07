class AddAddressFieldsToCompanies < ActiveRecord::Migration[8.1]
  def change
    add_column :companies, :street, :string
    add_column :companies, :postal_code, :string
    add_column :companies, :city, :string
    add_column :companies, :department, :string
    add_column :companies, :region, :string
  end
end
