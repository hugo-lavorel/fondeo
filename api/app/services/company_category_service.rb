class CompanyCategoryService
  def self.call(company)
    emp = Company::EMPLOYEE_RANGES.index(company.employee_range) || 0
    rev = Company::REVENUE_RANGES.index(company.annual_revenue_range) || 0
    bal = Company::BALANCE_SHEET_RANGES.index(company.balance_sheet_range) || 0

    if emp == 0 && (rev == 0 || bal == 0)
      "tpe"
    elsif emp <= 1 && (rev <= 1 || bal <= 1)
      "pme"
    elsif emp <= 2 && (rev <= 2 || bal <= 2)
      "eti"
    else
      "grande_entreprise"
    end
  end
end
