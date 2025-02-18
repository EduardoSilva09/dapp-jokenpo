import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { doLogin } from './Web3Service'

function Login() {

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("account") !== null) {
      redirectAfterLogin(localStorage.getItem("isAdmin") === "true");
    }
  }, [])

  function redirectAfterLogin(isAdmin: boolean) {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/app");
    }
  }

  function OnConnectMetamaskClick() {
    setMessage("Logging in...");
    doLogin()
      .then(result => redirectAfterLogin(result.isAdmin))
      .catch(err => setMessage(err.message));
  }

  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="mb-auto">
        <div>
          <h3 className="float-md-start mb-0">DApp Jokenpo</h3>
          <nav className="nav nav-masthead justify-content-center float-md-end">
            <a className="nav-link fw-bold py-1 px-0 active" aria-current="page" href="#">Home</a>
            <a className="nav-link fw-bold py-1 px-0" href="#">About</a>
          </nav>
        </div>
      </header>

      <main className="px-3">
        <h1>Log in and play with us</h1>
        <p className="lead">Play JoKenPo (Rock-Paper-Scissors) like never before with our decentralized app (dapp).</p>
        <p className="lead">
          <a href="#" onClick={OnConnectMetamaskClick} className="btn btn-lg btn-light fw-bold border-white bg-white">
            <img src="/assets/metamask.svg" width={48} /> Log in with Metamask</a>
        </p>
        <p className='lead'>
          {message}
        </p>
      </main >

      <footer className="mt-auto text-white-50">
        <p>Built by <a href="https://github.com/EduardoSilva09" className="text-white">Eduardo</a>.</p>
      </footer>
    </div >
  );
}

export default Login;