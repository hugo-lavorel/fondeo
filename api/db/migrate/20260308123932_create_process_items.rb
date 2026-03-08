class CreateProcessItems < ActiveRecord::Migration[8.1]
  def change
    create_table :process_items do |t|
      t.references :project, null: false, foreign_key: true
      t.string :direction, null: false
      t.string :name, null: false
      t.string :customs_code
      t.decimal :percentage, precision: 5, scale: 2
      t.jsonb :certifications, default: []

      t.timestamps
    end
  end
end
