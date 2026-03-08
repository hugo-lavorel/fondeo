module Api
  module V1
    class ProjectsController < ApplicationController
      before_action :require_authentication
      before_action :require_company

      def index
        projects = current_company.projects.order(created_at: :desc)
        render json: projects.map { |p| project_json(p) }
      end

      def show
        project = current_company.projects.includes(:permit, :expenses).find(params[:id])
        render json: project_json(project)
      end

      def create
        project = current_company.projects.build(project_params)

        if project.save
          render json: project_json(project), status: :created
        else
          render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        project = current_company.projects.find(params[:id])

        if project.update(project_params)
          render json: project_json(project)
        else
          render json: { errors: project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        project = current_company.projects.find(params[:id])
        project.destroy!
        head :no_content
      end

      private

      def require_company
        render json: { error: "No company found" }, status: :not_found unless current_company
      end

      def current_company
        current_user&.company
      end

      def project_params
        params.require(:project).permit(
          :name, :objective,
          :location_is_headquarters,
          :location_street, :location_postal_code, :location_city,
          :location_department, :location_region,
          :contact_first_name, :contact_last_name, :contact_email,
          :contact_phone, :contact_role,
          :needs_building_permit,
          permit_attributes: [
            :id, :permit_submission_date, :is_extension, :area_sqm,
            :usage_description, :works_start_date, :works_duration_months,
            :_destroy
          ]
        )
      end

      def project_json(project)
        data = {
          id: project.id,
          name: project.name,
          objective: project.objective,
          location_is_headquarters: project.location_is_headquarters,
          location_street: project.location_street,
          location_postal_code: project.location_postal_code,
          location_city: project.location_city,
          location_department: project.location_department,
          location_region: project.location_region,
          contact_first_name: project.contact_first_name,
          contact_last_name: project.contact_last_name,
          contact_email: project.contact_email,
          contact_phone: project.contact_phone,
          contact_role: project.contact_role,
          needs_building_permit: project.needs_building_permit,
          permit: nil,
          total_expenses: project.expenses.sum(:amount).to_f,
          total_eligible_expenses: project.expenses.where.not(financing_type: "leasing").sum(:amount).to_f,
          total_leasing_expenses: project.expenses.where(financing_type: "leasing").sum(:amount).to_f,
          created_at: project.created_at
        }

        if project.permit
          data[:permit] = {
            id: project.permit.id,
            permit_submission_date: project.permit.permit_submission_date,
            is_extension: project.permit.is_extension,
            area_sqm: project.permit.area_sqm,
            usage_description: project.permit.usage_description,
            works_start_date: project.permit.works_start_date,
            works_duration_months: project.permit.works_duration_months
          }
        end

        data
      end
    end
  end
end
