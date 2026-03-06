class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.integer :failed_login_attempts, default: 0, null: false
      t.datetime :locked_until

      t.timestamps
    end

    add_index :users, :email, unique: true
  end
end
