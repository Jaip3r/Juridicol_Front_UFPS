import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "../pages/Login"
import { RequestResetPasswordForm } from "../pages/BuscarCuenta";
import { ResetPassword } from "../pages/ResetPassword";
import { Dashboard } from "../pages/admin/Dashboard";
import { Perfil } from "../pages/Perfil";


export const AppRouter = () => {

    return (
        <Router>
            <Routes>

                {/* Rutas públicas */}
                <Route element={<Login />} path="/" />
                <Route path="/request-password-reset" element={<RequestResetPasswordForm />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Rutas de admin */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Perfil /> } />

                {/* Ruta para manejar 404 (página no encontrada) */}
                <Route element={<div>Recurso no encontrado</div>} path="*" />

            </Routes>
        </Router>
    )

}
