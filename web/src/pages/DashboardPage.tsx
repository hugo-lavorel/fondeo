import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getCompany, type Company } from "@/api/company";
import { labelFor, SECTORS, EMPLOYEE_RANGES, REVENUE_RANGES } from "@/lib/company-options";
import { Building2, Users, TrendingUp, FlaskConical } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCompany()
      .then(setCompany)
      .catch(() => setCompany(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bonjour {user?.first_name}</h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenue sur votre tableau de bord Fondeo.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      ) : company ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Votre entreprise</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Entreprise
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{company.name}</div>
                <p className="text-xs text-muted-foreground">SIREN {company.siren}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Secteur
                </CardTitle>
                <FlaskConical className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {labelFor(SECTORS, company.sector)}
                </div>
                {company.has_rd_team && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Equipe R&D
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Effectif
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {labelFor(EMPLOYEE_RANGES, company.employee_range)}
                </div>
                <p className="text-xs text-muted-foreground">salaries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Chiffre d'affaires
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {labelFor(REVENUE_RANGES, company.annual_revenue_range)}
                </div>
                <p className="text-xs text-muted-foreground">annuel</p>
              </CardContent>
            </Card>
          </div>

          {company.activity_description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Activite principale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{company.activity_description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </AppLayout>
  );
}
