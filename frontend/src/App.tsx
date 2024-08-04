import { useEffect, useState } from "react";
import Header from "./Header";
import { getLeaderboard, getResult, Leaderboard, Options, play } from "./Web3Service";

function App() {
  const [message, setMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState<Leaderboard>();

  useEffect(() => {
    getLeaderboard()
      .then(leaderboard => setLeaderboard(leaderboard))
      .catch(err => setMessage(err.message))
  }, [])

  function onPlay(option: Options) {
    setLeaderboard({ ...leaderboard, result: "Sendind your choice..." });
    play(option)
      .then(tx => getResult())
      .then(result => setLeaderboard({ ...leaderboard, result }))
      .catch(err => setMessage(err.message));
  }

  return (
    < div className="container" >
      <Header />
      <main>
        <div className="py-5 text-center">
          <img className="d-block mx-auto mb-4" src="/logo512.png" alt="JoKenPo" width="72" />
          <h2>Leaderboard</h2>
          <p className="lead"> Change the best players score and play the game.</p>
          <p className="lead text-danger">{message}</p>
        </div>
        <div className="col-md-8 col-lg-12">
          <div className="row">
            <div className="col-sm-6"></div>
            <div className="col-sm-6">
              <h4 className="mb-3">Games</h4>
              <div className="card card-body body-0 shadow">
                <h5 className="mb-3 text-primary">Current Status:</h5>
                <div className="alert alert-success">{
                  leaderboard && leaderboard.result ? leaderboard.result : "Loading..."
                }
                </div>
                <h5 className="mb-3 text-primary">
                  {
                    leaderboard && leaderboard.result?.indexOf("won") != -1 || !leaderboard?.result ? "Start a new game: " : "Play this game: "
                  }
                </h5>
                <div className="d-flex">
                  <div className="col-sm-4">
                    <div className="alert alert-info play-button me-3" onClick={() => onPlay(Options.PAPER)}>
                      <img src="/assets/paper.png" alt="Paper" width={100} />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="alert alert-info play-button" onClick={() => onPlay(Options.ROCK)}>
                      <img src="/assets/rock.png" alt="Rock" width={100} />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="alert alert-info play-button ms-3" onClick={() => onPlay(Options.SCISSORS)}>
                      <img src="/assets/scissors.png" alt="Scissors" width={100} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div >
  );
}

export default App;
