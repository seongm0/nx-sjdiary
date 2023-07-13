import axios from 'axios';
export function App() {
  const click = async () => {
    const url = 'http://localhost:8000';
    fetch(url)
      .then(async (res) => {
        console.log('Hello');
        console.log(res);
        const data = await res.json();
        console.log(data);
      })
      .catch((e) => {
        console.log('??');
        console.log(e);
      });

    try {
    const { data } = await axios.get(url);
    console.log(data);

    } catch (e) {
      console.log('!!');
      console.log(e);
    }
  };

  return (
    <div>
      <div>2</div>
      <button onClick={click}>Hello</button>
    </div>
  );
}

export default App;
