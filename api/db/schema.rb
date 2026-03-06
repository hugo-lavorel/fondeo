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

ActiveRecord::Schema[8.1].define(version: 2026_03_04_200001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.bigint "addressable_id", null: false
    t.string "addressable_type", null: false
    t.string "city"
    t.string "country", default: "FR"
    t.datetime "created_at", null: false
    t.string "line1"
    t.string "line2"
    t.string "postal_code"
    t.datetime "updated_at", null: false
    t.index ["addressable_type", "addressable_id"], name: "index_addresses_on_addressable"
  end

  create_table "business_units", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.datetime "created_at", null: false
    t.boolean "is_headquarter", default: false
    t.string "name"
    t.string "nic", limit: 5
    t.string "siret", limit: 14
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_business_units_on_company_id"
    t.index ["siret"], name: "index_business_units_on_siret", unique: true
  end

  create_table "companies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "siren", limit: 9, null: false
    t.datetime "updated_at", null: false
    t.index ["siren"], name: "index_companies_on_siren", unique: true
  end

  create_table "employee_annual_data", force: :cascade do |t|
    t.decimal "acp_declared_time"
    t.decimal "additional_pension"
    t.decimal "agff_contribution"
    t.decimal "ags_contribution"
    t.datetime "created_at", null: false
    t.decimal "departure_indemnities", default: "0.0"
    t.bigint "employee_id", null: false
    t.decimal "employer_acp_indemnities", default: "0.0"
    t.decimal "employer_contribution", default: "0.0"
    t.integer "fiscal_year", null: false
    t.decimal "gmp_contribution"
    t.decimal "gross_salary"
    t.decimal "health_insurance"
    t.decimal "incentive_bonus", default: "0.0"
    t.decimal "meal_vouchers", default: "0.0"
    t.decimal "non_salary_acp_indemnities", default: "0.0"
    t.decimal "profit_sharing", default: "0.0"
    t.decimal "provident_fund"
    t.decimal "social_insurance"
    t.decimal "supplementary_pension"
    t.decimal "total_employer_contributions"
    t.decimal "total_mandatory_contributions"
    t.decimal "unemployment_insurance"
    t.datetime "updated_at", null: false
    t.decimal "worked_time"
    t.index ["employee_id", "fiscal_year"], name: "index_employee_annual_data_on_employee_id_and_fiscal_year", unique: true
    t.index ["employee_id"], name: "index_employee_annual_data_on_employee_id"
  end

  create_table "employees", force: :cascade do |t|
    t.bigint "business_unit_id", null: false
    t.string "classification_coefficient"
    t.string "contract_type"
    t.datetime "created_at", null: false
    t.date "doctorate_date"
    t.date "end_date"
    t.string "first_name", null: false
    t.string "highest_diploma"
    t.string "job_title"
    t.string "last_name", null: false
    t.date "permanent_contract_date"
    t.string "registration_number"
    t.string "research_qualification"
    t.date "start_date"
    t.string "status"
    t.datetime "updated_at", null: false
    t.index ["business_unit_id", "registration_number"], name: "index_employees_on_business_unit_id_and_registration_number", unique: true
    t.index ["business_unit_id"], name: "index_employees_on_business_unit_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "company_id"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "password_digest"
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_users_on_company_id"
  end

  add_foreign_key "business_units", "companies"
  add_foreign_key "employee_annual_data", "employees"
  add_foreign_key "employees", "business_units"
  add_foreign_key "users", "companies"
end
