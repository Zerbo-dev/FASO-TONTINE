import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await API.get("/projects/");
      setProjects(response.data);
    } catch (err) {
      setError("Impossible de charger les projets.");
    } finally {
      setLoading(false);
    }
  }

  async function voteProject(projectId, vote) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Utilisateur non connecté.");
      return;
    }

    try {
      await API.post(`/projects/${projectId}/vote`, {
        user_id: user.id,
        vote,
      });

      alert("Vote enregistré");
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors du vote.");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Projets communautaires
        </h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && projects.length === 0 && (
          <p className="bg-white p-4 rounded-xl shadow">
            Aucun projet disponible.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onVote={voteProject}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Projects;