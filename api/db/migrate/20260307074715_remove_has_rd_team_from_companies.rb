class RemoveHasRdTeamFromCompanies < ActiveRecord::Migration[8.1]
  def change
    remove_column :companies, :has_rd_team, :boolean, default: false, null: false
  end
end
