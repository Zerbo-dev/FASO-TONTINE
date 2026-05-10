function ProjectCard({ project, onVote }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-green-700">
        {project.title}
      </h3>

      <p className="text-gray-600 mt-2">
        {project.description}
      </p>

      <p className="mt-2 font-semibold">
        Montant demandé : {project.requested_amount} FCFA
      </p>

      <p className="text-sm text-gray-500">
        Localisation : {project.location}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onVote(project.id, "yes")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Oui
        </button>

        <button
          onClick={() => onVote(project.id, "no")}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Non
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;