import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "../pages/Login"
import { RequestResetPasswordForm } from "../pages/BuscarCuenta";
import { ResetPassword } from "../pages/ResetPassword";
import { Dashboard } from "../pages/admin/Dashboard";
import { Perfil } from "../pages/Perfil";
import { RequireAuth } from "../components/auth/RequireAuth";
import { NotFound } from "../pages/404/NotFound";
import { Unauthorized } from "../pages/Unauthorized";
import { PersistLogin } from "../components/auth/PersistLogin";


export const AppRouter = () => {

    return (
        <Router>
            <Routes>

                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/request-password-reset" element={<RequestResetPasswordForm />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Rutas protegidas */}
                <Route element={<PersistLogin />}>

                    {/* Rutas de admin */}
                    <Route element={<RequireAuth allowedRoles={["administrador"]} />}>
                        <Route path="/admin-dashboard" element={<Dashboard />} />
                        <Route path="/admin-profile" element={<Perfil />} />
                    </Route>

                </Route>

                {/* Ruta para manejar 404 (página no encontrada) y no acceso no autorizado */}
                <Route path="/no-disponible" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Router>
    )

}
