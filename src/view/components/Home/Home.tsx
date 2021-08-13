import React from "react";

import "Home.scss"
import useBookStorageBackendsInfo, { BookStorageBackendInfo } from "../../hooks/useBookStorageBackendsInfo";
import { ioc } from "../../../core/IoC";

export default () => {
  
  const backends = useBookStorageBackendsInfo()

  return <div className="egin-home">
    <div className="egin-home-content">
      <Header />

      <div>
        {backends.map((backend) =>
          <div key={backend.name}>
            <BackendTitle backend={backend}></BackendTitle>
            {backend.books.loading
              ? <BackendBooksLoading />
              : <BackendBooks backend={backend} />}
          </div>
        )}
      </div>

      <Footer />
    </div>
  </div>;

};

const Header = () => 
  <h1 className="egin-home-header">
    <img src="/icon.svg" />
    <span>Egin</span>
  </h1>

const Footer = () => 
  <div className="egin-home-footer">
    <span>Made with ❤️ by </span>
    <a href="https://sirikon.me" target="_blank">Sirikon</a>
    <span> | </span>
    <a href="https://github.com/sirikon/egin" target="_blank">Source Code</a>
  </div>

const BackendTitle = ({ backend }: { backend: BookStorageBackendInfo }) => {

  const login = async (backend: string) => {
    const url = await ioc.getBookStorage().getBackendAuthenticationUrl(backend);
    location.href = url;
  }

  return (
    <h3 className="egin-home-backend-title">
      <img src={backend.iconUrl} />
      <span>{backend.displayName}</span>
      {backend.isAuthenticated ?
        <button type="button">
          <span>+</span>
        </button>
        :
        <button className="is-login" onClick={() => login(backend.name)}>
          <span>Login</span>
        </button>
      }
    </h3>
  )
}

const BackendBooksLoading = () =>
  <span className="egin-home-tasklist-loading">...</span>

const BackendBooks = ({ backend }: { backend: BookStorageBackendInfo }) =>
  <div>
    {backend.books.data.map((book) =>
      <div>
        <a className="egin-home-tasklist-link" href={`#/${backend.name}/${book}`}>
          {book}
        </a>
      </div>
    )}
  </div>
