module Api
  module V1
    class ProcessItemsController < ApplicationController
      before_action :require_authentication
      before_action :require_company

      def index
        items = current_project.process_items.order(:direction, :name)
        render json: items.map { |i| item_json(i) }
      end

      def create
        item = current_project.process_items.build(item_params)

        if item.save
          render json: item_json(item), status: :created
        else
          render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        item = current_project.process_items.find(params[:id])

        if item.update(item_params)
          render json: item_json(item)
        else
          render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        item = current_project.process_items.find(params[:id])
        item.destroy!
        head :no_content
      end

      private

      def require_company
        render json: { error: "No company found" }, status: :not_found unless current_company
      end

      def current_company
        current_user&.company
      end

      def current_project
        @current_project ||= current_company.projects.find(params[:project_id])
      end

      def item_params
        params.require(:process_item).permit(:direction, :name, :customs_code, :percentage, certifications: [])
      end

      def item_json(item)
        {
          id: item.id,
          direction: item.direction,
          name: item.name,
          customs_code: item.customs_code,
          percentage: item.percentage&.to_f,
          certifications: item.certifications || [],
          created_at: item.created_at
        }
      end
    end
  end
end
