import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Fondeo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.first_name} {user?.last_name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Deconnexion
            </Button>
          </div>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">
          Bonjour {user?.first_name}
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur Fondeo. Votre tableau de bord sera bientot disponible.
        </p>
      </div>
    </div>
  );
}
