import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import { Login } from "../pages/Login"
import { RequestResetPasswordForm } from "../pages/BuscarCuenta";
import { ResetPassword } from "../pages/ResetPassword";
import { Dashboard } from "../pages/admin/Dashboard";


export const AppRouter = () => {

    return (
        <Router>
            <Routes>
                <Route element={<Login />} path="/" />
                <Route path="/request-password-reset" element={<RequestResetPasswordForm />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route element={<div>Recurso no encontrado</div>} path="*" />
            </Routes>
        </Router>
    )

}
