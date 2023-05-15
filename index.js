const setup = async () => {
    console.log("setup");
    const result = await axios.get("http://localhost:3000/api/")
    console.log(result.data.results);

}

$(document).ready(setup)