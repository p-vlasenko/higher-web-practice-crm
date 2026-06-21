import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, Title } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import LogoFullIcon from '../../design/ui-kit/logo/logo-full.svg?react';
import { useGetUsersQuery } from '../api/endpoints/crmEndpoints';
import { useAppDispatch } from '../app/hooks';
import { CrmPasswordInput, CrmTextInput } from '../components/ui/FormFields';
import { findUserByCredentials } from '../features/auth/authService';
import {
  loginSchema,
  type LoginFormValues,
} from '../features/auth/authSchemas';
import { loginSucceeded } from '../features/auth/sessionSlice';
import classes from './Page.module.css';

export function LandingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: users = [] } = useGetUsersQuery();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (values: LoginFormValues) => {
    const user = findUserByCredentials(users, values);
    if (!user) {
      setError('password', { message: 'Неверный email или пароль' });
      return;
    }
    dispatch(loginSucceeded(user));
    navigate('/dashboard');
  };

  return (
    <main className={`${classes.authPage} ${classes.loginPage}`}>
      <section className={classes.authLayout}>
        <div className={classes.brandPanel}>
          <LogoFullIcon aria-label='YaPlex CRM' className={classes.authLogo} />
          <div className={classes.brandCopy}>
            <Text>
              Платформа для управления клиентами, сделками и задачами.
            </Text>
            <Text>
              Эффективно управляйте бизнес-процессами, отслеживайте ключевые
              показатели и выстраивайте продуктивные отношения с клиентами.
            </Text>
          </div>
          <Text size='sm' c='dimmed'>
            Нет аккаунта? <Link to='/register'>Зарегистрироваться</Link>
          </Text>
        </div>
        <form className={classes.authCard} onSubmit={handleSubmit(onSubmit)}>
          <Title order={2}>Вход в аккаунт</Title>
          <div className={classes.form}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <CrmTextInput
                  required
                  label='Email или логин'
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <div className={classes.loginPasswordGroup}>
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
              <a className={classes.forgotPasswordLink} href='#forgot-password'>
                Забыли пароль?
              </a>
            </div>
          </div>
          <Button
            className={classes.loginSubmitButton}
            type='submit'
            loading={isSubmitting}
          >
            Войти
          </Button>
        </form>
        <div className={classes.mobileRegistrationRedirect}>
          <span>Нет аккаунта?</span>
          <Link to='/register'>Зарегистрироваться</Link>
        </div>
      </section>
    </main>
  );
}
