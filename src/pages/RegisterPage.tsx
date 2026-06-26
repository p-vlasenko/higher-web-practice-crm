import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, Title } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import LogoFullIcon from '../assets/icons/logo/logo-full.svg?react';
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

const registerPageClassName = [classes.authPage, classes.registerPage].join(
  ' ',
);

const registrationDefaultValues: RegistrationFormValues = {
  accountName: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  passwordRepeat: '',
};

const registerPageIntro =
  'Платформа для управления клиентами, сделками и задачами. Эффективно управляйте бизнес-процессами, отслеживайте ключевые показатели и выстраивайте продуктивные отношения с клиентами.';

function LoginLink({ children = 'Войти в аккаунт' }: { children?: string }) {
  return <Link to='/'>{children}</Link>;
}

function RegisterBrandPanel() {
  return (
    <div className={classes.brandPanel}>
      <LogoFullIcon aria-label='YaPlex CRM' className={classes.authLogo} />
      <div className={classes.registerBrandCopy}>
        <Text>{registerPageIntro}</Text>
        <div className={classes.authPrompt}>
          <Text size='sm' c='dimmed'>
            Уже зарегистрированы?
          </Text>
          <Text size='sm' fw={700}>
            <LoginLink />
          </Text>
        </div>
      </div>
    </div>
  );
}

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
    defaultValues: registrationDefaultValues,
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
    <main className={registerPageClassName}>
      <section className={classes.authLayout}>
        <RegisterBrandPanel />
        <form className={classes.authCard} onSubmit={handleSubmit(onSubmit)}>
          <Title order={2}>Регистрация</Title>
          <div className={classes.form}>
            <div className={classes.authField}>
              <Controller
                name='firstName'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    label='Имя'
                    placeholder='Ярополк'
                    error={errors.firstName?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={classes.authField}>
              <Controller
                name='lastName'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    label='Фамилия'
                    placeholder='Иванов'
                    error={errors.lastName?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={classes.authField}>
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    label='Email'
                    placeholder='ivanov@yandex.ru'
                    error={errors.email?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={classes.authField}>
              <Controller
                name='accountName'
                control={control}
                render={({ field }) => (
                  <CrmTextInput
                    label='Имя аккаунта'
                    placeholder='Yaropolk'
                    error={errors.accountName?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={classes.authField}>
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <CrmPasswordInput
                    label='Придумайте пароль'
                    placeholder='******'
                    error={errors.password?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className={classes.authField}>
              <Controller
                name='passwordRepeat'
                control={control}
                render={({ field }) => (
                  <CrmPasswordInput
                    label='Повторите пароль'
                    placeholder='******'
                    error={errors.passwordRepeat?.message}
                    {...field}
                  />
                )}
              />
            </div>
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
          <LoginLink />
        </div>
      </section>
    </main>
  );
}
