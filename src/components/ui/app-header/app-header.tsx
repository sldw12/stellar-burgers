import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();
  const isIngredient = location.pathname.startsWith('/ingredients/');
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive || isIngredient ? styles.link_active : ''} mr-10`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive || isIngredient ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 ${
                    isActive || isIngredient ? '' : 'text_color_inactive'
                  }`}
                >
                  Конструктор
                </p>
              </>
            )}
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 ${
                    isActive ? '' : 'text_color_inactive'
                  }`}
                >
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>

        <NavLink to="/" className={styles.logo} aria-label="Stellar Burgers">
          <Logo className="" />
        </NavLink>

        <div className={styles.link_position_last}>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 ${
                    isActive ? '' : 'text_color_inactive'
                  }`}
                >
                  {userName ?? 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
