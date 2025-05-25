import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function CallProtected() {
  const { getAccessTokenSilently } = useAuth0();

const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  const callApi = async () => {
    // if (!isAuthenticated) {
    //   console.log("User not authenticated");
    //   return;
    // }

    try {
      const token = await getAccessTokenSilently({
        audience: audience,
    });
    console.log('the token', token)
      const response = await fetch("http://127.0.0.1:3000/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log(text);
    } catch (error) {
      console.error("Error calling API", error);
    }
  };

  return <button onClick={callApi}>Call Protected API</button>;
}
