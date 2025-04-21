import { useEffect } from "react";
import { gapi } from "gapi-script";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

interface GoogleAuthButtonProps {
  onAuthSuccess: (token: string, email: string) => void;
}

const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onAuthSuccess,
}) => {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  const signIn = () => {
    gapi.auth2
      .getAuthInstance()
      .signIn()
      .then((user: any) => {
        const token = user.getAuthResponse().access_token;
        const email = user.getBasicProfile().getEmail();
        onAuthSuccess(token, email);
      });
  };

  return (
    <button
      onClick={signIn}
      className="bg-[#F93A0B] hover:bg-[#cc2c05] text-white font-bold py-2 px-4 rounded"
    >
      Login with Google
    </button>
  );
};

export default GoogleAuthButton;
