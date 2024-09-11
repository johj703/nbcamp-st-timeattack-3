import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import axios from "axios";
import { useState } from "react";

const fetchPosts = async () => {
  const { data } = await axios.get("http://localhost:4000/posts");
  console.log(data);
  return data;
};

const addPost = async () => {
  const { data } = await axios.post("http://localhost:3001/posts", newPost);
  return data;
};

function App() {
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const mutation = useMutation(addPost, {
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");

  if (isError) {
    return <div>에러가 일어났습니다.</div>;
  }

  if (isLoading) {
    return <div>로딩중 입니다.</div>;
  }

  console.log(data[0].title);
  console.log(data[0].views);

  return (
    <div>
      <h1>Posts</h1>
      <form>
        <input
          type="text"
          placeholder="타이틀"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="조회수"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
        <button type="submit">게시글 추가</button>
      </form>
      <ul>
        {data.map((post) => {
          return (
            <li key={post.id}>
              <p>{post.title}</p>
              <p>{post.views}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
