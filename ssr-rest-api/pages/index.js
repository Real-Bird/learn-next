import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export async function getServerSideProps() {
  const usersReq = await axios.get(`${process.env.API_ENDPOINT}/api/04/users`);
  return {
    props: {
      users: usersReq.data,
    },
  };
}

function List({ users }) {
  console.log(users);
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link href={`/users/${user.username}`} passHref>
            {user.username}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Users() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const req = await fetch(`/api/04/users`);
      const users = await req.json();

      setLoading(false);
      setData(users);
    }

    fetchData();
  }, []);

  return (
    <div>
      {loading && <div>Loading users...</div>}
      {data && <List users={data} />}
    </div>
  );
}

export default Users;
