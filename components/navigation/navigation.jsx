import React from 'react';
import Link from '../link/link';
import Container from '../container/container';
import Logo from '../logo/logo';
import Dropdown from '../dropdown/dropdown';
import USFlag from '../../assets/language/english.png';
import ChineseFlag from '../../assets/language/chinese.png';

// TODO: Maybe by updating the routing scheme later on we can avoid hardcoding this?
let Sections = [
  {
    title: 'Concepts',
    url: 'concepts'
  },
  {
    title: 'Guides',
    url: 'guides'
  },
  {
    title: 'Documentation',
    url: 'documentation/configuration',
    children: [
      { title: 'API', url: 'documentation/api' },
      { title: 'Configuration', url: 'documentation/configuration' },
      { title: 'Loaders', url: 'documentation/loaders' },
      { title: 'Plugins', url: 'documentation/plugins' },
      { title: 'Development', url: 'documentation/development' }
    ]
  },
  {
    title: 'Support',
    url: 'support'
  },
  {
    title: 'Blog',
    url: '//medium.com/webpack'
  },
  {
    title: 'Donate',
    url: '//opencollective.com/webpack'
  }
];

// TODO: Move back to using state once we can handle algolia on our own
export default class Navigation extends React.Component {
  render() {
    let { pageUrl = '' } = this.props;

    return (
      <header className="navigation">
        <Container className="navigation__inner">
          <div className="navigation__mobile" onClick={ this._toggleSidebar }>
            <i className="icon-menu" />
          </div>

          <Link className="navigation__logo" to="/">
            <Logo light={ true } />
          </Link>

          <nav className="navigation__links">
            {
              Sections.map(section => {
                let active = this._isActive(section);
                let activeMod = active ? 'navigation__link--active' : '';

                return (
                  <Link
                    key={ `navigation__link-${section.title}` }
                    className={ `navigation__link ${activeMod}` }
                    to={ `/${section.url}` }>
                    { section.title }
                  </Link>
                );
              })
            }
          </nav>

          <div className="navigation__search">
            <input
              type="text"
              className="navigation__search-input"
              placeholder="Search documentation…"
              onBlur={ this._toggleSearch.bind(this) } />
            <button
              className="navigation__search-icon icon-magnifying-glass"
              onClick={ this._toggleSearch.bind(this) } />
            <button
              className="navigation__search-icon icon-cross"
              onClick={ this._toggleSearch.bind(this) } />
          </div>

          <Link
            className="navigation__icon"
            title="GitHub Repository"
            to="//github.com/webpack/webpack">
            <i className="sidecar__icon icon-github" />
          </Link>

          <Link
            className="navigation__icon"
            title="See Questions on Stack Overflow"
            to="//stackoverflow.com/questions/tagged/webpack">
            <i className="sidecar__icon icon-stack-overflow" />
          </Link>

          <Dropdown
            className="navigation__languages"
            items={[
              { title: 'English', url: 'https://webpack.js.org/', image: USFlag },
              { title: 'Chinese', url: 'https://doc.webpack-china.org/', image: ChineseFlag }
            ]} />
        </Container>

        {
          Sections.filter(section => this._isActive(section) && section.children).map(section => {
            return (
              <div className="navigation__bottom" key={ section.title }>
                <Container className="navigation__inner">
                  {
                    section.children.map(child => {
                      let activeMod = this._isActive(child) ? 'navigation__child--active' : '';

                      return (
                        <Link
                          key={ `navigation__child-${child.title}` }
                          className={ `navigation__child ${activeMod}` }
                          to={ `/${child.url}` }>
                          { child.title }
                        </Link>
                      );
                    })
                  }
                </Container>
              </div>
            );
          })
        }
      </header>
    );
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      let docsearch = () => {};

      // XXX: hack around docsearch
      if (window.docsearch) {
        docsearch = window.docsearch.default || window.docsearch;
      }

      docsearch({
        apiKey: 'fac401d1a5f68bc41f01fb6261661490',
        indexName: 'webpack-js-org',
        inputSelector: '.navigation__search-input'
      });

      window.addEventListener('keyup', e => {
        if (e.which === 9 && e.target.classList.contains('navigation__search-input')) {
          this._openSearch();
        }
      });
    }
  }

  /**
   * Check if section is active
   *
   * @param {object} section - An object describing the section
   * @return {bool} - Whether or not the given section is active
   */
  _isActive(section) {
    let { pageUrl = '' } = this.props;

    if (section.children) {
      return section.children.some(child => pageUrl.includes(`${child.url}/`));

    } else return pageUrl.includes(`${section.url}/`);
  }

  /**
   * Toggle the SidebarMobile component
   *
   * @param {object} e - Native click event
   */
  _toggleSidebar(e) {
    let sidebar = document.querySelector('.sidebar-mobile');
    let modifier = 'sidebar-mobile--visible';

    sidebar.classList.toggle(modifier);
  }

  /**
   * Toggle the search input
   *
   */
  _toggleSearch() {
    let container = document.querySelector('.navigation');
    let input = document.querySelector('.navigation__search-input');
    let state = container.classList.toggle('navigation--search-mode');

    if ( state === true ) input.focus();
  }

  /**
   * Expand the search input
   *
   */
  _openSearch() {
    let container = document.querySelector('.navigation');

    container.classList.add('navigation--search-mode');
  }
}
