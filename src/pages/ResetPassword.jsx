import { Background } from '../components/container/Background';
import { CardWrapper } from '../components/utils/CardWrapper';
import { ResetPasswordForm } from '../components/forms/ResetPasswordForm';


export const ResetPassword = () => {

    return (

        <Background>
            <CardWrapper wd={['90%', '60%', '450px']} maxWd={"450px"} p={[4, 6, 8]}>
                <ResetPasswordForm></ResetPasswordForm>
            </CardWrapper>
        </Background>

    );

};
