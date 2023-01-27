import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Grid, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputField } from '../../../Components/FormFields/';

interface LoginForm {
  username: string;
  password: string;
}

const loginSchema = yup
  .object({
    username: yup.string().min(5).max(20).required(),
    password: yup.string().required(),
  })
  .required();

const Login = () => {
  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<LoginForm>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Typography variant="h4">Login Form</Typography>

      <Grid item xs={3}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField name="username" control={control} />
          <InputField name="password" control={control} />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Login
          </Button>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
