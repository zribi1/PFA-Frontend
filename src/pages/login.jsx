import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [login, setLogin] = useState("");
  const [pswd, setPswd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        login,
        pswd
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.id_role === 2) {
        navigate("/");
      } else if (user.id_role === 3) {
        navigate("/myEmpAccount");
      } else {
        navigate("/not-authorized");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);

      if (err.response) {
        console.error("Réponse du serveur:", err.response.data);
        setError(
          err.response.data.message || "Erreur serveur: vérifiez votre identifiant ou mot de passe."
        );
      } else if (err.request) {
        console.error("Aucune réponse reçue:", err.request);
        setError("Le serveur ne répond pas. Veuillez réessayer plus tard.");
      } else {
        console.error("Erreur inattendue:", err.message);
        setError("Une erreur inattendue s'est produite.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border border-gray-200 bg-white">
        <CardContent className="p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Connexion</h1>
          <p className="text-sm text-center text-gray-500 mb-4">Accédez à votre espace sécurisé</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Login</label>
              <Input
                value={login}
                onChange={e => setLogin(e.target.value)}
                required
                placeholder="Nom d'utilisateur ou Email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <Input
                type="password"
                value={pswd}
                onChange={e => setPswd(e.target.value)}
                required
                placeholder="Mot de passe"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="pt-4">
              <Button type="submit" className="w-full py-2" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
