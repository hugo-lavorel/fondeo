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

        if company.update(company_params)
          render json: company_json(company)
        else
          render json: { errors: company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def company_params
        params.require(:company).permit(
          :name, :siren, :activity_description, :naf_code, :naf_label,
          :employee_range, :annual_revenue_range
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
          annual_revenue_range: company.annual_revenue_range
        }
      end
    end
  end
end
