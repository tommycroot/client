import Axios from 'axios';
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Snippet from "./Snippet";
import SnippetEditor from "./SnippetEditor";
import "./Home.scss";
import UserContext from "../../context/UserContext";
import domain from "../../util/domain";
import example from "../../example.png";



function Home() {
  const [snippets, setSnippets] = useState([]);
  const [snippetEditorOpen, setSnippetEditorOpen] = useState(false);
  const [editSnippetData, setEditSnippetData] = useState(null);

  const { user } = useContext(UserContext);


  useEffect(() => {
    if (!user) setSnippets([]);
    else getSnippets();
  }, [user]);

  async function getSnippets() {
    const snippetsRes = await Axios.get(`${domain}/snippet/`);
    setSnippets(snippetsRes.data);
  }

  function editSnippet(snippetData) {
      setEditSnippetData(snippetData);
      setSnippetEditorOpen(true);
  }

  function renderSnippets() {

    let sortedSnippets = [...snippets];
    sortedSnippets = sortedSnippets.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })

    return sortedSnippets.map((snippet, i) => {
      return (
        <Snippet
          key={i}
          snippet={snippet}
          getSnippets={getSnippets}
          editSnippet={editSnippet}
        />
      );
    });
  }

  return (
    <div className="home">
      {!snippetEditorOpen && user && (
        <button
          className="btn-editor-toggle"
          onClick={() => setSnippetEditorOpen(true)}
        >
          Add snippet
        </button>
      )}
      {snippetEditorOpen && (
        <SnippetEditor
          setSnippetEditorOpen={setSnippetEditorOpen}
          getSnippets={getSnippets}
          editSnippetData={editSnippetData}
        />
      )}
      {snippets.length > 0
        ? renderSnippets()
       : user && (<p className="no-snippets-msg">No snippets have been added yet</p>
          )}
      {user === null && (
        <div className="no-user-message">
          <h2>Welcome to Snippet Manager</h2>
          <Link to="/register">Register here</Link>
          <p className="no-snippets-msgg">By Thomas Croot</p>
          <p className="no-snippets-msg">Best viewed in Chrome. This site requires a browser that enables third party cookies.</p>
          <p className="no-snippets-msgg">Save and edit your own snippets of code for later use!</p>
          <p className="image"><img src={example} alt="example"/> </p>
        </div>
      )}
    </div>
  );
}


export default Home;
