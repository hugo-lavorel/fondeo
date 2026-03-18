module Api
  module V1
    class CompaniesController < ApplicationController
      before_action :require_authentication

      def create
        if current_user.company.present?
          render json: { error: "Company already exists" }, status: :unprocessable_entity
          return
        end

        company = Company.new(company_params)
        company.company_category = CompanyCategoryService.call(company)

        if company.save
          current_user.update!(company: company)
          render json: company_json(company), status: :created
        else
          render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        company = current_user.company

        if company
          render json: company_json(company)
        else
          render json: { error: "No company found" }, status: :not_found
        end
      end

      def update
        company = current_user.company

        unless company
          render json: { error: "No company found" }, status: :not_found
          return
        end

        company.assign_attributes(company_params)
        company.company_category = CompanyCategoryService.call(company)

        if company.save
          render json: company_json(company)
        else
          render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def company_params
        params.require(:company).permit(
          :name, :siren, :activity_description, :naf_code, :naf_label,
          :employee_range, :annual_revenue_range, :balance_sheet_range,
          :street, :postal_code, :city, :department, :region
        )
      end

      def company_json(company)
        {
          id: company.id,
          name: company.name,
          siren: company.siren,
          activity_description: company.activity_description,
          naf_code: company.naf_code,
          naf_label: company.naf_label,
          employee_range: company.employee_range,
          annual_revenue_range: company.annual_revenue_range,
          balance_sheet_range: company.balance_sheet_range,
          company_category: company.company_category,
          street: company.street,
          postal_code: company.postal_code,
          city: company.city,
          department: company.department,
          region: company.region
        }
      end
    end
  end
end
