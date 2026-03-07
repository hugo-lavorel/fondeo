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
        project = current_company.projects.find(params[:id])
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
        params.require(:project).permit(:name, :description)
      end

      def project_json(project)
        {
          id: project.id,
          name: project.name,
          description: project.description,
          created_at: project.created_at
        }
      end
    end
  end
end
