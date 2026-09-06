import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";


export default function RequireAuth() {
  // Extraction de l'utilisateur depuis le slice "account" de Redux
  const { user } = useAppSelector((state) => state.account);
  const location = useLocation();

  // Si l'utilisateur n'est pas connecté, redirection vers /login en conservant l'origine
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si l'utilisateur est authentifié, affichage de la route enfant demandée
  return <Outlet />;
}