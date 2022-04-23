import fetch from "node-fetch";
import fs from "fs";

const payload = {
  form_id: "626472606fddfb4a1398b066",
  email: "",
  responses: [
    {
      question_id: "626472606fddfb4a1398b068",
      type: "MULTIPLE_CHOICE",
      choice: "626472606fddfb4a1398b06a",
    },
  ],
  submit_time: "1650752926000",
  storage_used: 0,
};

const increaseVotes = () => {
  const votes = fs.readFileSync("contador-de-votos.txt", "utf8");
  const newVotes = parseInt(votes) + 1;
  fs.writeFileSync("contador-de-votos.txt", newVotes.toString());
  console.log(`Voto computado: ${newVotes}`);
};

const vote = async (body) => {
  try {
    const request = await fetch("https://surveyheart.com/response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(body),
    });
    const response = await request.json();
    if (response.status === 200) {
      increaseVotes();
    }
  } catch (error) {
    console.error(error);  
  }
};

const main = async () => {
  for (let index = 0; index < 10000; index += 1) {
    await vote(payload);
  }
};

main();
