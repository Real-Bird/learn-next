import axios from "axios";

export default async function handler(req, res) {
  const username = req.query.username;
  const API_ENDPOINT = process.env.API_ENDPOINT;
  const API_TOKEN = process.env.API_TOKEN;

  const userReq = await axios.get(`${API_ENDPOINT}/api/04/users/${username}`, {
    headers: { Authorization: API_TOKEN },
  });

  res.status(200).json(userReq.data);
}
