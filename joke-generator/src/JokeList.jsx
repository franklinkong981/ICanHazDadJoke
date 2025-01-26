import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
const JokeList = ({numJokesToGet=5}) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //call the Dad Joke API to fetch numJokesToGet number of unique jokes, update state to include these jokes.
  const getJokes = async () => {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = [];
      let seenJokes = new Set();

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", { headers: { Accept: "application/json" } });
        //res.data is an object containing 3 attributes: id, joke, status.
        let { ...joke } = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          jokes.push({ ...joke, votes: 0 });
        } else {
          console.log("duplicate found!");
        }
      }

      this.setJokes(jokes => jokes);
      this.setIsLoading(isLoading => false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getJokes();
  }, []);

  //empty the state jokes list, set isLoading to true, and call getJokes.
  const generateNewJokes = () => {
    setIsLoading(isLoading => true);
    getJokes();
  };

  //change vote for the joke of a specific id by the delta parameter (upvote: delta = +1, downvote: delta = -1)
  const vote = (id, delta) => {
    setJokes(jokes => {
      return jokes.map(joke =>
        //For each joke in jokes, if id of joke matches id in parameter, change joke.votes to current joke.votes to delta, otherwise leave entire joke as is.
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      );
    });
  };

  //Return loading spinner or list of jokes sorted by net votes.
  let sortedJokes = [jokes].sort((a, b) => b.votes - a.votes);
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  //else
  return (
    <div className="JokeList">
        <button className="JokeList-getmore" onClick={generateNewJokes}>Get New Jokes</button>
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={vote}/>
        ))}
    </div>
  );
};

export default JokeList;
