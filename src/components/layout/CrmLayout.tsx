import { Group } from '@mantine/core';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { cx } from 'classix';

import { useAppSelector } from '../../app/hooks';
import BarsIcon from '../../assets/icons/icons-24x24/bars.svg?react';
import BriefcaseIcon from '../../assets/icons/icons-24x24/briefcase.svg?react';
import HomeIcon from '../../assets/icons/icons-24x24/home.svg?react';
import ProjectIcon from '../../assets/icons/icons-24x24/project.svg?react';
import SidebarCollapseIcon from '../../assets/icons/icons-24x24/sidebar-collapse.svg?react';
import SidebarExpandIcon from '../../assets/icons/icons-24x24/sidebar-expand.svg?react';
import TaskIcon from '../../assets/icons/icons-24x24/task.svg?react';
import TeamIcon from '../../assets/icons/icons-24x24/team.svg?react';
import UserIcon from '../../assets/icons/icons-24x24/user.svg?react';
import XMarkIcon from '../../assets/icons/icons-24x24/x-mark.svg?react';
import LogoIcon from '../../assets/icons/logo/logo.svg?react';
import LogoFullIcon from '../../assets/icons/logo/logo-full.svg?react';
import { getUserDisplayName } from '../../utils/users';
import { CrmIconButton } from '../ui/IconButton';
import classes from './CrmLayout.module.css';

const navItems = [
  { to: '/dashboard', label: 'Главная', Icon: HomeIcon },
  { to: '/clients', label: 'Клиенты', Icon: TeamIcon },
  { to: '/deals', label: 'Сделки', Icon: BriefcaseIcon },
  { to: '/tasks', label: 'Задачи', Icon: TaskIcon },
  { to: '/reports', label: 'Отчёты', Icon: ProjectIcon },
];

export function CrmLayout() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.session.user);
  const userName = user ? getUserDisplayName(user) : null;

  return (
    <div className={classes.shell}>
      <header className={classes.mobileHeader}>
        <div className={classes.mobileHeaderInner}>
          <button
            className={classes.mobileHeaderButton}
            type='button'
            aria-label='Открыть меню'
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <BarsIcon aria-hidden='true' />
          </button>
          <Link
            aria-label='YaPlex CRM'
            className={classes.mobileLogo}
            to='/dashboard'
          >
            <LogoIcon aria-hidden='true' />
          </Link>
          <button
            className={classes.mobileHeaderButton}
            type='button'
            aria-label='Профиль'
            onClick={() => navigate('/profile')}
          >
            <UserIcon aria-hidden='true' />
          </button>
        </div>
      </header>
      {isMobileMenuOpen ? (
        <div
          className={classes.mobileMenu}
          role='dialog'
          aria-modal='true'
          aria-label='Мобильное меню'
        >
          <div className={classes.mobileMenuHeader}>
            <LogoFullIcon
              aria-hidden='true'
              className={classes.mobileMenuLogo}
            />
            <button
              className={classes.mobileMenuClose}
              type='button'
              aria-label='Закрыть меню'
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <XMarkIcon aria-hidden='true' />
            </button>
          </div>
          <nav
            className={classes.mobileMenuNav}
            aria-label='Основная навигация'
          >
            {navItems.map(({ to, label, Icon }, index) => (
              <div className={classes.mobileMenuGroup} key={to}>
                <NavLink
                  className={classes.mobileMenuLink}
                  to={to}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon aria-hidden='true' />
                  <span>{label}</span>
                </NavLink>
                {index < navItems.length - 1 ? (
                  <span className={classes.mobileMenuDivider} />
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      ) : null}
      <div
        className={cx(
          classes.workspace,
          isSidebarExpanded && classes.workspaceExpanded,
        )}
      >
        <aside
          className={cx(
            classes.sidebar,
            isSidebarExpanded && classes.sidebarExpanded,
          )}
        >
          <div className={classes.sidebarTop}>
            <button
              aria-expanded={isSidebarExpanded}
              aria-label={
                isSidebarExpanded
                  ? 'Свернуть боковую панель'
                  : 'Развернуть боковую панель'
              }
              className={cx(
                classes.sidebarToggle,
                isSidebarExpanded && classes.sidebarToggleExpanded,
              )}
              type='button'
              onClick={() => setIsSidebarExpanded((value) => !value)}
            >
              {isSidebarExpanded ? (
                <SidebarCollapseIcon aria-hidden='true' />
              ) : (
                <SidebarExpandIcon aria-hidden='true' />
              )}
            </button>
            <nav className={classes.nav} aria-label='Основная навигация'>
              {navItems.map(({ to, label, Icon }) => (
                <NavLink
                  aria-label={label}
                  className={({ isActive }) =>
                    cx(
                      classes.navItem,
                      isSidebarExpanded && classes.navItemExpanded,
                      isActive && classes.active,
                    )
                  }
                  key={to}
                  title={label}
                  to={to}
                >
                  <Icon aria-hidden='true' />
                  <span
                    className={cx(
                      isSidebarExpanded && classes.navLabelVisible,
                      !isSidebarExpanded && classes.navLabel,
                    )}
                  >
                    {label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div className={classes.sidebarBottom}>
            <NavLink
              aria-label='Профиль'
              className={({ isActive }) =>
                cx(
                  classes.userItem,
                  isSidebarExpanded && classes.userItemExpanded,
                  isActive && classes.active,
                )
              }
              title={userName ?? 'Профиль'}
              to='/profile'
            >
              <UserIcon aria-hidden='true' />
              <span
                className={cx(
                  isSidebarExpanded && classes.navLabelVisible,
                  !isSidebarExpanded && classes.navLabel,
                )}
              >
                {userName ?? 'Пользователь'}
              </span>
            </NavLink>
          </div>
        </aside>
        <main className={classes.main} aria-label='CRM page content'>
          <Outlet />
        </main>
      </div>
      <nav className={classes.mobileNav} aria-label='Мобильная навигация'>
        <div className={classes.mobileNavInner}>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to}>
              {({ isActive }) => (
                <CrmIconButton label={label} active={isActive}>
                  <Icon aria-hidden='true' />
                </CrmIconButton>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <Group justify='space-between' align='center' mb='lg'>
      <h1>{title}</h1>
      {actions}
    </Group>
  );
}
