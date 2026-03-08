module Api
  module V1
    class ExpensesController < ApplicationController
      before_action :require_authentication
      before_action :require_company

      def index
        expenses = current_project.expenses.order(created_at: :desc)
        render json: expenses.map { |e| expense_json(e) }
      end

      def create
        expense = current_project.expenses.build(expense_params)

        if expense.save
          render json: expense_json(expense), status: :created
        else
          render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        expense = current_project.expenses.find(params[:id])

        if expense.update(expense_params)
          render json: expense_json(expense)
        else
          render json: { errors: expense.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        expense = current_project.expenses.find(params[:id])
        expense.destroy!
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

      def expense_params
        params.require(:expense).permit(:name, :amount, :financing_type, :loan_rate, :loan_first_payment_date)
      end

      def expense_json(expense)
        {
          id: expense.id,
          name: expense.name,
          amount: expense.amount.to_f,
          financing_type: expense.financing_type,
          loan_rate: expense.loan_rate&.to_f,
          loan_first_payment_date: expense.loan_first_payment_date,
          created_at: expense.created_at
        }
      end
    end
  end
end
