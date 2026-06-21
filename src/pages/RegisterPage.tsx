import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, Title } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import LogoFullIcon from '../../design/ui-kit/logo/logo-full.svg?react';
import {
  useCreateUserMutation,
  useGetUsersQuery,
} from '../api/endpoints/crmEndpoints';
import { useAppDispatch } from '../app/hooks';
import { CrmPasswordInput, CrmTextInput } from '../components/ui/FormFields';
import { createUserPayload, isEmailTaken } from '../features/auth/authService';
import {
  registrationSchema,
  type RegistrationFormValues,
} from '../features/auth/authSchemas';
import { loginSucceeded } from '../features/auth/sessionSlice';
import classes from './Page.module.css';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: users = [] } = useGetUsersQuery();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { email: '', password: '', name: '' },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    if (isEmailTaken(users, values.email)) {
      setError('email', { message: 'Email уже используется' });
      return;
    }

    const user = await createUser(createUserPayload(values)).unwrap();

    dispatch(loginSucceeded(user));
    navigate('/dashboard');
  };

  return (
    <main className={`${classes.authPage} ${classes.registerPage}`}>
      <section className={classes.authLayout}>
        <div className={classes.brandPanel}>
          <LogoFullIcon aria-label='YaPlex CRM' className={classes.authLogo} />
          <Text>
            Создайте аккаунт и начните вести клиентов, сделки и задачи в едином
            рабочем пространстве.
          </Text>
          <Text size='sm' c='dimmed'>
            Уже есть аккаунт? <Link to='/'>Войти</Link>
          </Text>
        </div>
        <form className={classes.authCard} onSubmit={handleSubmit(onSubmit)}>
          <Title order={2}>Регистрация</Title>
          <div className={classes.form}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <CrmTextInput
                  required
                  label='Имя'
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CrmTextInput
                  required
                  label='Email'
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <CrmPasswordInput
                  required
                  label='Пароль'
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Button
            className={classes.loginSubmitButton}
            type='submit'
            loading={isLoading}
          >
            Зарегистрироваться
          </Button>
        </form>
        <div className={classes.mobileRegistrationRedirect}>
          <span>Уже зарегистрированы?</span>
          <Link to='/'>Войти в аккаунт</Link>
        </div>
      </section>
    </main>
  );
}
