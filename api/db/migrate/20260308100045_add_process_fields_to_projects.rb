class AddProcessFieldsToProjects < ActiveRecord::Migration[8.1]
  def change
    add_column :projects, :process_before, :text
    add_column :projects, :process_after, :text
  end
end
