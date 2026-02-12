import { useMutation } from '@apollo/client/react';
import { REGISTER_MUT } from '~/graphql/mutations/register';

export function useRegister() {
    const [register, { loading, error }] = useMutation(REGISTER_MUT);

    const handleRegister = async () => {
        await register({
            variables: {
                
            }
        })
    }
}