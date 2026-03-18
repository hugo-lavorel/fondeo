# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_17_223626) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "companies", force: :cascade do |t|
    t.text "activity_description"
    t.string "annual_revenue_range", null: false
    t.string "balance_sheet_range", null: false
    t.string "city"
    t.string "company_category"
    t.datetime "created_at", null: false
    t.string "department"
    t.string "employee_range", null: false
    t.string "naf_code", limit: 6, null: false
    t.string "naf_label", null: false
    t.string "name", null: false
    t.string "postal_code"
    t.string "region"
    t.string "siren", limit: 9, null: false
    t.string "street"
    t.datetime "updated_at", null: false
    t.index ["naf_code"], name: "index_companies_on_naf_code"
    t.index ["siren"], name: "index_companies_on_siren", unique: true
  end

  create_table "expenses", force: :cascade do |t|
    t.decimal "amount", precision: 12, scale: 2, null: false
    t.date "commissioning_date"
    t.datetime "created_at", null: false
    t.string "financing_type", default: "self_funded", null: false
    t.string "investment_type"
    t.date "loan_first_payment_date"
    t.decimal "loan_rate", precision: 5, scale: 2
    t.string "name", null: false
    t.bigint "project_id", null: false
    t.date "quote_signed_date"
    t.integer "quotes_count"
    t.datetime "updated_at", null: false
    t.date "works_end_date"
    t.date "works_start_date"
    t.index ["project_id"], name: "index_expenses_on_project_id"
  end

  create_table "process_items", force: :cascade do |t|
    t.jsonb "certifications", default: []
    t.datetime "created_at", null: false
    t.string "customs_code"
    t.string "direction", null: false
    t.string "name", null: false
    t.decimal "percentage", precision: 5, scale: 2
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_process_items_on_project_id"
  end

  create_table "project_permits", force: :cascade do |t|
    t.integer "area_sqm"
    t.datetime "created_at", null: false
    t.boolean "is_extension", default: false, null: false
    t.date "permit_submission_date"
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.text "usage_description"
    t.integer "works_duration_months"
    t.date "works_start_date"
    t.index ["project_id"], name: "index_project_permits_on_project_id", unique: true
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "contact_email"
    t.string "contact_first_name"
    t.string "contact_last_name"
    t.string "contact_phone"
    t.string "contact_role"
    t.datetime "created_at", null: false
    t.string "location_city"
    t.string "location_department"
    t.boolean "location_is_headquarters", default: true, null: false
    t.string "location_postal_code"
    t.string "location_region"
    t.string "location_street"
    t.string "name", null: false
    t.boolean "needs_building_permit", default: false, null: false
    t.text "objective"
    t.text "process_after"
    t.text "process_before"
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_projects_on_company_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "company_id"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.integer "failed_login_attempts", default: 0, null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.datetime "locked_until"
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "expenses", "projects"
  add_foreign_key "process_items", "projects"
  add_foreign_key "project_permits", "projects"
  add_foreign_key "projects", "companies"
  add_foreign_key "users", "companies"
end
