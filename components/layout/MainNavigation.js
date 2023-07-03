import Link from 'next/link';

import classes from './MainNavigation.module.css';

function MainNavigation() {

  return (
    <header className={classes.header}>
      <div className={classes.logo}>React reacsacdsca</div>
      <nav>
        <ul>
          <li>
            <Link href='/'>All cdsacdsa</Link>
          </li>
          <li>
            <Link href='/new-meetup'>Add New Mecdsacdcdsasetup</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
