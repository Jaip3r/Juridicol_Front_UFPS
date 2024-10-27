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
import { ChangePassword } from "../pages/common/ChangePassword";
import { SessionExpiredModal } from "../components/utils/SessionExpiredModal";
import { Usuarios } from "../pages/admin/users/Usuarios";
import { Register } from "../pages/admin/users/Register";
import { UpdateUser } from "../pages/admin/users/UpdateUser";
import { Home } from "../pages/student/Home";
import { Solicitantes } from "../pages/admin/solicitantes/Solicitantes";
import { InfoSolicitante } from "../pages/admin/solicitantes/InfoSolicitante";
import { UpdateSolicitante } from "../pages/admin/solicitantes/UpdateSolicitante";


export const AppRouter = () => {

    return (
        <Router>

            <SessionExpiredModal />

            <Routes>

                {/* Rutas públicas */}
                <Route path="/" element={<Login />} />
                <Route path="/request-password-reset" element={<RequestResetPasswordForm />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

                {/* Rutas protegidas */}
                <Route element={<PersistLogin />}>

                    {/* Rutas de estudiante */}
                    <Route element={<RequireAuth allowedRoles={["estudiante"]} />}>
                        <Route path="student-home" element={<Home />} />
                        <Route path="/student-profile" element={<Perfil />} />
                    </Route>

                    {/* Rutas de admin */}
                    <Route element={<RequireAuth allowedRoles={["administrador"]} />}>
                        <Route path="/admin-dashboard" element={<Dashboard />} />
                        <Route path="/admin-profile" element={<Perfil />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                        <Route path="/register" element={<Register />}></Route>
                        <Route path="/users/:rol" element={<Usuarios />} />
                        <Route path="/users/edit/:id" element={<UpdateUser />} /> 

                        <Route path="/solicitantes" element={<Solicitantes />} />
                        <Route path="/solicitantes/info/:id" element={<InfoSolicitante />} />
                        <Route path="/solicitantes/edit/:id" element={<UpdateSolicitante />} />
                    </Route>

                    {/* Ruta para manejar 404 (página no encontrada) y acceso no autorizado */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />

                </Route>

            </Routes>
        </Router>
    );

};
