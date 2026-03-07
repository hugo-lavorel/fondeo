class EnrichProjectsAndCreateProjectPermits < ActiveRecord::Migration[8.1]
  def change
    # Rename description -> objective
    rename_column :projects, :description, :objective

    # Location fields
    add_column :projects, :location_is_headquarters, :boolean, default: true, null: false
    add_column :projects, :location_street, :string
    add_column :projects, :location_postal_code, :string
    add_column :projects, :location_city, :string
    add_column :projects, :location_department, :string
    add_column :projects, :location_region, :string

    # Contact fields
    add_column :projects, :contact_first_name, :string
    add_column :projects, :contact_last_name, :string
    add_column :projects, :contact_email, :string
    add_column :projects, :contact_phone, :string
    add_column :projects, :contact_role, :string

    # Building permit flag
    add_column :projects, :needs_building_permit, :boolean, default: false, null: false

    # Building permit details table
    create_table :project_permits do |t|
      t.references :project, null: false, foreign_key: true, index: { unique: true }
      t.date :permit_submission_date
      t.boolean :is_extension, default: false, null: false
      t.integer :area_sqm
      t.text :usage_description
      t.date :works_start_date
      t.integer :works_duration_months
      t.timestamps
    end
  end
end
